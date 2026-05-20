import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  Award,
  Crown,
  Atom,
  FlaskConical,
  Dna,
  Sigma,
  Languages,
  Cpu,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Flame,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { listSubjects, listChapters, listMcqs } from "@/lib/learning.functions";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Beginner level · foundations", icon: Sparkles, tone: "var(--neon-purple)" },
  { t: "Professional", d: "Intermediate · applied mastery", icon: Award, tone: "var(--neon-blue)" },
  { t: "Advanced", d: "Expert · competition grade", icon: Crown, tone: "oklch(0.82 0.16 85)" },
];

const subjectIconMap: Record<string, { i: typeof Atom; tone: string }> = {
  physics: { i: Atom, tone: "var(--neon-purple)" },
  chemistry: { i: FlaskConical, tone: "var(--neon-blue)" },
  biology: { i: Dna, tone: "var(--neon-pink)" },
  mathematics: { i: Sigma, tone: "oklch(0.78 0.15 200)" },
  math: { i: Sigma, tone: "oklch(0.78 0.15 200)" },
  english: { i: Languages, tone: "oklch(0.75 0.18 150)" },
  ict: { i: Cpu, tone: "oklch(0.78 0.18 60)" },
};
function iconFor(slug: string) {
  return subjectIconMap[slug?.toLowerCase()] ?? { i: BookOpen, tone: "var(--neon-purple)" };
}

const diffColor: Record<string, string> = {
  easy: "oklch(0.75 0.18 150)",
  medium: "var(--neon-blue)",
  hard: "var(--neon-pink)",
};

const stepLabels = ["Level", "Subject", "Chapter", "Practice"];

