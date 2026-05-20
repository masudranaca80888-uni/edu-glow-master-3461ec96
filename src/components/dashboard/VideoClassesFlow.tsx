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
  PlayCircle,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Settings2,
  Bookmark,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  BookOpen,
  ListChecks,
  Layers,
  FileText,
  Users,
  Star,
  ArrowUpRight,
  SkipForward,
  SkipBack,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Beginner-friendly lessons", i: Sparkles, c: "from-sky-500 to-indigo-500" },
  { t: "Professional", d: "Board & university grade", i: Award, c: "from-[var(--neon-purple)] to-fuchsia-500" },
  { t: "Advanced", d: "Olympiad & mastery", i: Crown, c: "from-amber-400 to-rose-500" },
];

const subjects = [
  { t: "Physics", videos: 184, chapters: 14, hours: 62, i: Atom, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
  { t: "Chemistry", videos: 156, chapters: 12, hours: 54, i: FlaskConical, c: "from-fuchsia-500 to-purple-600" },
  { t: "Biology", videos: 198, chapters: 16, hours: 72, i: Dna, c: "from-emerald-500 to-cyan-500" },
  { t: "Mathematics", videos: 220, chapters: 18, hours: 88, i: Sigma, c: "from-amber-500 to-pink-500" },
  { t: "English", videos: 86, chapters: 8, hours: 28, i: Languages, c: "from-sky-500 to-indigo-500" },
  { t: "ICT", videos: 74, chapters: 9, hours: 24, i: Cpu, c: "from-violet-500 to-blue-600" },
];

const chapters = [
  { t: "Kinematics", videos: 12, hours: 4.5, progress: 75, updated: true },
  { t: "Newton's Laws of Motion", videos: 14, hours: 5.2, progress: 60, updated: true },
  { t: "Work, Energy & Power", videos: 11, hours: 4.1, progress: 90, updated: false },
  { t: "Rotational Dynamics", videos: 10, hours: 3.8, progress: 30, updated: false },
  { t: "Gravitation", videos: 9, hours: 3.2, progress: 0, updated: true },
];

type Lesson = { id: string; title: string; duration: string; done?: boolean; current?: boolean };
const playlist: Lesson[] = [
  { id: "l1", title: "Introduction to Forces", duration: "08:42", done: true },
  { id: "l2", title: "First Law — Inertia", duration: "12:05", done: true },
  { id: "l3", title: "Second Law — F = ma", duration: "16:38", current: true },
  { id: "l4", title: "Third Law — Action & Reaction", duration: "10:24" },
  { id: "l5", title: "Free-body Diagrams Walkthrough", duration: "14:50" },
  { id: "l6", title: "Friction, Tension & Normal Force", duration: "18:12" },
  { id: "l7", title: "Numerical Problem Set", duration: "22:01" },
  { id: "l8", title: "Common Mistakes & Tips", duration: "09:28" },
];

export function VideoClassesFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  return (
    <div className="space-y-6">
      <Header />
      <Stepper step={step} level={level} subject={subject} chapter={chapter} setStep={setStep} />

      {step === 0 && (
        <Grid>
          {levels.map((l, i) => (
            <SelectCard key={l.t} title={l.t} desc={l.d} Icon={l.i} gradient={l.c} delay={i * 70}
              onClick={() => { setLevel(l.t); setStep(1); }} />
          ))}
        </Grid>
      )}
      {step === 1 && (
        <Grid cols={3}>
          {subjects.map((s, i) => (
            <SubjectCard key={s.t} s={s} delay={i * 60}
              onClick={() => { setSubject(s.t); setStep(2); }} />
          ))}
        </Grid>
      )}
      {step === 2 && <ChapterList onPick={(c) => { setChapter(c); setStep(3); }} />}
      {step === 3 && (
        <>
          <Watch subject={subject || "Physics"} chapter={chapter || "Newton's Laws of Motion"} />
          <Recommended />
        </>
      )}
    </div>
  );
}

/* ----------------------------- header / stepper ----------------------------- */

function Header() {
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <PlayCircle className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> Smart Video Classes
          </div>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Smart <span className="text-gradient">Video Classes</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn chapter-wise through premium interactive video lessons.
          </p>
        </div>
        <div className="flex gap-2">
          <Pill icon={PlayCircle} label="Watched" value="218" />
          <Pill icon={Flame} label="Streak" value="12d" />
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card-soft">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-display text-base font-bold">{value}</div>
      </div>
    </div>
  );
}

