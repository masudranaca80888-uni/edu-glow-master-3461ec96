import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listPublicShortNotes } from "@/lib/admin-short-notes.functions";
import { EyeOff } from "lucide-react";
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
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Download,
  File,
  BookOpen,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  Star,
  Hash,
  Highlighter,
  Eye,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Foundational notes", i: Sparkles, c: "from-sky-500 to-indigo-500" },
  { t: "Professional", d: "Board & university grade", i: Award, c: "from-[var(--neon-purple)] to-fuchsia-500" },
  { t: "Advanced", d: "Olympiad & mastery", i: Crown, c: "from-amber-400 to-rose-500" },
];

const subjects = [
  { t: "Physics", notes: 86, i: Atom, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
  { t: "Chemistry", notes: 74, i: FlaskConical, c: "from-fuchsia-500 to-purple-600" },
  { t: "Biology", notes: 92, i: Dna, c: "from-emerald-500 to-cyan-500" },
  { t: "Mathematics", notes: 108, i: Sigma, c: "from-amber-500 to-pink-500" },
  { t: "English", notes: 42, i: Languages, c: "from-sky-500 to-indigo-500" },
  { t: "ICT", notes: 38, i: Cpu, c: "from-violet-500 to-blue-600" },
];

const chapters = [
  { t: "Kinematics", notes: 12, progress: 80, updated: true },
  { t: "Newton's Laws of Motion", notes: 14, progress: 62, updated: true },
  { t: "Work, Energy & Power", notes: 11, progress: 95, updated: false },
  { t: "Rotational Dynamics", notes: 10, progress: 35, updated: false },
  { t: "Gravitation", notes: 9, progress: 0, updated: true },
];

export function ShortNotesFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");

  const qc = useQueryClient();
  const publicFn = useServerFn(listPublicShortNotes);
  const visQuery = useQuery({
    queryKey: ["public-short-notes", "section"],
    queryFn: () => publicFn({ data: {} }),
    staleTime: 30_000,
  });

  useEffect(() => {
    const ch = supabase
      .channel("snv-student")
      .on("postgres_changes", { event: "*", schema: "public", table: "short_notes_visibility" }, () => {
        qc.invalidateQueries({ queryKey: ["public-short-notes"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "short_notes" }, () => {
        qc.invalidateQueries({ queryKey: ["public-short-notes"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  if (visQuery.data?.hidden) {
    return (
      <div className="glass shadow-card-soft flex flex-col items-center justify-center gap-3 rounded-3xl p-12 text-center">
        <EyeOff className="h-10 w-10 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold">Short Notes are temporarily unavailable</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The Short Notes section is currently hidden by your administrator. Please check back soon.
        </p>
      </div>
    );
  }

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
            <SelectCard key={s.t} title={s.t} desc={`${s.notes} notes`} Icon={s.i} gradient={s.c} delay={i * 60}
              onClick={() => { setSubject(s.t); setStep(2); }} />
          ))}
        </Grid>
      )}
      {step === 2 && <ChapterList onPick={(c) => { setChapter(c); setStep(3); }} />}
      {step === 3 && <Reader subject={subject || "Physics"} chapter={chapter || "Newton's Laws of Motion"} />}
      {step === 3 && <Recommended />}
    </div>
  );
}

/* --------------------------------- header / stepper --------------------------------- */

function Header() {
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> Smart Short Notes
          </div>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Smart <span className="text-gradient">Short Notes</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick chapter-wise notes for fast revision and better understanding.
          </p>
        </div>
        <div className="flex gap-2">
          <Pill icon={BookOpen} label="Notes Read" value="184" />
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

function Stepper({
  step, level, subject, chapter, setStep,
}: {
  step: Step; level: string; subject: string; chapter: string; setStep: (s: Step) => void;
}) {
  const items = [
    { i: 0, l: "Level", v: level || "—" },
    { i: 1, l: "Subject", v: subject || "—" },
    { i: 2, l: "Chapter", v: chapter || "—" },
    { i: 3, l: "Read", v: chapter ? "In progress" : "—" },
  ];
  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
      {items.map((it, idx) => {
        const active = step === it.i;
        const done = step > it.i;
        return (
          <div key={it.l} className="flex items-center gap-2">
            <button
              onClick={() => (done || active) && setStep(it.i as Step)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                active ? "bg-cta-gradient text-white shadow-glow"
                  : done ? "bg-muted/60 text-foreground hover:bg-muted" : "text-muted-foreground"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                active ? "bg-white/20" : done ? "bg-emerald-500/20 text-emerald-400" : "bg-muted"
              }`}>{done ? "✓" : it.i + 1}</span>
              <span>{it.l}:</span>
              <span className="opacity-80">{it.v}</span>
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

function SelectCard({
  title, desc, Icon, gradient, onClick, delay,
}: {
  title: string; desc: string; Icon: any; gradient: string; onClick: () => void; delay: number;
}) {
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

function ChapterList({ onPick }: { onPick: (c: string) => void }) {
  const [open, setOpen] = useState<string | null>(chapters[0].t);
  return (
    <div className="space-y-3">
      {chapters.map((ch, i) => {
        const isOpen = open === ch.t;
        return (
          <div key={ch.t} className="glass overflow-hidden rounded-3xl shadow-card-soft animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}>
            <button onClick={() => setOpen(isOpen ? null : ch.t)} className="flex w-full items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
                  <FileText className="h-5 w-5" />
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
                  <div className="text-xs text-muted-foreground">{ch.notes} notes · {ch.progress}% read</div>
                </div>
              </div>
              <div className="hidden flex-1 sm:block">
                <div className="ml-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted/60">
                  <div className="h-full rounded-full bg-cta-gradient" style={{ width: `${ch.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-border/60 bg-muted/40 p-1.5 text-muted-foreground hover:text-foreground">
                  <Download className="h-3.5 w-3.5" />
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-border/40 bg-muted/20 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">
                      {ch.notes} short notes
                    </span>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-muted-foreground">PDF + Text</span>
                  </div>
                  <button onClick={() => onPick(ch.t)}
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform">
                    Open Notes <ChevronRight className="h-4 w-4" />
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

/* --------------------------------- reader --------------------------------- */

function Reader({ subject, chapter }: { subject: string; chapter: string }) {
  const [mode, setMode] = useState<"text" | "pdf">("text");
  const [zoom, setZoom] = useState(100);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {/* Reader controls */}
        <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search inside notes…"
              className="w-full rounded-xl border border-border/60 bg-muted/30 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--neon-purple)]/50 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
            <ToggleBtn active={mode === "text"} onClick={() => setMode("text")} icon={FileText} label="Text" />
            <ToggleBtn active={mode === "pdf"} onClick={() => setMode("pdf")} icon={File} label="PDF" />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
            <IconBtn onClick={() => setZoom((z) => Math.max(75, z - 10))} Icon={ZoomOut} />
            <span className="px-2 text-xs font-semibold tabular-nums">{zoom}%</span>
            <IconBtn onClick={() => setZoom((z) => Math.min(150, z + 10))} Icon={ZoomIn} />
          </div>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
              bookmarked
                ? "border-amber-400/40 bg-amber-400/15 text-amber-400"
                : "border-border/60 bg-muted/40 text-foreground/80 hover:bg-muted"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-amber-400" : ""}`} /> Save
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-cta-gradient px-3 py-2 text-xs font-semibold text-white shadow-glow">
            <Download className="h-3.5 w-3.5" /> PDF
          </button>
        </div>

        {/* Reader body */}
        <div className="glass relative overflow-hidden rounded-3xl shadow-card-soft">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

          <div className="relative max-h-[640px] overflow-y-auto p-6 sm:p-10">
            <div style={{ fontSize: `${zoom}%` }} className="mx-auto max-w-2xl">
              {mode === "text" ? <TextNote subject={subject} chapter={chapter} /> : <PdfNote subject={subject} chapter={chapter} />}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <StudyTools />
        <QuickNav />
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-cta-gradient text-white shadow-glow" : "text-foreground/70 hover:text-foreground"
      }`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function IconBtn({ onClick, Icon }: { onClick: () => void; Icon: any }) {
  return (
    <button onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function TextNote({ subject, chapter }: { subject: string; chapter: string }) {
  return (
    <article className="prose-edu space-y-5">
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded-full bg-muted/60 px-2 py-0.5 font-semibold">{subject}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">{chapter}</span>
      </div>

      <h2 className="font-display text-3xl font-bold tracking-tight">
        {chapter}
      </h2>
      <p className="text-sm text-muted-foreground">Concise revision notes — last updated 2 days ago · 6 min read</p>

      <section>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--neon-purple)]" /> Overview
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          Newton's three laws describe the relationship between motion and the forces acting on a body.
          Together they form the foundation of classical mechanics and are used to model everyday motion
          from rolling balls to orbiting satellites.
        </p>
      </section>

      <section>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--neon-purple)]" /> Key Laws
        </h3>
        <ul className="mt-2 space-y-2 text-[15px] text-foreground/90">
          <li className="flex gap-2"><Star className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--neon-blue)]" /> <span><b>First Law:</b> A body remains at rest or in uniform motion unless acted upon by a net force.</span></li>
          <li className="flex gap-2"><Star className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--neon-blue)]" /> <span><b>Second Law:</b> The net force equals the rate of change of momentum.</span></li>
          <li className="flex gap-2"><Star className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--neon-blue)]" /> <span><b>Third Law:</b> For every action, there is an equal and opposite reaction.</span></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--neon-purple)]">
          <Highlighter className="h-4 w-4" /> Key Formula
        </div>
        <div className="font-display mt-2 text-2xl font-bold text-gradient">F = m · a</div>
        <p className="mt-2 text-xs text-muted-foreground">
          Force (N) equals mass (kg) times acceleration (m/s²). Use vector form for direction-aware problems.
        </p>
      </section>

      <section>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--neon-purple)]" /> Quick Summary
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="text-xs font-semibold">Inertia</div>
            <p className="mt-1 text-xs text-muted-foreground">Resistance of a body to change in motion — directly proportional to mass.</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="text-xs font-semibold">Momentum</div>
            <p className="mt-1 text-xs text-muted-foreground">p = m · v. Conserved in isolated systems during collisions.</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="text-xs font-semibold">Action–Reaction</div>
            <p className="mt-1 text-xs text-muted-foreground">Forces always occur in pairs and act on different bodies.</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="text-xs font-semibold">Free-body Diagram</div>
            <p className="mt-1 text-xs text-muted-foreground">A schematic showing all forces acting on a single object.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--neon-purple)]" /> Diagram
        </h3>
        <div className="mt-3 flex h-40 items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-[var(--neon-purple)]/15 to-[var(--neon-blue)]/15">
          <div className="text-center">
            <BookOpen className="mx-auto h-8 w-8 text-[var(--neon-blue)] drop-shadow-[0_0_12px_var(--neon-blue)]" />
            <div className="mt-2 text-xs text-muted-foreground">Free-body diagram · Fig 5.2</div>
          </div>
        </div>
      </section>
    </article>
  );
}

function PdfNote({ subject, chapter }: { subject: string; chapter: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/90 p-8 text-zinc-900 shadow-xl dark:bg-zinc-100">
      <div className="mb-4 flex items-center justify-between text-[11px] text-zinc-500">
        <span>{subject} · {chapter}</span>
        <span>Page 1 of 4</span>
      </div>
      <h2 className="font-display text-2xl font-bold text-zinc-900">{chapter}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
        <p>This PDF preview renders the same notes in a print-friendly layout. The reading width, line spacing and typography are tuned for export.</p>
        <p>Use the zoom controls above to scale the document, or switch back to Text mode for an interactive reading experience with highlights and quick navigation.</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Definitions and laws are highlighted in bold</li>
          <li>Key formulas appear in framed callouts</li>
          <li>Diagrams retain their captions and numbering</li>
        </ul>
      </div>
      <div className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
        <b className="text-zinc-900">Formula:</b> F = m × a — Newton's Second Law of Motion.
      </div>
    </div>
  );
}

/* --------------------------------- right sidebar --------------------------------- */

function StudyTools() {
  const pct = 64;
  const r = 36;
  const c = 2 * Math.PI * r;
  const d = (pct / 100) * c;
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Study Tools</span>
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border/40 bg-muted/30 p-3">
        <div className="relative h-[88px] w-[88px]">
          <svg viewBox="0 0 88 88" className="-rotate-90">
            <defs>
              <linearGradient id="notesRing" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--neon-purple)" />
                <stop offset="100%" stopColor="var(--neon-blue)" />
              </linearGradient>
            </defs>
            <circle cx="44" cy="44" r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
            <circle cx="44" cy="44" r={r} stroke="url(#notesRing)" strokeWidth="8" strokeLinecap="round" fill="none"
              strokeDasharray={`${d} ${c}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-lg font-bold text-gradient">{pct}%</div>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold">Reading Progress</div>
          <div className="text-[11px] text-muted-foreground">14 of 22 sections complete</div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Row label="Notes Completed" value="184" icon={CheckCircle2} />
        <Row label="Saved Notes" value="32" icon={Bookmark} />
        <Row label="Last Viewed" value="Kinematics" icon={Clock} />
      </div>
    </div>
  );
}

function QuickNav() {
  const topics = ["Inertia & Mass", "Force & Momentum", "Action–Reaction", "Friction & Tension", "Free-body Diagrams"];
  const recent = ["Work–Energy Theorem", "Projectile Motion", "Conservation of Momentum"];
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Navigation</span>

      <div className="mt-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Chapter Index</div>
        <ul className="mt-2 space-y-1.5 text-xs">
          {topics.map((t, i) => (
            <li key={t} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50 cursor-pointer">
              <span className="font-display w-5 text-[10px] font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-foreground/90">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t border-border/40 pt-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recently Viewed</div>
        <ul className="mt-2 space-y-1.5 text-xs text-foreground/80">
          {recent.map((r) => (
            <li key={r} className="flex items-center gap-2"><Eye className="h-3 w-3 text-[var(--neon-blue)]" /> {r}</li>
          ))}
        </ul>
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

/* --------------------------------- recommendations --------------------------------- */

function Recommended() {
  const items = [
    { t: "Rotational Dynamics", reason: "Weak chapter · 35% read", Icon: TrendingUp, c: "from-rose-500 to-amber-500" },
    { t: "Electromagnetic Induction", reason: "Recently added", Icon: Sparkles, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
    { t: "Thermodynamics Laws", reason: "Most popular this week", Icon: Flame, c: "from-fuchsia-500 to-purple-600" },
  ];
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold">Recommended Notes</div>
          <div className="text-xs text-muted-foreground">Curated picks based on your reading history and weak topics.</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-purple)]">
          <Sparkles className="h-3 w-3" /> AI Picks
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <button key={it.t} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-4 text-left transition hover:-translate-y-0.5">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${it.c} text-white shadow-glow`}>
              <it.Icon className="h-4 w-4" />
            </div>
            <div className="font-display mt-3 text-sm font-bold">{it.t}</div>
            <div className="text-[11px] text-muted-foreground">{it.reason}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
              Read note <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
