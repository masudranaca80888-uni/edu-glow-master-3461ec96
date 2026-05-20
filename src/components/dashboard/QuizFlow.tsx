import { useEffect, useState } from "react";
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
  ChevronRight,
  ChevronDown,
  Bookmark,
  Clock,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  LogOut,
  Trophy,
  RotateCw,
  Eye,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Beginner level", icon: Sparkles, tone: "var(--neon-purple)" },
  { t: "Professional", d: "Intermediate level", icon: Award, tone: "var(--neon-blue)" },
  { t: "Advanced", d: "Expert level", icon: Crown, tone: "oklch(0.82 0.16 85)" },
];

const subjects = [
  { t: "Physics", c: 24, i: Atom, tone: "var(--neon-purple)" },
  { t: "Chemistry", c: 18, i: FlaskConical, tone: "var(--neon-blue)" },
  { t: "Biology", c: 22, i: Dna, tone: "var(--neon-pink)" },
  { t: "Mathematics", c: 30, i: Sigma, tone: "oklch(0.78 0.15 200)" },
  { t: "English", c: 14, i: Languages, tone: "oklch(0.75 0.18 150)" },
  { t: "ICT", c: 12, i: Cpu, tone: "oklch(0.78 0.18 60)" },
];

const chapters = [
  { t: "Kinematics", q: 10, time: 10, diff: "Easy" },
  { t: "Newton's Laws", q: 10, time: 10, diff: "Medium" },
  { t: "Work, Energy & Power", q: 10, time: 12, diff: "Medium" },
  { t: "Rotational Dynamics", q: 10, time: 15, diff: "Hard" },
];

const diffColor: Record<string, string> = {
  Easy: "oklch(0.75 0.18 150)",
  Medium: "var(--neon-blue)",
  Hard: "var(--neon-pink)",
};

const questions = Array.from({ length: 10 }).map((_, i) => ({
  n: i + 1,
  q: `Sample physics question ${i + 1} — pick the correct option below.`,
  options: [
    { k: "A", t: "v² = u² + 2as", correct: true },
    { k: "B", t: "v = u + at²" },
    { k: "C", t: "s = ut + ½a" },
    { k: "D", t: "a = (v − u)·t" },
  ],
  diff: ["Easy", "Medium", "Hard"][i % 3],
}));

const stepLabels = ["Level", "Subject", "Chapter", "Start Quiz"];

