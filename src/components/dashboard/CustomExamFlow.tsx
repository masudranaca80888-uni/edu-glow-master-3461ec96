import { useEffect, useState } from "react";
import {
  Sparkles, Award, Crown,
  Atom, FlaskConical, Dna, Sigma, Languages, Cpu,
  ChevronRight, ChevronDown, Check, ArrowLeft, ArrowRight,
  Clock, Bookmark, LogOut, Trophy, RotateCw, Download,
  Settings2, ListChecks, Timer as TimerIcon, Shuffle, Sparkle,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3 | 4;

const levels = [
  { t: "Certificate", d: "Beginner foundations", icon: Sparkles, tone: "var(--neon-purple)" },
  { t: "Professional", d: "Intermediate mastery", icon: Award, tone: "var(--neon-blue)" },
  { t: "Advanced", d: "Expert grade", icon: Crown, tone: "oklch(0.82 0.16 85)" },
];
const subjects = [
  { t: "Physics", chap: 24, mcq: 1820, i: Atom, tone: "var(--neon-purple)" },
  { t: "Chemistry", chap: 18, mcq: 1340, i: FlaskConical, tone: "var(--neon-blue)" },
  { t: "Biology", chap: 22, mcq: 1610, i: Dna, tone: "var(--neon-pink)" },
  { t: "Mathematics", chap: 30, mcq: 2400, i: Sigma, tone: "oklch(0.78 0.15 200)" },
  { t: "English", chap: 14, mcq: 940, i: Languages, tone: "oklch(0.75 0.18 150)" },
  { t: "ICT", chap: 12, mcq: 780, i: Cpu, tone: "oklch(0.78 0.18 60)" },
];
const chapters = [
  { t: "Kinematics", q: 120, p: 78, diff: "Easy" },
  { t: "Newton's Laws", q: 96, p: 54, diff: "Medium" },
  { t: "Work, Energy & Power", q: 88, p: 32, diff: "Medium" },
  { t: "Rotational Dynamics", q: 110, p: 12, diff: "Hard" },
  { t: "Gravitation", q: 74, p: 0, diff: "Easy" },
];
const diffColor: Record<string, string> = {
  Easy: "oklch(0.75 0.18 150)",
  Medium: "var(--neon-blue)",
  Hard: "var(--neon-pink)",
};
const stepLabels = ["Level", "Subject", "Chapter", "Setup", "Exam"];
const mcqPresets = [10, 20, 30, 50];
const timePresets = [10, 20, 30, 60];

export function CustomExamFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [openChap, setOpenChap] = useState<string | null>("Kinematics");
  const [selectedChaps, setSelectedChaps] = useState<Set<string>>(new Set());

  const [mcqCount, setMcqCount] = useState(20);
  const [customMcq, setCustomMcq] = useState(false);
  const [duration, setDuration] = useState(30);
  const [customDur, setCustomDur] = useState(false);
  const [includePrev, setIncludePrev] = useState(true);
  const [randomize, setRandomize] = useState(true);

  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (!started || submitted) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [started, submitted]);

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  const toggleChap = (t: string) => {
    const n = new Set(selectedChaps);
    n.has(t) ? n.delete(t) : n.add(t);
    setSelectedChaps(n);
  };

  const examQs = Array.from({ length: mcqCount }).map((_, i) => ({
    n: i + 1,
    q: `Custom exam question ${i + 1} — select the correct option below.`,
    options: [
      { k: "A", t: "Option Alpha — definitive choice", correct: true },
      { k: "B", t: "Option Beta — close distractor" },
      { k: "C", t: "Option Gamma — common mistake" },
      { k: "D", t: "Option Delta — unrelated" },
    ],
    diff: ["Easy", "Medium", "Hard"][i % 3],
  }));

  const correctCount = examQs.filter((qq, i) => answers[i] === qq.options.find((o) => o.correct)?.k).length;
  const wrong = Object.keys(answers).length - correctCount;
  const accuracy = Object.keys(answers).length === 0 ? 0 : Math.round((correctCount / Object.keys(answers).length) * 100);
  const progress = (Object.keys(answers).length / mcqCount) * 100;

  const totalAvail = chapters.filter((c) => selectedChaps.has(c.t)).reduce((a, b) => a + b.q, 0);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-5">
        {/* Header */}
        {!started && (
          <div className="animate-fade-up">
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Create Your <span className="text-gradient">Custom Exam</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Choose your level, subject, chapters, question amount and exam duration.
            </p>
          </div>
        )}

        {/* Stepper */}
        {!started && (
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
        )}

        {/* STEP 1 */}
        {!started && step === 0 && (
          <section className="animate-fade-up grid grid-cols-1 gap-5 md:grid-cols-3">
            {levels.map((l) => {
              const Icon = l.icon;
              return (
                <button key={l.t} onClick={() => { setLevel(l.t); setStep(1); }}
                  className="group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, ${l.tone}, transparent 65%)` }}
                >
                  <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-6">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-80"
                      style={{ background: l.tone }} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow"
                      style={{ background: `linear-gradient(135deg, ${l.tone}, oklch(0.55 0.2 270))` }}>
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
          </section>
        )}

        {/* STEP 2 */}
        {!started && step === 1 && (
          <section className="animate-fade-up grid grid-cols-2 gap-4 md:grid-cols-3">
            {subjects.map((sub) => {
              const Icon = sub.i;
              return (
                <button key={sub.t} onClick={() => { setSubject(sub.t); setStep(2); }}
                  className="group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, ${sub.tone}, transparent 65%)` }}
                >
                  <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-5">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-70"
                      style={{ background: sub.tone }} />
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                      style={{ background: `linear-gradient(135deg, ${sub.tone}, oklch(0.55 0.2 270))` }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display mt-4 text-lg font-bold">{sub.t}</h3>
                    <p className="text-xs text-muted-foreground">{sub.chap} chapters · {sub.mcq.toLocaleString()} MCQs</p>
                  </div>
                </button>
              );
            })}
          </section>
        )}

        {/* STEP 3 — multi-select chapters */}
        {!started && step === 2 && (
          <section className="animate-fade-up space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{selectedChaps.size}</span> chapter(s) selected · <span className="text-foreground font-semibold">{totalAvail}</span> MCQs available
              </p>
              <button
                onClick={() => selectedChaps.size > 0 && setStep(3)}
                disabled={selectedChaps.size === 0}
                className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-40"
              >
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="glass shadow-card-soft overflow-hidden rounded-3xl">
              <ul className="divide-y divide-border">
                {chapters.map((c) => {
                  const open = openChap === c.t;
                  const checked = selectedChaps.has(c.t);
                  return (
                    <li key={c.t}>
                      <div className="flex items-stretch">
                        <button
                          onClick={() => toggleChap(c.t)}
                          className={`flex w-12 shrink-0 items-center justify-center transition-colors ${
                            checked ? "bg-cta-gradient text-white" : "hover:bg-muted"
                          }`}
                          aria-label="Select chapter"
                        >
                          <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            checked ? "border-white bg-white/20" : "border-border"
                          }`}>
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                        </button>
                        <button
                          onClick={() => setOpenChap(open ? null : c.t)}
                          className="flex flex-1 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
                        >
                          <div className="bg-cta-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow">
                            <Atom className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-display font-bold">{c.t}</p>
                              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: diffColor[c.diff] }}>
                                {c.diff}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">{c.q} MCQs available · {c.p}% mastered</p>
                          </div>
                          <div className="hidden w-32 sm:block">
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]"
                                style={{ width: `${c.p}%` }} />
                            </div>
                          </div>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                      {open && (
                        <div className="animate-fade-up grid grid-cols-2 gap-3 border-t border-border bg-background/40 px-5 py-4 sm:grid-cols-4">
                          {[
                            { l: "MCQs", v: c.q },
                            { l: "Mastery", v: `${c.p}%` },
                            { l: "Difficulty", v: c.diff },
                            { l: "Avg Time", v: "1.2m" },
                          ].map((x) => (
                            <div key={x.l} className="rounded-xl bg-card/40 p-3">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{x.l}</p>
                              <p className="font-display mt-1 text-sm font-bold">{x.v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* STEP 4 — SETUP */}
        {!started && step === 3 && (
          <section className="animate-fade-up grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="glass shadow-card-soft rounded-3xl p-6 lg:col-span-2">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-[var(--neon-purple)]" />
                <h3 className="font-display text-lg font-bold">Exam Configuration</h3>
              </div>

              {/* MCQ count */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Number of MCQs</p>
                  <p className="text-xs text-muted-foreground">Max available: {totalAvail}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mcqPresets.map((n) => {
                    const active = !customMcq && mcqCount === n;
                    return (
                      <button key={n}
                        onClick={() => { setCustomMcq(false); setMcqCount(n); }}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                          active ? "bg-cta-gradient text-white shadow-glow" : "glass hover:scale-[1.02]"
                        }`}>
                        {n}
                      </button>
                    );
                  })}
                  <button onClick={() => setCustomMcq(true)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      customMcq ? "bg-cta-gradient text-white shadow-glow" : "glass hover:scale-[1.02]"
                    }`}>Custom</button>
                  {customMcq && (
                    <input
                      type="number" min={1} max={totalAvail || 200}
                      value={mcqCount}
                      onChange={(e) => setMcqCount(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 w-24 rounded-xl border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary"
                    />
                  )}
                </div>
              </div>

              {/* Duration */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Exam Duration</p>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {timePresets.map((n) => {
                    const active = !customDur && duration === n;
                    return (
                      <button key={n}
                        onClick={() => { setCustomDur(false); setDuration(n); }}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                          active ? "bg-cta-gradient text-white shadow-glow" : "glass hover:scale-[1.02]"
                        }`}>{n} min</button>
                    );
                  })}
                  <button onClick={() => setCustomDur(true)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      customDur ? "bg-cta-gradient text-white shadow-glow" : "glass hover:scale-[1.02]"
                    }`}>Custom</button>
                  {customDur && (
                    <input
                      type="number" min={1} max={300}
                      value={duration}
                      onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 w-24 rounded-xl border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary"
                    />
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="mt-6 space-y-3">
                <Toggle icon={Sparkle} label="Include previously attempted questions"
                  desc="Mix older MCQs back into this exam" value={includePrev} onChange={setIncludePrev} />
                <Toggle icon={Shuffle} label="Randomize question order"
                  desc="Shuffle question sequence on start" value={randomize} onChange={setRandomize} />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--neon-purple)]/30 blur-3xl" />
                <h3 className="font-display text-lg font-bold">Live Summary</h3>
                <p className="text-xs text-muted-foreground">Real-time exam blueprint</p>
                <ul className="mt-5 space-y-3 text-sm">
                  <Row icon={ListChecks} l="Total Questions" v={String(mcqCount)} />
                  <Row icon={Sparkle} l="Total Marks" v={String(mcqCount)} />
                  <Row icon={TimerIcon} l="Estimated Time" v={`${duration} min`} />
                  <Row icon={Atom} l="Selected Chapters" v={String(selectedChaps.size || "—")} />
                </ul>
                <button
                  onClick={() => { setStarted(true); setStep(4); setTimeLeft(duration * 60); }}
                  disabled={selectedChaps.size === 0}
                  className="bg-cta-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-40"
                >
                  Generate Custom Exam <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* EXAM RUNNING */}
        {started && !submitted && (
          <section className="animate-fade-up space-y-4">
            <div className="glass shadow-card-soft rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{subject} · {level}</p>
                  <h3 className="font-display text-lg font-bold">Custom Exam</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold ${
                    timeLeft < 60 ? "text-red-400" : "text-gradient"
                  }`}>
                    <Clock className="h-4 w-4" /> {m}:{s}
                  </div>
                  <button onClick={() => { setStarted(false); setStep(3); }}
                    className="glass inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-destructive/10">
                    <LogOut className="h-3.5 w-3.5" /> Exit
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all"
                    style={{ width: `${progress}%`, boxShadow: "0 0 12px var(--neon-purple)" }} />
                </div>
                <span className="text-xs text-muted-foreground">{Object.keys(answers).length}/{mcqCount}</span>
              </div>
            </div>

            <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="glass rounded-xl px-3 py-1.5 text-xs font-semibold">
                    Q {String(current + 1).padStart(2, "0")} / {mcqCount}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: diffColor[examQs[current].diff] }}>
                    {examQs[current].diff}
                  </span>
                </div>
                <button onClick={() => {
                  const b = new Set(bookmarks);
                  b.has(current) ? b.delete(current) : b.add(current);
                  setBookmarks(b);
                }}
                  className={`glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105 ${
                    bookmarks.has(current) ? "text-[var(--neon-pink)]" : ""
                  }`}>
                  <Bookmark className="h-4 w-4" fill={bookmarks.has(current) ? "currentColor" : "none"} />
                </button>
              </div>

              <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">
                {examQs[current].q}
              </h3>

              <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {examQs[current].options.map((o) => {
                  const isPicked = answers[current] === o.k;
                  return (
                    <button key={o.k}
                      onClick={() => setAnswers({ ...answers, [current]: o.k })}
                      className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isPicked ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50 hover:bg-muted/40"
                      }`}>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
                        isPicked ? "bg-cta-gradient text-white shadow-glow"
                          : "bg-muted text-foreground group-hover:bg-cta-gradient group-hover:text-white"
                      }`}>
                        {o.k}
                      </span>
                      <span className="text-sm font-medium">{o.t}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
                  className="glass inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-40">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setSubmitted(true)}
                    className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
                    Submit Exam
                  </button>
                  <button onClick={() => current === mcqCount - 1 ? setSubmitted(true) : setCurrent((c) => Math.min(mcqCount - 1, c + 1))}
                    className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
                    {current === mcqCount - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* RIGHT PANEL */}
      {started && !submitted && (
        <aside className="space-y-4">
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Question Navigator</h3>
            <p className="text-xs text-muted-foreground">{mcqCount} questions total</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: mcqCount }).map((_, i) => {
                const isCurrent = i === current;
                const isDone = answers[i] !== undefined;
                const isBookmarked = bookmarks.has(i);
                return (
                  <button key={i} onClick={() => setCurrent(i)}
                    className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-110 ${
                      isCurrent ? "bg-cta-gradient text-white shadow-glow"
                        : isDone ? "border border-emerald-400/40 bg-emerald-500/15 text-emerald-400"
                        : "border border-border bg-card/40 text-muted-foreground"
                    }`}>
                    {i + 1}
                    {isBookmarked && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[var(--neon-pink)] shadow-[0_0_6px_var(--neon-pink)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass shadow-card-soft rounded-3xl p-5">
            <h3 className="font-display text-base font-bold">Performance</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat l="Attempted" v={`${Object.keys(answers).length}/${mcqCount}`} />
              <Stat l="Remaining" v={String(mcqCount - Object.keys(answers).length)} />
              <Stat l="Accuracy" v={`${accuracy}%`} gradient />
              <Stat l="Time" v={`${m}:${s}`} />
            </div>
          </div>
        </aside>
      )}

      {/* RESULT */}
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
                <h2 className="font-display mt-4 text-2xl font-bold">Exam Complete!</h2>
                <p className="text-sm text-muted-foreground">Custom exam result</p>

                <div className="relative mx-auto mt-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="cres" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.25 295)" />
                        <stop offset="100%" stopColor="oklch(0.72 0.2 235)" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/40" />
                    <circle cx="60" cy="60" r="54" stroke="url(#cres)" strokeWidth="10" fill="none" strokeLinecap="round"
                      strokeDasharray="339" strokeDashoffset={339 - (339 * accuracy) / 100}
                      style={{ transition: "stroke-dashoffset 1.2s ease-out" }} />
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
                    { l: "Skipped", v: mcqCount - Object.keys(answers).length, c: "text-muted-foreground" },
                    { l: "Time", v: `${duration - Math.floor(timeLeft / 60)}m`, c: "text-gradient" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-2xl border border-border bg-card/40 p-3">
                      <p className={`font-display text-lg font-bold ${x.c}`}>{x.v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{x.l}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button className="glass inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]">
                    <Download className="h-4 w-4" /> Download Result
                  </button>
                  <button onClick={() => {
                    setAnswers({}); setBookmarks(new Set()); setCurrent(0);
                    setSubmitted(false); setTimeLeft(duration * 60);
                  }}
                    className="bg-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
                    <RotateCw className="h-4 w-4" /> Retry Exam
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

function Toggle({ icon: Icon, label, desc, value, onChange }: {
  icon: any; label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-3">
        <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-glow">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-[10px] text-muted-foreground">{desc}</p>
        </div>
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-cta-gradient shadow-glow" : "bg-muted"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function Row({ icon: Icon, l, v }: { icon: any; l: string; v: string }) {
  return (
    <li className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2.5">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {l}
      </span>
      <span className="font-display font-bold">{v}</span>
    </li>
  );
}

function Stat({ l, v, gradient }: { l: string; v: string; gradient?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
      <p className={`font-display mt-1 text-xl font-bold ${gradient ? "text-gradient" : ""}`}>{v}</p>
    </div>
  );
}