function Stepper({ step, level, subject, chapter, setStep }: any) {
  const items = [
    { i: 0, l: "Level", v: level || "—" },
    { i: 1, l: "Subject", v: subject || "—" },
    { i: 2, l: "Chapter", v: chapter || "—" },
    { i: 3, l: "Watch", v: chapter ? "Live" : "—" },
  ];
  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
      {items.map((it, idx) => {
        const active = step === it.i;
        const done = step > it.i;
        return (
          <div key={it.l} className="flex items-center gap-2">
            <button onClick={() => (done || active) && setStep(it.i)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                active ? "bg-cta-gradient text-white shadow-glow"
                  : done ? "bg-muted/60 text-foreground hover:bg-muted" : "text-muted-foreground"
              }`}>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                active ? "bg-white/20" : done ? "bg-emerald-500/20 text-emerald-400" : "bg-muted"
              }`}>{done ? "✓" : it.i + 1}</span>
              <span>{it.l}:</span><span className="opacity-80">{it.v}</span>
            </button>
            {idx < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        );
      })}
    </div>
  );
}

function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: number }) {
  return <div className={`grid gap-4 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>{children}</div>;
}

function SelectCard({ title, desc, Icon, gradient, onClick, delay }: any) {
  return (
    <button onClick={onClick} className="group relative animate-fade-in text-left"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${gradient} opacity-0 blur transition-opacity duration-300 group-hover:opacity-60`} />
      <div className="glass relative h-full overflow-hidden rounded-3xl p-6 shadow-card-soft transition-transform duration-300 group-hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-glow`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
          Continue <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}