export function QuizFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>("Kinematics");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (step !== 3 || submitted) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [step, submitted]);

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  const q = questions[current];
  const picked = answers[current];

  const correctCount = questions.filter((qq, i) => answers[i] === qq.options.find((o) => o.correct)?.k).length;
  const wrong = Object.keys(answers).length - correctCount;
  const accuracy = Object.keys(answers).length === 0 ? 0 : Math.round((correctCount / Object.keys(answers).length) * 100);
  const progress = (Object.keys(answers).length / questions.length) * 100;

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
                        : "text-muted-foreground"
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

        {/* STEP 1 */}
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
                    onClick={() => {
                      setLevel(l.t);
                      setStep(1);
                    }}
                    className="group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1"
                    style={{ background: `linear-gradient(135deg, ${l.tone}, transparent 65%)` }}
                  >
                    <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-6">
                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80"
                        style={{ background: l.tone }}
                      />
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow"
                        style={{ background: `linear-gradient(135deg, ${l.tone}, oklch(0.55 0.2 270))` }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display mt-5 text-xl font-bold">{l.t}</h3>
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

        {/* STEP 2 */}
        {step === 1 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Pick a Subject</h2>
            <p className="text-sm text-muted-foreground">{level} Level · choose your subject.</p>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
              {subjects.map((sub) => {
                const Icon = sub.i;
                return (
                  <button
                    key={sub.t}
                    onClick={() => {
                      setSubject(sub.t);
                      setStep(2);
                    }}
                    className="group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1"
                    style={{ background: `linear-gradient(135deg, ${sub.tone}, transparent 65%)` }}
                  >
                    <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-5">
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-70"
                        style={{ background: sub.tone }}
                      />
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                        style={{ background: `linear-gradient(135deg, ${sub.tone}, oklch(0.55 0.2 270))` }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display mt-4 text-lg font-bold">{sub.t}</h3>
                      <p className="text-xs text-muted-foreground">{sub.c} chapters · quiz ready</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <section className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold">Select a Chapter</h2>
            <p className="text-sm text-muted-foreground">
              {level} · {subject} — each quiz is 10 MCQs.
            </p>
            <div className="glass shadow-card-soft mt-5 overflow-hidden rounded-3xl">
              <ul className="divide-y divide-border">
                {chapters.map((c) => {
                  const open = openChapter === c.t;
                  return (
                    <li key={c.t}>
                      <button
                        onClick={() => setOpenChapter(open ? null : c.t)}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                      >
                        <div className="bg-cta-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow">
                          <Atom className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-display font-bold">{c.t}</p>
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                              style={{ background: diffColor[c.diff] }}
                            >
                              {c.diff}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {c.q} MCQs · ~{c.time} min
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      {open && (
                        <div className="animate-fade-up grid grid-cols-1 gap-3 border-t border-border bg-background/40 px-5 py-4 sm:grid-cols-3">
                          <div className="rounded-xl bg-card/40 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Questions</p>
                            <p className="font-display mt-1 text-lg font-bold">{c.q}</p>
                          </div>
                          <div className="rounded-xl bg-card/40 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
                            <p className="font-display mt-1 text-lg font-bold text-gradient">{c.time}:00</p>
                          </div>
                          <button
                            onClick={() => {
                              setChapter(c.t);
                              setStep(3);
                              setTimeLeft(c.time * 60);
                            }}
                            className="bg-cta-gradient inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                          >
                            Start Quiz <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* STEP 4 — QUIZ */}
        {step === 3 && !submitted && (
          <section className="animate-fade-up space-y-4">
            {/* Exam header */}
            <div className="glass shadow-card-soft rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{subject}</p>
                  <h3 className="font-display text-lg font-bold">{chapter} Quiz</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${
                      timeLeft < 60 ? "text-red-400" : "text-gradient"
                    }`}
                  >
                    <Clock className="h-4 w-4" /> {m}:{s}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="glass inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Exit
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all"
                    style={{ width: `${progress}%`, boxShadow: "0 0 12px var(--neon-purple)" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Object.keys(answers).length}/{questions.length}
                </span>
              </div>
            </div>

            {/* Question card */}
            <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="glass rounded-xl px-3 py-1.5 text-xs font-semibold">
                    Q {String(q.n).padStart(2, "0")} / 10
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: diffColor[q.diff] }}
                  >
                    {q.diff}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const b = new Set(bookmarks);
                    b.has(current) ? b.delete(current) : b.add(current);
                    setBookmarks(b);
                  }}
                  className={`glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 ${
                    bookmarks.has(current) ? "text-[var(--neon-pink)]" : ""
                  }`}
                >
                  <Bookmark className="h-4 w-4" fill={bookmarks.has(current) ? "currentColor" : "none"} />
                </button>
              </div>

              <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">{q.q}</h3>

              <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {q.options.map((o) => {
                  const isPicked = picked === o.k;
                  return (
                    <button
                      key={o.k}
                      onClick={() => setAnswers({ ...answers, [current]: o.k })}
                      className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isPicked
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50 hover:bg-muted/40"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
                          isPicked
                            ? "bg-cta-gradient text-white shadow-glow"
                            : "bg-muted text-foreground group-hover:bg-cta-gradient group-hover:text-white"
                        }`}
                      >
                        {o.k}
                      </span>
                      <span className="text-sm font-medium">{o.t}</span>
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
                    onClick={() => setSubmitted(true)}
                    className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Submit Quiz
                  </button>
                  <button
                    onClick={() =>
                      current === questions.length - 1
                        ? setSubmitted(true)
                        : setCurrent((c) => Math.min(questions.length - 1, c + 1))
                    }
                    className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    {current === questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* RIGHT PANEL */}
      {step === 3 && !submitted && (
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
                      isCurrent
                        ? "bg-cta-gradient text-white shadow-glow"
                        : isDone
                        ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-400"
                        : "border border-border bg-card/40 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                    {isBookmarked && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--neon-pink)] shadow-[0_0_6px_var(--neon-pink)]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Attempted
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Pending
              </div>
            </div>
          </div>

          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Live Performance</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attempted</p>
                <p className="font-display mt-1 text-xl font-bold">
                  {Object.keys(answers).length}
                  <span className="text-sm text-muted-foreground">/10</span>
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                <p className="font-display mt-1 text-xl font-bold text-gradient">{accuracy}%</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time Left</p>
                <p className="font-display mt-1 text-xl font-bold">
                  {m}:{s}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
                <p className="font-display mt-1 text-xl font-bold">{correctCount}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* RESULT POPUP */}
      {submitted && (
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
                <p className="text-sm text-muted-foreground">Here's how you performed.</p>

                <div className="relative mx-auto mt-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="qres" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.25 295)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.2 235)" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/40" />
                    <circle
                      cx="60" cy="60" r="54"
                      stroke="url(#qres)"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="339"
                      strokeDashoffset={339 - (339 * accuracy) / 100}
                      style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-3xl font-bold text-gradient">{accuracy}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-2">
                  {[
                    { l: "Correct", v: correctCount, c: "text-emerald-400" },
                    { l: "Wrong", v: wrong, c: "text-red-400" },
                    { l: "Skipped", v: questions.length - Object.keys(answers).length, c: "text-muted-foreground" },
                    { l: "Time", v: `${10 - Math.floor(timeLeft / 60)}m`, c: "text-gradient" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-3">
                      <p className={`font-display text-lg font-bold ${s.c}`}>{s.v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="glass inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  >
                    <Eye className="h-4 w-4" /> Review Answers
                  </button>
                  <button
                    onClick={() => {
                      setAnswers({});
                      setBookmarks(new Set());
                      setCurrent(0);
                      setSubmitted(false);
                      setTimeLeft(600);
                    }}
                    className="bg-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                  >
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
