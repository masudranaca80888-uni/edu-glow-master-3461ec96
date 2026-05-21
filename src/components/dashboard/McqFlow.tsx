import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles, Award, Crown, Atom, FlaskConical, Dna, Sigma, Languages, Cpu,
  BookOpen, ChevronRight, ChevronDown, Bookmark, Flame, ArrowLeft, ArrowRight,
  Check, X, Lightbulb, Loader2, Trophy, RotateCw, Eye, Clock, Target,
  CheckCircle2, XCircle, MinusCircle, BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { listSubjects, listChapters, listMcqs } from "@/lib/learning.functions";
import { saveSessionAttempt } from "@/lib/student-performance.functions";
import {
  toggleMcqBookmark,
  listMyBookmarkIds,
  recordMcqOutcomes,
} from "@/lib/mcq-review.functions";

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

type Choice = "A" | "B" | "C" | "D";
type AnswerRec = { chosen: Choice | null; timeMs: number } | undefined;

function normalizeChoice(value: string | null | undefined): Choice | null {
  const normalized = (value ?? "").trim().toUpperCase();
  return normalized === "A" || normalized === "B" || normalized === "C" || normalized === "D"
    ? normalized
    : null;
}

function debugMcq(label: string, payload?: unknown) {
  console.debug(`[MCQ Practice] ${label}`, payload ?? "");
}

