import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Award,
  Crown,
  ChevronRight,
  Bookmark,
  Clock,
  ArrowLeft,
  ArrowRight,
  Check,
  LogOut,
  Trophy,
  RotateCw,
  Eye,
  Loader2,
  BookOpen,
} from "lucide-react";
import { listQuizzes, getQuiz, submitAttempt } from "@/lib/learning.functions";

type Step = 0 | 1 | 2;

const levels = [
  { t: "Certificate", d: "Beginner level", icon: Sparkles, tone: "var(--neon-purple)", match: "easy" },
  { t: "Professional", d: "Intermediate level", icon: Award, tone: "var(--neon-blue)", match: "medium" },
  { t: "Advanced", d: "Expert level", icon: Crown, tone: "oklch(0.82 0.16 85)", match: "hard" },
];

const diffColor: Record<string, string> = {
  easy: "oklch(0.75 0.18 150)",
  medium: "var(--neon-blue)",
  hard: "var(--neon-pink)",
};

const stepLabels = ["Level", "Quiz", "Play"];

type QuizQ = {
  position: number;
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  difficulty: string;
};

export function QuizFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<typeof levels[number] | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; score: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [startedAt, setStartedAt] = useState<number>(0);

  const listQuizzesFn = useServerFn(listQuizzes);
  const getQuizFn = useServerFn(getQuiz);
  const submitFn = useServerFn(submitAttempt);

  const quizzesQ = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => listQuizzesFn(),
  });
  const quizQ = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizFn({ data: { quizId: quizId! } }),
    enabled: !!quizId && step === 2,
  });

  const questions = ((quizQ.data?.questions ?? []) as unknown) as QuizQ[];
  const meta = quizQ.data?.quiz;
  const total = questions.length;
  const q = questions[current];

  useEffect(() => {
    if (step !== 2 || submitted || !meta) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [step, submitted, meta]);

  useEffect(() => {
    if (quizQ.data?.quiz && step === 2) {
      setTimeLeft(quizQ.data.quiz.duration_seconds ?? 600);
      setStartedAt(Date.now());
    }
  }, [quizQ.data, step]);

  useEffect(() => {
    if (step === 2 && !submitted && timeLeft === 0 && total > 0) {
      void doSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  const attempted = Object.keys(answers).length;
  const progress = total ? (attempted / total) * 100 : 0;

  const submitMut = useMutation({
    mutationFn: () =>
      submitFn({
        data: {
          quizId: quizId!,
          durationSeconds: Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
          answers: questions.map((qq) => ({
            mcqId: qq.id,
            chosen: (answers[qq.position - 1] as "A" | "B" | "C" | "D") ?? null,
            timeMs: 0,
          })),
        },
      }),
    onSuccess: (r) => {
      setResult({ correct: r.correct, total: r.total, score: r.score });
      setSubmitted(true);
    },
  });

  async function doSubmit() {
    if (submitMut.isPending || submitted) return;
    submitMut.mutate();
  }

  function resetAll() {
    setAnswers({});
    setBookmarks(new Set());
    setCurrent(0);
    setSubmitted(false);
    setResult(null);
    setTimeLeft(meta?.duration_seconds ?? 600);
    setStartedAt(Date.now());
  }

  const filteredQuizzes = (quizzesQ.data ?? []).filter((q2) =>
    !level ? true : q2.difficulty === level.match,
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        {/* Stepper */}
        <div className="glass shadow-card-soft rounded-2xl p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {stepLabels.map((l, i) => {
              const active = step === i;
              const done = i < step;
              return (
                <div key={l} className="flex items-center gap-2">
                  <button
                    onClick={() => i <= step && setStep(i as Step)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      active ? "bg-cta-gradient text-white shadow-glow"
                      : done ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                      active ? "bg-white/20" : done ? "bg-foreground/10" : "border border-border"
                    }`}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {l}
                  </button>
                  {i < stepLabels.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1 — LEVEL */}
        {step === 0 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Choose Quiz Level</h2>
            <p className="text-sm text-muted-foreground">Select a difficulty band to begin.</p>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {levels.map((l) => {
                const Icon = l.icon;
                return (
                  <button
                    key={l.t}
                    onClick={() => { setLevel(l); setStep(1); }}
                    className="group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1"
                    style={{ background: `linear-gradient(135deg, ${l.tone}, transparent 65%)` }}
                  >
                    <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-6">
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80" style={{ background: l.tone }} />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow" style={{ background: `linear-gradient(135deg, ${l.tone}, oklch(0.55 0.2 270))` }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display mt-5 text-xl font-bold">{l.t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
                      <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
                        Browse Quizzes <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2 — QUIZ PICKER */}
        {step === 1 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Pick a Quiz</h2>
            <p className="text-sm text-muted-foreground">{level?.t} Level · choose a quiz to attempt.</p>
            {quizzesQ.isLoading ? (
              <Loading />
            ) : filteredQuizzes.length === 0 ? (
              <Empty text="No quizzes for this level yet. Try another." />
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredQuizzes.map((qz) => (
                  <button
                    key={qz.id}
                    onClick={() => { setQuizId(qz.id); setStep(2); resetAll(); }}
                    className="glass shadow-card-soft group rounded-3xl p-5 text-left transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="bg-cta-gradient flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-glow">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize text-white" style={{ background: diffColor[qz.difficulty] }}>
                        {qz.difficulty}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-lg font-bold">{qz.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{qz.description ?? "Tap to start"}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{qz.total_questions} questions</span>
                      <span>{Math.round((qz.duration_seconds ?? 600) / 60)} min</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* STEP 3 — PLAY */}
        {step === 2 && !submitted && (
          <section className="animate-fade-up space-y-4">
            <div className="glass shadow-card-soft rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{level?.t}</p>
                  <h3 className="font-display text-lg font-bold">{meta?.title ?? "Loading…"}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${timeLeft < 60 ? "text-red-400" : "text-gradient"}`}>
                    <Clock className="h-4 w-4" /> {m}:{s}
                  </div>
                  <button onClick={() => setStep(1)} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-destructive/10">
                    <LogOut className="h-3.5 w-3.5" /> Exit
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all" style={{ width: `${progress}%`, boxShadow: "0 0 12px var(--neon-purple)" }} />
                </div>
                <span className="text-xs text-muted-foreground">{attempted}/{total}</span>
              </div>
            </div>

            <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

              {quizQ.isLoading || !q ? (
                <Loading />
              ) : (
                <>
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="glass rounded-xl px-3 py-1.5 text-xs font-semibold">Q {String(current + 1).padStart(2, "0")} / {total}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize text-white" style={{ background: diffColor[q.difficulty] ?? "var(--neon-blue)" }}>
                        {q.difficulty}
                      </span>
                    </div>
                    <button
                      onClick={() => { const b = new Set(bookmarks); b.has(current) ? b.delete(current) : b.add(current); setBookmarks(b); }}
                      className={`glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 ${bookmarks.has(current) ? "text-[var(--neon-pink)]" : ""}`}
                    >
                      <Bookmark className="h-4 w-4" fill={bookmarks.has(current) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">{q.question}</h3>

                  <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(["A", "B", "C", "D"] as const).map((k) => {
                      const text = (q as unknown as Record<string, string>)[`option_${k.toLowerCase()}`];
                      const isPicked = answers[current] === k;
                      return (
                        <button
                          key={k}
                          onClick={() => setAnswers({ ...answers, [current]: k })}
                          className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                            isPicked ? "border-primary bg-primary/10 shadow-glow"
                              : "border-border hover:border-primary/50 hover:bg-muted/40"
                          }`}
                        >
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
                            isPicked ? "bg-cta-gradient text-white shadow-glow"
                              : "bg-muted text-foreground group-hover:bg-cta-gradient group-hover:text-white"
                          }`}>
                            {k}
                          </span>
                          <span className="text-sm font-medium">{text}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                      disabled={current === 0}
                      className="glass inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={doSubmit}
                        disabled={submitMut.isPending}
                        className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        {submitMut.isPending ? "Submitting…" : "Submit Quiz"}
                      </button>
                      <button
                        onClick={() => current === total - 1 ? doSubmit() : setCurrent((c) => Math.min(total - 1, c + 1))}
                        disabled={submitMut.isPending}
                        className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50"
                      >
                        {current === total - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {submitMut.isError && (
                    <p className="mt-3 text-xs text-red-400">Could not submit. Please try again.</p>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT PANEL */}
      {step === 2 && !submitted && total > 0 && (
        <aside className="space-y-4">
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Question Navigator</h3>
            <p className="text-xs text-muted-foreground">Click any number to jump</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const isCurrent = i === current;
                const isDone = answers[i] !== undefined;
                const isBookmarked = bookmarks.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`relative flex h-10 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-110 ${
                      isCurrent ? "bg-cta-gradient text-white shadow-glow"
                      : isDone ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-400"
                      : "border border-border bg-card/40 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                    {isBookmarked && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--neon-pink)] shadow-[0_0_6px_var(--neon-pink)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Live Status</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Attempted" value={`${attempted}/${total}`} />
              <Stat label="Time Left" value={`${m}:${s}`} gradient />
              <Stat label="Bookmarked" value={String(bookmarks.size)} />
              <Stat label="Remaining" value={String(total - attempted)} />
            </div>
          </div>
        </aside>
      )}

      {/* RESULT POPUP */}
      {submitted && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md xl:col-span-2">
          <div className="glass shadow-glow animate-fade-up relative w-full max-w-lg overflow-hidden rounded-3xl p-px">
            <div className="bg-cta-gradient absolute inset-0 opacity-90" />
            <div className="relative rounded-[calc(theme(borderRadius.3xl)-1px)] bg-background/90 p-7 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/30 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />

              <div className="relative text-center">
                <div className="bg-cta-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow">
                  <Trophy className="h-6 w-6" />
                </div>
                <h2 className="font-display mt-4 text-2xl font-bold">Quiz Complete!</h2>
                <p className="text-sm text-muted-foreground">Saved to your attempt history.</p>

                <div className="relative mx-auto mt-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="qres" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.25 295)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.2 235)" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/40" />
                    <circle cx="60" cy="60" r="54" stroke="url(#qres)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="339" strokeDashoffset={339 - (339 * result.score) / 100} style={{ transition: "stroke-dashoffset 1.2s ease-out" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-3xl font-bold text-gradient">{result.score}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <Stat label="Correct" value={String(result.correct)} />
                  <Stat label="Wrong" value={String(Math.max(0, attempted - result.correct))} />
                  <Stat label="Skipped" value={String(Math.max(0, total - attempted))} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => { setSubmitted(false); }} className="glass inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]">
                    <Eye className="h-4 w-4" /> Review Answers
                  </button>
                  <button onClick={resetAll} className="bg-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
                    <RotateCw className="h-4 w-4" /> Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, gradient }: { label: string; value: string; gradient?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`font-display mt-1 text-xl font-bold ${gradient ? "text-gradient" : ""}`}>{value}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
