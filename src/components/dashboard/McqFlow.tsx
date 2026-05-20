import { useState } from "react";
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
  Flame,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Lightbulb,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Beginner level · foundations", icon: Sparkles, tone: "var(--neon-purple)" },
  { t: "Professional", d: "Intermediate · applied mastery", icon: Award, tone: "var(--neon-blue)" },
  { t: "Advanced", d: "Expert · competition grade", icon: Crown, tone: "oklch(0.82 0.16 85)" },
];

const subjects = [
  { t: "Physics", c: 24, i: Atom, tone: "var(--neon-purple)" },
  { t: "Chemistry", c: 18, i: FlaskConical, tone: "var(--neon-blue)" },
  { t: "Biology", c: 22, i: Dna, tone: "var(--neon-pink)" },
  { t: "Math", c: 30, i: Sigma, tone: "oklch(0.78 0.15 200)" },
  { t: "English", c: 14, i: Languages, tone: "oklch(0.75 0.18 150)" },
  { t: "ICT", c: 12, i: Cpu, tone: "oklch(0.78 0.18 60)" },
];

const chapters = [
  { t: "Kinematics", q: 120, diff: "Easy", p: 78 },
  { t: "Newton's Laws", q: 96, diff: "Medium", p: 54 },
  { t: "Work, Energy & Power", q: 88, diff: "Medium", p: 32 },
  { t: "Rotational Dynamics", q: 110, diff: "Hard", p: 12 },
  { t: "Gravitation", q: 74, diff: "Easy", p: 0 },
];

const diffColor: Record<string, string> = {
  Easy: "oklch(0.75 0.18 150)",
  Medium: "var(--neon-blue)",
  Hard: "var(--neon-pink)",
};

const options = [
  { k: "A", t: "v² = u² + 2as", correct: true },
  { k: "B", t: "v = u + at²" },
  { k: "C", t: "s = ut + ½at" },
  { k: "D", t: "a = (v − u)·t" },
];

const stepLabels = ["Level", "Subject", "Chapter", "Practice"];