function SubjectCard({ s, onClick, delay }: { s: typeof subjects[number]; onClick: () => void; delay: number }) {
  const Icon = s.i;
  return (
    <button onClick={onClick} className="group relative animate-fade-in text-left"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${s.c} opacity-0 blur transition-opacity duration-300 group-hover:opacity-60`} />
      <div className="glass relative h-full overflow-hidden rounded-3xl p-6 shadow-card-soft transition-transform duration-300 group-hover:-translate-y-1">
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          <Clock className="h-3 w-3" /> {s.hours}h
        </div>
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.c} text-white shadow-glow`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{s.t}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{s.videos} videos · {s.chapters} chapters</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
          Browse <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}

function ChapterList({ onPick }: { onPick: (c: string) => void }) {
  const [open, setOpen] = useState<string | null>(chapters[0].t);
  return (
    <div className="space-y-3">
      {chapters.map((ch, i) => {
        const isOpen = open === ch.t;
        return (
          <div key={ch.t} className="glass overflow-hidden rounded-3xl shadow-card-soft animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
            <button onClick={() => setOpen(isOpen ? null : ch.t)}
              className="flex w-full items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-bold">{ch.t}</span>
                    {ch.updated && (
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Updated
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ch.videos} lessons · {ch.hours}h total
                  </div>
                </div>
              </div>
              <div className="hidden flex-1 sm:block">
                <div className="ml-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted/60">
                  <div className="h-full rounded-full bg-cta-gradient" style={{ width: `${ch.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{ch.progress}%</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-border/40 bg-muted/20 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">
                      HD · 1080p
                    </span>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-muted-foreground">PDF notes included</span>
                  </div>
                  <button onClick={() => onPick(ch.t)}
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform">
                    Start Watching <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------- watch ----------------------------- */

function Watch({ subject, chapter }: { subject: string; chapter: string }) {
  const [active, setActive] = useState<Lesson>(playlist[2]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Player active={active} />
        <Details active={active} subject={subject} chapter={chapter} />
        <Playlist active={active} setActive={setActive} />
      </div>

      <div className="space-y-4">
        <ProgressWidget />
        <QuickResources />
      </div>
    </div>
  );
}

function Player({ active }: { active: Lesson }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState("1x");
  const [quality, setQuality] = useState("1080p");
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-40 blur-md" />
      <div className="glass relative overflow-hidden rounded-3xl shadow-card-soft">
        {/* Video stage */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(123,97,255,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.35),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent,rgba(0,0,0,0.6))]" />

          {/* Cinematic content */}
          <div className="relative flex h-full items-center justify-center">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 transition hover:scale-110 hover:bg-white/20"
            >
              <div className="absolute h-20 w-20 animate-pulse-glow rounded-full bg-[var(--neon-purple)]/30 blur-xl" />
              {playing ? <Pause className="h-7 w-7 text-white" /> : <Play className="ml-1 h-7 w-7 text-white" />}
            </button>
          </div>

          {/* Top chip */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live HD
            </span>
            <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
              EduMaster Pro
            </span>
          </div>

          {/* Bottom controls */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            {/* progress */}
            <div className="group relative h-1 w-full cursor-pointer rounded-full bg-white/15">
              <div className="absolute inset-y-0 left-0 w-[42%] rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
              <div className="absolute left-[42%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_var(--neon-purple)]" />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-white">
              <button onClick={() => setPlaying((p) => !p)} className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button className="rounded-full bg-white/10 p-2 backdrop-blur hover:bg-white/20">
                <SkipBack className="h-4 w-4" />
              </button>
              <button className="rounded-full bg-white/10 p-2 backdrop-blur hover:bg-white/20">
                <SkipForward className="h-4 w-4" />
              </button>
              <Volume2 className="ml-1 h-4 w-4 opacity-80" />
              <span className="text-[11px] tabular-nums text-white/80">06:54 / {active.duration}</span>

              <div className="ml-auto flex items-center gap-2">
                <Chip onClick={() => setSpeed((s) => (s === "1x" ? "1.5x" : s === "1.5x" ? "2x" : "1x"))} icon={Settings2}>{speed}</Chip>
                <Chip onClick={() => setQuality((q) => (q === "1080p" ? "720p" : q === "720p" ? "480p" : "1080p"))}>{quality}</Chip>
                <Chip onClick={() => setBookmarked((b) => !b)} icon={Bookmark}>{bookmarked ? "Saved" : "Save"}</Chip>
                <Chip icon={Download}>Notes</Chip>
                <Chip icon={Share2}>Share</Chip>
                <button className="rounded-full bg-white/15 p-2 backdrop-blur hover:bg-white/25">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, icon: Icon, onClick }: { children: React.ReactNode; icon?: any; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-white/20">
      {Icon && <Icon className="h-3 w-3" />} {children}
    </button>
  );
}

function Details({ active, subject, chapter }: { active: Lesson; subject: string; chapter: string }) {
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-muted/60 px-2 py-0.5 font-semibold">{subject}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">{chapter}</span>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-semibold text-amber-400">
              Live · 4.9 ★
            </span>
          </div>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight">{active.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Deep dive into the second law — derivation of F = ma, unit conversions, and a walkthrough of three
            classic numerical problems with annotated diagrams.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> {active.duration} total</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> 12,480 enrolled</span>
            <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> PDF + Notes</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Watch progress</span><span>42% · 06:54 / {active.duration}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div className="h-full w-[42%] rounded-full bg-cta-gradient" />
            </div>
          </div>
        </div>

        <div className="glass shrink-0 rounded-2xl p-4 shadow-card-soft lg:w-72">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cta-gradient text-white shadow-glow">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-sm font-bold">Dr. Anika Rahman</div>
              <div className="text-[11px] text-muted-foreground">PhD Physics · 12 yrs teaching</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Mini label="Courses" value="38" />
            <Mini label="Students" value="42K" />
            <Mini label="Rating" value="4.9" />
          </div>
          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-3 py-2 text-xs font-semibold text-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/20">
            Follow Instructor
          </button>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 px-2 py-2">
      <div className="font-display text-sm font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Playlist({ active, setActive }: { active: Lesson; setActive: (l: Lesson) => void }) {
  const remaining = playlist.filter((l) => !l.done && l.id !== active.id).length;
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="font-display text-sm font-bold">Chapter Playlist</div>
          <div className="text-[11px] text-muted-foreground">{remaining} lessons remaining</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-blue)]/30 bg-[var(--neon-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-blue)]">
          <Layers className="h-3 w-3" /> {playlist.length} lessons
        </span>
      </div>

      <ul className="space-y-1.5">
        {playlist.map((l, i) => {
          const isActive = l.id === active.id;
          return (
            <li key={l.id}>
              <button onClick={() => setActive(l)}
                className={`group flex w-full items-center gap-3 rounded-2xl p-2 text-left transition ${
                  isActive ? "bg-cta-gradient/10 ring-1 ring-[var(--neon-purple)]/40 shadow-glow"
                           : "hover:bg-muted/50"
                }`}>
                {/* thumbnail */}
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/30">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {l.done ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Play className="h-4 w-4 text-white" />}
                  </div>
                  <span className="absolute bottom-0.5 right-1 rounded bg-black/60 px-1 text-[9px] font-semibold text-white">
                    {l.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display w-5 text-[10px] font-bold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`truncate text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/90"}`}>
                      {l.title}
                    </span>
                  </div>
                  <div className="ml-7 mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {isActive && (
                      <span className="inline-flex items-center gap-1 font-semibold text-[var(--neon-purple)]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon-purple)]" /> Now playing
                      </span>
                    )}
                    {l.done && !isActive && <span className="text-emerald-400">Completed</span>}
                    {!l.done && !isActive && <span>Up next</span>}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ----------------------------- right sidebar ----------------------------- */

function ProgressWidget() {
  const pct = 68;
  const r = 36;
  const c = 2 * Math.PI * r;
  const d = (pct / 100) * c;
  const weekly = [40, 65, 30, 80, 55, 90, 72];
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Study Progress</span>

      <div className="mt-3 flex items-center gap-4 rounded-2xl border border-border/40 bg-muted/30 p-3">
        <div className="relative h-[88px] w-[88px]">
          <svg viewBox="0 0 88 88" className="-rotate-90">
            <defs>
              <linearGradient id="vidRing" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--neon-purple)" />
                <stop offset="100%" stopColor="var(--neon-blue)" />
              </linearGradient>
            </defs>
            <circle cx="44" cy="44" r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
            <circle cx="44" cy="44" r={r} stroke="url(#vidRing)" strokeWidth="8" strokeLinecap="round" fill="none"
              strokeDasharray={`${d} ${c}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-lg font-bold text-gradient">{pct}%</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold">Completion</div>
          <div className="text-[11px] text-muted-foreground">218 of 320 classes watched</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Row label="Watched" value="218" icon={PlayCircle} />
        <Row label="Streak" value="12 days" icon={Flame} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>Weekly learning</span><span className="text-[var(--neon-blue)]">+18%</span>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {weekly.map((h, i) => (
            <div key={i} className="group relative flex-1">
              <div className="rounded-md bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-purple)] transition-all hover:opacity-90"
                style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground">
          {["M","T","W","T","F","S","S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> {label}
      </span>
      <span className="font-display text-sm font-bold">{value}</span>
    </div>
  );
}

function QuickResources() {
  const items = [
    { l: "Related PDFs", Icon: FileText, c: "from-rose-500 to-amber-500" },
    { l: "Flash Cards", Icon: Layers, c: "from-[var(--neon-purple)] to-fuchsia-500" },
    { l: "Short Notes", Icon: BookOpen, c: "from-sky-500 to-indigo-500" },
    { l: "Practice MCQ", Icon: ListChecks, c: "from-emerald-500 to-cyan-500" },
  ];
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Resources</span>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((it) => (
          <button key={it.l}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border/50 bg-muted/30 p-3 text-left hover:-translate-y-0.5 transition">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${it.c} text-white shadow-glow`}>
              <it.Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold">{it.l}</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-gradient">
              Open <ArrowUpRight className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- recommendations ----------------------------- */

function Recommended() {
  const items = [
    { t: "Rotational Dynamics — Intuition", reason: "AI · matches your weak topic", Icon: Sparkles, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]", time: "24m" },
    { t: "Electromagnetism Crash Course", reason: "Trending this week", Icon: TrendingUp, c: "from-rose-500 to-amber-500", time: "1h 12m" },
    { t: "Continue: Newton's Third Law", reason: "Pick up where you left off", Icon: PlayCircle, c: "from-emerald-500 to-cyan-500", time: "10m" },
    { t: "Top Rated: Optics Masterclass", reason: "4.9★ · most loved", Icon: Star, c: "from-fuchsia-500 to-purple-600", time: "52m" },
  ];
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold">Recommended Classes</div>
          <div className="text-xs text-muted-foreground">Personalized picks based on your learning history.</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-purple)]">
          <Sparkles className="h-3 w-3" /> AI Picks
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <button key={it.t}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-4 text-left transition hover:-translate-y-0.5">
            {/* thumb */}
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 group-hover:scale-110 transition">
                  <Play className="ml-0.5 h-5 w-5 text-white" />
                </div>
              </div>
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {it.time}
              </span>
            </div>
            <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${it.c} text-white shadow-glow`}>
              <it.Icon className="h-3.5 w-3.5" />
            </div>
            <div className="font-display mt-2 text-sm font-bold">{it.t}</div>
            <div className="text-[11px] text-muted-foreground">{it.reason}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