function fmtDuration(sec: number) {
  if (!sec) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

export function McqFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [chapterName, setChapterName] = useState<string | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);
  const [showExp, setShowExp] = useState(false);
  const [answers, setAnswers] = useState<AnswerRec[]>([]);
  const [selectedOption, setSelectedOption] = useState<Choice | null>(null);
  const [sessionStart, setSessionStart] = useState<number>(0);
  const questionStartRef = useRef<number>(Date.now());
  const [finished, setFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAttemptId, setSavedAttemptId] = useState<string | null>(null);
  const autoFinishKeyRef = useRef<string | null>(null);

  const listSubjectsFn = useServerFn(listSubjects);
  const listChaptersFn = useServerFn(listChapters);
  const listMcqsFn = useServerFn(listMcqs);
  const saveAttemptFn = useServerFn(saveSessionAttempt);
  const toggleBookmarkFn = useServerFn(toggleMcqBookmark);
  const listBookmarkIdsFn = useServerFn(listMyBookmarkIds);
  const recordOutcomesFn = useServerFn(recordMcqOutcomes);
  const qc = useQueryClient();

  const bookmarksQ = useQuery({
    queryKey: ["my-bookmark-ids"],
    queryFn: () => listBookmarkIdsFn(),
    staleTime: 60_000,
  });
  const bookmarkSet = useMemo(
    () => new Set<string>(bookmarksQ.data ?? []),
    [bookmarksQ.data],
  );

  async function toggleBookmark(mcqId: string) {
    const wasBookmarked = bookmarkSet.has(mcqId);
    try {
      await toggleBookmarkFn({
        data: {
          mcqId,
          bookmarked: !wasBookmarked,
          chapterId: chapterId ?? null,
          subjectId: subjectId ?? null,
          level: level ?? null,
        },
      });
      qc.invalidateQueries({ queryKey: ["my-bookmark-ids"] });
      qc.invalidateQueries({ queryKey: ["mcq-bookmarks"] });
      qc.invalidateQueries({ queryKey: ["mcq-review-counts"] });
      toast.success(wasBookmarked ? "Bookmark removed" : "Bookmarked for review");
    } catch (e) {
      debugMcq("bookmark failed", e);
      toast.error("Could not update bookmark");
    }
  }

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

  const mcqs = useMemo(() => (mcqsQ.data ?? []) as Mcq[], [mcqsQ.data]);
  const total = mcqs.length;
  const q = mcqs[current];
  const currentAnswer = answers[current];
  const submittedNow = !!currentAnswer; // true once student clicks Submit (or Skip) for this question
  // Reveal correct/wrong + explanations ONLY in review or after finish.
  const revealResults = reviewMode || finished;
  const picked: Choice | null = submittedNow ? (currentAnswer?.chosen ?? null) : selectedOption;

  const options = q
    ? [
        { k: "A", t: q.option_a },
        { k: "B", t: q.option_b },
        { k: "C", t: q.option_c },
        { k: "D", t: q.option_d },
      ] as const
    : [];

  // Derived metrics
  const stats = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0, attempted = 0;
    answers.forEach((a, i) => {
      if (!a || !mcqs[i]) return;
      if (a.chosen === null) skipped++;
      else {
        attempted++;
        if (a.chosen === normalizeChoice(mcqs[i].correct_option)) correct++;
        else wrong++;
      }
    });
    const submitted = answers.filter(Boolean).length;
    const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
    const score = total ? Math.round((correct / total) * 100) : 0;
    return { correct, wrong, skipped, attempted, submitted, accuracy, score };
  }, [answers, mcqs, total]);

  const allSubmitted = total > 0 && stats.submitted === total;

  // reset question timer on navigation; rehydrate selectedOption from prior answer
  useEffect(() => {
    questionStartRef.current = Date.now();
    setShowExp(false);
    setSelectedOption(answers[current]?.chosen ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, chapterId]);

  function gotoChapter(id: string, name: string) {
    setChapterId(id);
    setChapterName(name);
    setStep(3);
    setCurrent(0);
    setShowExp(false);
    setAnswers([]);
    setSelectedOption(null);
    setFinished(false);
    setReviewMode(false);
    setSavedAttemptId(null);
    autoFinishKeyRef.current = null;
    setSessionStart(Date.now());
    questionStartRef.current = Date.now();
    debugMcq("chapter start", { chapterId: id, chapterName: name, level, subjectId, subjectName });
  }

  const buildCompletedAnswers = useCallback(
    (source: AnswerRec[]) => mcqs.map((_, i) => source[i] ?? { chosen: null, timeMs: 0 }),
    [mcqs],
  );

  function recordAnswer(chosen: Choice | null) {
    if (!q) return;
    const elapsed = Math.max(0, Date.now() - questionStartRef.current);
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = { chosen, timeMs: Math.min(elapsed, 60 * 60 * 1000) };
      debugMcq("answer recorded", {
        currentIndex: current,
        chosen,
        answeredCount: next.filter(Boolean).length,
        totalQuestions: total,
      });
      return next;
    });
  }

  function submitAnswer(chosen: Choice | null) {
    if (!q || reviewMode) return;
    // Manual submit only — records answer, NO auto-advance.
    debugMcq("submit trigger", { currentIndex: current, chosen, isLastQuestion: current === total - 1 });
    recordAnswer(chosen);
  }

  function nextQ() {
    if (current < total - 1) setCurrent((c) => c + 1);
  }
  function prevQ() {
    if (current > 0) setCurrent((c) => c - 1);
  }
  function jumpTo(i: number) {
    if (i >= 0 && i < total) setCurrent(i);
  }

  const finishPractice = useCallback(async (opts?: { auto?: boolean }) => {
    if (saving || (finished && savedAttemptId)) return;
    const finalizedAnswers = buildCompletedAnswers(answers);
    const totalDurationSec = Math.max(1, Math.round((Date.now() - (sessionStart || Date.now())) / 1000));
    const localCorrect = finalizedAnswers.reduce((sum, a, i) => (
      sum + (a?.chosen !== null && a?.chosen === normalizeChoice(mcqs[i]?.correct_option) ? 1 : 0)
    ), 0);
    const localSkipped = finalizedAnswers.filter((a) => a?.chosen === null).length;
    const localWrong = Math.max(0, total - localCorrect - localSkipped);
    const localAttempted = total - localSkipped;
    const localScore = total ? Math.round((localCorrect / total) * 100) : 0;
    const localAccuracy = localAttempted ? Math.round((localCorrect / localAttempted) * 100) : 0;

    debugMcq("finish trigger", {
      auto: !!opts?.auto,
      currentIndex: current,
      answeredCount: finalizedAnswers.filter(Boolean).length,
      totalQuestions: total,
      localCorrect,
      localWrong,
      localSkipped,
      localScore,
      localAccuracy,
    });

    // Mount the result screen immediately. The DB save runs after this so a
    // network/RLS failure can never strand the student on the last question.
    setAnswers(finalizedAnswers);
    setFinished(true);
    setReviewMode(false);
    setSaving(true);

    // Ensure answer record for every question (missing = skipped)
    const finalAnswers = mcqs.map((m, i) => {
      const a = finalizedAnswers[i];
      return {
        mcqId: m.id,
        chosen: a?.chosen ?? null,
        timeMs: Math.min(a?.timeMs ?? 0, 60 * 60 * 1000),
      };
    });

    try {
      const res = await saveAttemptFn({
        data: {
          kind: "mcq_practice",
          subjectId: subjectId ?? null,
          chapterId: chapterId ?? null,
          level: level ?? null,
          title: chapterName ?? "MCQ Practice",
          durationSeconds: totalDurationSec,
          answers: finalAnswers,
          meta: { auto: !!opts?.auto, score: localScore, accuracy: localAccuracy, correct: localCorrect, wrong: localWrong, skipped: localSkipped },
        },
      });
      setSavedAttemptId(res.attemptId);
      debugMcq("DB save success", { attemptId: res.attemptId, score: res.score, correct: res.correct, total: res.total });
      toast.success(opts?.auto ? "Practice auto-submitted" : "Practice complete!", {
        description: `Score ${res.score}% · ${res.correct}/${res.total} correct`,
      });
      // Record wrong/mastered outcomes for the Wrong Questions section
      try {
        const outcomes = mcqs.map((m, i) => {
          const a = finalizedAnswers[i];
          const correctOpt = normalizeChoice(m.correct_option);
          return {
            mcqId: m.id,
            chosen: a?.chosen ?? null,
            isCorrect: a?.chosen !== null && a?.chosen === correctOpt,
            correctOption: correctOpt,
          };
        });
        await recordOutcomesFn({
          data: {
            level: level ?? null,
            subjectId: subjectId ?? null,
            chapterId: chapterId ?? null,
            outcomes,
          },
        });
      } catch (e) {
        debugMcq("record outcomes failed", e);
      }
      // Refresh dashboard views immediately
      qc.invalidateQueries({ queryKey: ["student-performance-center"] });
      qc.invalidateQueries({ queryKey: ["student-completion-tracker"] });
      qc.invalidateQueries({ queryKey: ["exam-attempts"] });
      qc.invalidateQueries({ queryKey: ["mcq-wrong"] });
      qc.invalidateQueries({ queryKey: ["mcq-review-counts"] });
    } catch (e) {
      debugMcq("DB save failed", e);
      toast.error("Could not save attempt", {
        description: "Your result is shown. Please retry saving from this screen if needed.",
      });
    } finally {
      setSaving(false);
    }
  }, [answers, buildCompletedAnswers, chapterId, chapterName, current, finished, level, mcqs, qc, recordOutcomesFn, saveAttemptFn, savedAttemptId, saving, sessionStart, subjectId, total]);

  useEffect(() => {
    if (step !== 3 || total === 0) return;
    debugMcq("state", {
      currentIndex: current,
      answeredCount: stats.submitted,
      totalQuestions: total,
      allSubmitted,
      finished,
      saving,
      reviewMode,
    });
  }, [allSubmitted, current, finished, reviewMode, saving, stats.submitted, step, total]);




  function restartSame() {
    if (!chapterId || !chapterName) return;
    gotoChapter(chapterId, chapterName);
    mcqsQ.refetch();
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
                      active ? "bg-cta-gradient text-white shadow-glow"
                        : done ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
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

        {/* STEP 4 — PRACTICE / RESULT */}
        {step === 3 && (
          <section className="animate-fade-up">
            {/* RESULT SCREEN */}
            {finished && !reviewMode ? (
              <ResultScreen
                stats={stats}
                total={total}
                chapterName={chapterName}
                subjectName={subjectName}
                level={level}
                durationSec={Math.max(1, Math.round((Date.now() - sessionStart) / 1000))}
                mcqs={mcqs}
                answers={answers}
                onReview={() => { setReviewMode(true); setCurrent(0); }}
                onRetry={restartSame}
                onNewChapter={() => setStep(2)}
                savedAttemptId={savedAttemptId}
                saving={saving}
                onSaveRetry={() => finishPractice()}
              />
            ) : (
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
                        {reviewMode && (
                          <span className="rounded-full bg-[var(--neon-blue)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-blue)]">
                            <Eye className="mr-1 inline h-3 w-3" /> Review mode
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => q && toggleBookmark(q.id)}
                        title={bookmarkSet.has(q.id) ? "Remove bookmark" : "Bookmark this question"}
                        className={`glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 ${
                          bookmarkSet.has(q.id) ? "text-[var(--neon-purple)]" : ""
                        }`}
                      >
                        <Bookmark
                          className="h-4 w-4"
                          fill={bookmarkSet.has(q.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">
                      {q.question}
                    </h3>

                    <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {options.map((o) => {
                        const isPicked = picked === o.k;
                        const isCorrect = normalizeChoice(q.correct_option) === o.k;
                        let state: "idle" | "correct" | "wrong" | "selected" = "idle";
                        if (revealResults) {
                          // Only in review/finished: reveal right vs wrong
                          if (isCorrect) state = "correct";
                          else if (isPicked) state = "wrong";
                        } else if (isPicked) state = "selected";

                        const tone =
                          state === "correct" ? "border-emerald-400/60 bg-emerald-400/10"
                          : state === "wrong" ? "border-red-400/60 bg-red-400/10"
                          : state === "selected" ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/40";

                        // During practice: clicking picks an option (temporary). Submit is manual.
                        // Once submitted for this question, options lock until Previous/Next.
                        const clickable = !reviewMode && !submittedNow;
                        return (
                          <button
                            key={o.k}
                            onClick={() => clickable && setSelectedOption(o.k as Choice)}
                            disabled={!clickable}
                            className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${tone} disabled:cursor-default`}
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

                    {revealResults && q.explanation && (
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
                        onClick={prevQ}
                        disabled={current === 0}
                        className="glass inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-40"
                      >
                        <ArrowLeft className="h-4 w-4" /> Previous
                      </button>
                      <div className="flex flex-wrap gap-3">
                        {!reviewMode && !submittedNow && (
                          <>
                            <button
                              onClick={() => submitAnswer(null)}
                              className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                            >
                              Skip
                            </button>
                            <button
                              onClick={() => selectedOption && submitAnswer(selectedOption)}
                              disabled={!selectedOption}
                              className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                            >
                              <Check className="h-4 w-4" /> Submit Answer
                            </button>
                          </>
                        )}
                        {current < total - 1 ? (
                          <button
                            onClick={nextQ}
                            disabled={!reviewMode && !submittedNow}
                            className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                          >
                            Next <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : reviewMode ? (
                          <button
                            onClick={() => setReviewMode(false)}
                            className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                          >
                            Back to Result
                          </button>
                        ) : (
                          <button
                            onClick={() => finishPractice()}
                            disabled={saving || !submittedNow}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                            {saving ? "Saving…" : allSubmitted ? "Finish Practice" : `Finish (${stats.submitted}/${total})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            )}
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
                <span className="font-semibold">{stats.submitted} / {total || 0}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_12px_var(--neon-purple)] transition-all duration-500" style={{ width: total ? `${(stats.submitted / total) * 100}%` : "0%" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Accuracy" value={`${stats.accuracy}%`} gradient />
              <Stat label="Correct" value={String(stats.correct)} />
              <Stat label="Wrong" value={String(stats.wrong)} />
              <Stat label="Skipped" value={String(stats.skipped)} />
            </div>
          </div>
        </div>

        {step === 3 && total > 0 && (
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">Question Map</h3>
              {!finished && stats.submitted > 0 && (
                <button
                  onClick={() => finishPractice()}
                  disabled={saving}
                  className="rounded-lg bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  Finish
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{chapterName}</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {mcqs.map((m, i) => {
                const a = answers[i];
                const isCurrent = i === current;
                let cls = "border border-border bg-card/40 text-muted-foreground";
                if (isCurrent) cls = "bg-cta-gradient text-white shadow-glow";
                else if (a) {
                  if (finished || reviewMode) {
                    if (a.chosen === null) cls = "bg-amber-500/15 text-amber-400 border border-amber-400/30";
                    else if (a.chosen === normalizeChoice(m.correct_option)) cls = "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30";
                    else cls = "bg-rose-500/15 text-rose-400 border border-rose-400/30";
                  } else {
                    cls = "bg-[var(--neon-blue)]/15 text-[var(--neon-blue)] border border-[var(--neon-blue)]/30";
                  }
                }
                return (
                  <button
                    key={m.id}
                    onClick={() => jumpTo(i)}
                    className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-110 ${cls}`}
                    title={`Q${i + 1}${a ? (a.chosen === null ? " · skipped" : a.chosen === normalizeChoice(m.correct_option) ? " · correct" : " · wrong") : " · unattempted"}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-blue)]" /> answered</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-foreground/60" /> current</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full border border-border" /> unattempted</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Result screen                                                      */
/* ------------------------------------------------------------------ */

function ResultScreen({
  stats, total, chapterName, subjectName, level, durationSec,
  mcqs, answers, onReview, onRetry, onNewChapter, savedAttemptId, saving, onSaveRetry,
}: {
  stats: { correct: number; wrong: number; skipped: number; attempted: number; accuracy: number; score: number; submitted: number };
  total: number;
  chapterName: string | null;
  subjectName: string | null;
  level: string | null;
  durationSec: number;
  mcqs: Mcq[];
  answers: AnswerRec[];
  onReview: () => void;
  onRetry: () => void;
  onNewChapter: () => void;
  savedAttemptId: string | null;
  saving: boolean;
  onSaveRetry: () => void;
}) {
  const passed = stats.score >= 60;

  const diffPerf = useMemo(() => {
    const buckets: Record<string, { correct: number; total: number }> = {};
    mcqs.forEach((m, i) => {
      const k = (m.difficulty || "medium").toLowerCase();
      buckets[k] = buckets[k] ?? { correct: 0, total: 0 };
      buckets[k].total++;
      const a = answers[i];
      if (a && a.chosen === normalizeChoice(m.correct_option)) buckets[k].correct++;
    });
    return Object.entries(buckets).map(([k, v]) => ({
      key: k,
      label: k.charAt(0).toUpperCase() + k.slice(1),
      correct: v.correct,
      total: v.total,
      pct: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }));
  }, [mcqs, answers]);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
          style={{ background: passed ? "oklch(0.75 0.18 150 / 0.3)" : "var(--neon-pink) / 0.25" }} />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Practice Complete
            </span>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {passed ? "Great work!" : "Keep going — you got this."}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {level} · {subjectName} · {chapterName}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {new Date().toLocaleString()} {savedAttemptId ? "· saved" : ""}
            </p>
          </div>

          {/* Circular score */}
          <div className="relative">
            <svg width="140" height="140" className="-rotate-90">
              <circle cx="70" cy="70" r="60" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/40" />
              <circle
                cx="70" cy="70" r="60" strokeWidth="10" fill="none" strokeLinecap="round"
                stroke={passed ? "oklch(0.75 0.18 150)" : "var(--neon-pink)"}
                strokeDasharray={`${(stats.score / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                style={{ filter: `drop-shadow(0 0 10px ${passed ? "oklch(0.75 0.18 150)" : "var(--neon-pink)"})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-4xl font-bold ${passed ? "text-emerald-400" : "text-rose-400"}`}>
                {stats.score}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</span>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <ResultStat icon={Target} label="Accuracy" value={`${stats.accuracy}%`} tone="var(--neon-purple)" />
          <ResultStat icon={CheckCircle2} label="Correct" value={`${stats.correct}/${total}`} tone="oklch(0.75 0.18 150)" />
          <ResultStat icon={XCircle} label="Wrong" value={String(stats.wrong)} tone="var(--neon-pink)" />
          <ResultStat icon={MinusCircle} label="Skipped" value={String(stats.skipped)} tone="oklch(0.78 0.15 60)" />
          <ResultStat icon={Clock} label="Time" value={fmtDuration(durationSec)} tone="var(--neon-blue)" />
        </div>

        {/* Actions */}
        <div className="relative mt-6 flex flex-wrap gap-3">
          <button
            onClick={onReview}
            className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
          >
            <Eye className="h-4 w-4" /> Review Answers
          </button>
          <button
            onClick={onRetry}
            className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]"
          >
            <RotateCw className="h-4 w-4" /> Retry Chapter
          </button>
          <button
            onClick={onNewChapter}
            className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Pick Another Chapter
          </button>
          {!savedAttemptId && (
            <button
              onClick={onSaveRetry}
              disabled={saving}
              className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/15 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Attempt"}
            </button>
          )}
        </div>
      </div>

      {/* Difficulty perf */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass shadow-card-soft rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[var(--neon-blue)]" />
            <h3 className="font-display text-lg font-bold">Difficulty Breakdown</h3>
          </div>
          <p className="text-xs text-muted-foreground">How you did across question difficulties</p>
          <div className="mt-4 space-y-3">
            {diffPerf.length ? diffPerf.map((d) => (
              <div key={d.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize font-medium">{d.label}</span>
                  <span className="text-xs text-muted-foreground">{d.correct}/{d.total} · <b className="text-foreground">{d.pct}%</b></span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${d.pct}%`,
                      background: `linear-gradient(90deg, ${diffColor[d.key] ?? "var(--neon-blue)"}, var(--neon-purple))`,
                      boxShadow: `0 0 12px ${diffColor[d.key] ?? "var(--neon-blue)"}`,
                    }} />
                </div>
              </div>
            )) : <p className="text-xs text-muted-foreground">No data.</p>}
          </div>
        </div>

        <div className="glass shadow-card-soft rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--neon-purple)]" />
            <h3 className="font-display text-lg font-bold">Weak Spots</h3>
          </div>
          <p className="text-xs text-muted-foreground">Questions you got wrong — revisit these</p>
          <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
            {mcqs.map((m, i) => {
              const a = answers[i];
              if (!a || a.chosen === null || a.chosen === normalizeChoice(m.correct_option)) return null;
              return (
                <li key={m.id} className="rounded-xl bg-background/40 p-3 text-xs">
                  <p className="font-medium line-clamp-2">Q{i + 1}. {m.question}</p>
                  <p className="mt-1 text-[10px] text-rose-400">
                    Your answer: {a.chosen} · Correct: <b>{m.correct_option}</b>
                  </p>
                </li>
              );
            })}
            {stats.wrong === 0 && stats.skipped === 0 && (
              <li className="text-xs text-emerald-400">🎯 No weak spots — perfect run.</li>
            )}
            {stats.skipped > 0 && (
              <li className="rounded-xl border border-dashed border-amber-400/30 p-2 text-[10px] text-amber-400">
                {stats.skipped} skipped — open Review to attempt them.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ResultStat({ icon: Icon, label, value, tone }: {
  icon: typeof Target; label: string; value: string; tone: string;
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-3">
      <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-30 blur-xl" style={{ background: tone }} />
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" style={{ color: tone }} />
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
      <p className="font-display mt-1 text-lg font-bold">{value}</p>
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