type Mcq = {
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

export function McqFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [chapterName, setChapterName] = useState<string | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const listSubjectsFn = useServerFn(listSubjects);
  const listChaptersFn = useServerFn(listChapters);
  const listMcqsFn = useServerFn(listMcqs);

  const subjectsQ = useQuery({
    queryKey: ["subjects"],
    queryFn: () => listSubjectsFn(),
  });
  const chaptersQ = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => listChaptersFn({ data: { subjectId: subjectId! } }),
    enabled: !!subjectId,
  });
  const mcqsQ = useQuery({
    queryKey: ["mcqs", chapterId],
    queryFn: () => listMcqsFn({ data: { chapterId: chapterId!, limit: 25 } }),
    enabled: !!chapterId && step === 3,
  });

  const mcqs = (mcqsQ.data ?? []) as Mcq[];
  const total = mcqs.length;
  const q = mcqs[current];
  const options = q
    ? [
        { k: "A", t: q.option_a },
        { k: "B", t: q.option_b },
        { k: "C", t: q.option_c },
        { k: "D", t: q.option_d },
      ]
    : [];
  const accuracy = attempted ? Math.round((correctCount / attempted) * 100) : 0;

  function gotoChapter(id: string, name: string) {
    setChapterId(id);
    setChapterName(name);
    setStep(3);
    setCurrent(0);
    setPicked(null);
    setRevealed(false);
    setShowExp(false);
    setCorrectCount(0);
    setAttempted(0);
  }

  function submitAnswer() {
    if (!q || picked === null || revealed) return;
    setRevealed(true);
    setAttempted((a) => a + 1);
    if (picked === q.correct_option) setCorrectCount((c) => c + 1);
  }

  function nextQ() {
    if (!q) return;
    setRevealed(false);
    setPicked(null);
    setShowExp(false);
    setCurrent((c) => Math.min(total - 1, c + 1));
  }

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
                      active
                        ? "bg-cta-gradient text-white shadow-glow"
                        : done
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        active ? "bg-white/20" : done ? "bg-foreground/10" : "border border-border"
                      }`}
                    >
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
            <h2 className="font-display text-2xl font-bold">Choose your level</h2>
            <p className="text-sm text-muted-foreground">Pick the difficulty band you want to train at.</p>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              {levels.map((l) => {
                const Icon = l.icon;
                const active = level === l.t;
                return (
                  <button
                    key={l.t}
                    onClick={() => { setLevel(l.t); setStep(1); }}
                    className={`group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1 ${active ? "ring-2 ring-primary" : ""}`}
                    style={{ background: `linear-gradient(135deg, ${l.tone}, transparent 65%)` }}
                  >
                    <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-6">
                      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80" style={{ background: l.tone }} />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow" style={{ background: `linear-gradient(135deg, ${l.tone}, oklch(0.55 0.2 270))` }}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display mt-5 text-xl font-bold">{l.t} Level</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{l.d}</p>
                      <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
                        Continue <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2 — SUBJECT */}
        {step === 1 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Pick a subject</h2>
            <p className="text-sm text-muted-foreground">{level} Level · choose your battleground.</p>
            {subjectsQ.isLoading ? (
              <LoadingBlock />
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
                {(subjectsQ.data ?? []).map((s) => {
                  const { i: Icon, tone } = iconFor(s.slug);
                  const active = subjectId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSubjectId(s.id); setSubjectName(s.name); setStep(2); }}
                      className={`group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1 ${active ? "ring-2 ring-primary" : ""}`}
                      style={{ background: `linear-gradient(135deg, ${tone}, transparent 65%)` }}
                    >
                      <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-5">
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-70" style={{ background: tone }} />
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${tone}, oklch(0.55 0.2 270))` }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display mt-4 text-lg font-bold">{s.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{s.description ?? "Tap to explore chapters"}</p>
                      </div>
                    </button>
                  );
                })}
                {!subjectsQ.isLoading && (subjectsQ.data ?? []).length === 0 && <EmptyState text="No subjects published yet." />}
              </div>
            )}
          </section>
        )}

        {/* STEP 3 — CHAPTER */}
        {step === 2 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Select a chapter</h2>
            <p className="text-sm text-muted-foreground">{level} · {subjectName}</p>
            <div className="glass shadow-card-soft mt-5 overflow-hidden rounded-3xl">
              {chaptersQ.isLoading ? (
                <LoadingBlock />
              ) : (chaptersQ.data ?? []).length === 0 ? (
                <EmptyState text="No chapters in this subject yet." />
              ) : (
                <ul className="divide-y divide-border">
                  {(chaptersQ.data ?? []).map((c) => {
                    const open = openChapter === c.id;
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => setOpenChapter(open ? null : c.id)}
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                        >
                          <div className="bg-cta-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow">
                            <Atom className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-bold">{c.name}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.description ?? "Tap to expand"}</p>
                          </div>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                        {open && (
                          <div className="animate-fade-up grid grid-cols-1 gap-3 border-t border-border bg-background/40 px-5 py-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-card/40 p-3 sm:col-span-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Chapter</p>
                              <p className="font-display mt-1 text-lg font-bold">{c.name}</p>
                            </div>
                            <button
                              onClick={() => gotoChapter(c.id, c.name)}
                              className="bg-cta-gradient inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                            >
                              Start Practice <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* STEP 4 — PRACTICE */}
        {step === 3 && (
          <section className="animate-fade-up">
            <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

              {mcqsQ.isLoading ? (
                <LoadingBlock />
              ) : total === 0 ? (
                <EmptyState text="No questions published in this chapter yet." />
              ) : q ? (
                <>
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="glass rounded-xl px-3 py-1.5 text-xs font-semibold">
                        Q {String(current + 1).padStart(2, "0")} / {total}
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize text-white" style={{ background: diffColor[q.difficulty] ?? "var(--neon-blue)" }}>
                        {q.difficulty}
                      </span>
                    </div>
                    <button className="glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">
                    {q.question}
                  </h3>

                  <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {options.map((o) => {
                      const isPicked = picked === o.k;
                      const isCorrect = q.correct_option === o.k;
                      let state: "idle" | "correct" | "wrong" | "selected" = "idle";
                      if (revealed) {
                        if (isCorrect) state = "correct";
                        else if (isPicked) state = "wrong";
                      } else if (isPicked) state = "selected";

                      const tone =
                        state === "correct" ? "border-emerald-400/60 bg-emerald-400/10"
                        : state === "wrong" ? "border-red-400/60 bg-red-400/10"
                        : state === "selected" ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/40";

                      return (
                        <button
                          key={o.k}
                          onClick={() => !revealed && setPicked(o.k)}
                          className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${tone}`}
                        >
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
                            state === "correct" ? "bg-emerald-500 text-white"
                            : state === "wrong" ? "bg-red-500 text-white"
                            : state === "selected" ? "bg-cta-gradient text-white shadow-glow"
                            : "bg-muted text-foreground group-hover:bg-cta-gradient group-hover:text-white"
                          }`}>
                            {state === "correct" ? <Check className="h-4 w-4" /> : state === "wrong" ? <X className="h-4 w-4" /> : o.k}
                          </span>
                          <span className="text-sm font-medium">{o.t}</span>
                        </button>
                      );
                    })}
                  </div>

                  {revealed && q.explanation && (
                    <div className="relative mt-5">
                      <button onClick={() => setShowExp((s) => !s)} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.02]">
                        <Lightbulb className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
                        Explanation
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExp ? "rotate-180" : ""}`} />
                      </button>
                      {showExp && (
                        <div className="animate-fade-up mt-3 rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      onClick={() => { setCurrent((c) => Math.max(0, c - 1)); setRevealed(false); setPicked(null); setShowExp(false); }}
                      disabled={current === 0}
                      className="glass inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={submitAnswer}
                        disabled={!picked || revealed}
                        className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        Submit Answer
                      </button>
                      <button
                        onClick={nextQ}
                        disabled={current >= total - 1}
                        className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-50"
                      >
                        Next <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT PANEL */}
      <aside className="space-y-4">
        <div className="glass shadow-card-soft rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Session</h3>
            <Flame className="h-4 w-4 text-[var(--neon-pink)]" />
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{Math.min(current + (revealed ? 1 : 0), total)} / {total || 0}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_12px_var(--neon-purple)]" style={{ width: total ? `${(Math.min(current + (revealed ? 1 : 0), total) / total) * 100}%` : "0%" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Accuracy" value={`${accuracy}%`} gradient />
              <Stat label="Correct" value={String(correctCount)} />
              <Stat label="Attempted" value={String(attempted)} />
              <Stat label="Remaining" value={String(Math.max(0, total - current - (revealed ? 1 : 0)))} />
            </div>
          </div>
        </div>

        {step === 3 && total > 0 && (
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Question Map</h3>
            <p className="text-xs text-muted-foreground">{chapterName}</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {mcqs.map((_, i) => {
                const isCurrent = i === current;
                const isDone = i < current || (i === current && revealed);
                return (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setRevealed(false); setPicked(null); setShowExp(false); }}
                    className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-110 ${
                      isCurrent ? "bg-cta-gradient text-white shadow-glow"
                      : isDone ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                      : "border border-border bg-card/40 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
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

function LoadingBlock() {
  return (
    <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

import { Clock as _C } from "lucide-react";
void _C;