export function McqFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [openChapter, setOpenChapter] = useState<string | null>("Kinematics");
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showExp, setShowExp] = useState(false);

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
                    onClick={() => setStep(i as Step)}
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
                    onClick={() => {
                      setLevel(l.t);
                      setStep(1);
                    }}
                    className={`group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1 ${
                      active ? "ring-2 ring-primary" : ""
                    }`}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Pick a subject</h2>
                <p className="text-sm text-muted-foreground">{level} Level · choose your battleground.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
              {subjects.map((s) => {
                const Icon = s.i;
                const active = subject === s.t;
                return (
                  <button
                    key={s.t}
                    onClick={() => {
                      setSubject(s.t);
                      setStep(2);
                    }}
                    className={`group relative rounded-3xl p-px text-left transition-transform hover:-translate-y-1 ${
                      active ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ background: `linear-gradient(135deg, ${s.tone}, transparent 65%)` }}
                  >
                    <div className="glass relative h-full overflow-hidden rounded-[calc(theme(borderRadius.3xl)-1px)] p-5">
                      <div
                        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-70"
                        style={{ background: s.tone }}
                      />
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                        style={{ background: `linear-gradient(135deg, ${s.tone}, oklch(0.55 0.2 270))` }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display mt-4 text-lg font-bold">{s.t}</h3>
                      <p className="text-xs text-muted-foreground">{s.c} chapters available</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 3 — CHAPTER */}
        {step === 2 && (
          <section className="animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Select a chapter</h2>
                <p className="text-sm text-muted-foreground">
                  {level} · {subject} — expand a chapter to see details.
                </p>
              </div>
            </div>
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
                          <p className="mt-0.5 text-xs text-muted-foreground">{c.q} MCQs · {c.p}% completed</p>
                        </div>
                        <div className="hidden w-40 sm:block">
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]"
                              style={{ width: `${c.p}%` }}
                            />
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      {open && (
                        <div className="animate-fade-up grid grid-cols-1 gap-3 border-t border-border bg-background/40 px-5 py-4 sm:grid-cols-3">
                          <div className="rounded-xl bg-card/40 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total MCQs</p>
                            <p className="font-display mt-1 text-lg font-bold">{c.q}</p>
                          </div>
                          <div className="rounded-xl bg-card/40 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Your accuracy</p>
                            <p className="font-display mt-1 text-lg font-bold text-gradient">{c.p}%</p>
                          </div>
                          <button
                            onClick={() => {
                              setChapter(c.t);
                              setStep(3);
                            }}
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
            </div>
          </section>
        )}

        {/* STEP 4 — PRACTICE */}
        {step === 3 && (
          <section className="animate-fade-up">
            <div className="glass shadow-glow relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="glass rounded-xl px-3 py-1.5 text-xs font-semibold">Q 07 / 25</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ background: diffColor.Medium }}
                  >
                    Medium
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="glass flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs">
                    <Clock className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> 00:42
                  </div>
                  <button className="glass flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-display relative mt-6 text-xl font-bold leading-snug sm:text-2xl">
                Which kinematic equation correctly relates final velocity, initial velocity, acceleration and displacement?
              </h3>

              <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map((o) => {
                  const isPicked = picked === o.k;
                  let state: "idle" | "correct" | "wrong" | "selected" = "idle";
                  if (revealed) {
                    if (o.correct) state = "correct";
                    else if (isPicked) state = "wrong";
                  } else if (isPicked) state = "selected";

                  const tone =
                    state === "correct"
                      ? "border-emerald-400/60 bg-emerald-400/10"
                      : state === "wrong"
                      ? "border-red-400/60 bg-red-400/10"
                      : state === "selected"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/40";

                  return (
                    <button
                      key={o.k}
                      onClick={() => !revealed && setPicked(o.k)}
                      className={`group relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${tone}`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold transition-all ${
                          state === "correct"
                            ? "bg-emerald-500 text-white"
                            : state === "wrong"
                            ? "bg-red-500 text-white"
                            : state === "selected"
                            ? "bg-cta-gradient text-white shadow-glow"
                            : "bg-muted text-foreground group-hover:bg-cta-gradient group-hover:text-white"
                        }`}
                      >
                        {state === "correct" ? <Check className="h-4 w-4" /> : state === "wrong" ? <X className="h-4 w-4" /> : o.k}
                      </span>
                      <span className="text-sm font-medium">{o.t}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="relative mt-5">
                <button
                  onClick={() => setShowExp((s) => !s)}
                  className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-transform hover:scale-[1.02]"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
                  Explanation
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExp ? "rotate-180" : ""}`} />
                </button>
                {showExp && (
                  <div className="animate-fade-up mt-3 rounded-2xl border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                    The third kinematic equation <span className="text-foreground font-semibold">v² = u² + 2as</span> eliminates time and directly relates the four scalar quantities — derived from integrating constant acceleration over displacement.
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button className="glass inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={() => {
                      setRevealed(false);
                      setPicked(null);
                    }}
                    className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
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
                <span className="font-semibold">7 / 25</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_12px_var(--neon-purple)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                <p className="font-display mt-1 text-xl font-bold text-gradient">92%</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
                <p className="font-display mt-1 flex items-center gap-1 text-xl font-bold">
                  <Flame className="h-4 w-4 text-[var(--neon-pink)]" /> 12
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attempted</p>
                <p className="font-display mt-1 text-xl font-bold">7</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</p>
                <p className="font-display mt-1 text-xl font-bold">18</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass shadow-card-soft rounded-3xl p-5">
          <h3 className="font-display text-base font-bold">Question Map</h3>
          <p className="text-xs text-muted-foreground">Jump to any question</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => {
              const isCurrent = i === 6;
              const isDone = i < 6;
              return (
                <button
                  key={i}
                  className={`flex h-9 items-center justify-center rounded-lg text-xs font-semibold transition-transform hover:scale-110 ${
                    isCurrent
                      ? "bg-cta-gradient text-white shadow-glow"
                      : isDone
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                      : "border border-border bg-card/40 text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
