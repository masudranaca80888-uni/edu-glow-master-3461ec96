import { useMemo, useState } from "react";
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
  Database,
  FileText,
  File,
  FileSpreadsheet,
  Search,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Download,
  Maximize2,
  Highlighter,
  Hash,
  Star,
  Eye,
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Foundational papers", i: Sparkles, c: "from-sky-500 to-indigo-500" },
  { t: "Professional", d: "Board & university", i: Award, c: "from-[var(--neon-purple)] to-fuchsia-500" },
  { t: "Advanced", d: "Olympiad & entrance", i: Crown, c: "from-amber-400 to-rose-500" },
];

const subjects = [
  { t: "Physics", files: 124, chapters: 14, i: Atom, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
  { t: "Chemistry", files: 98, chapters: 12, i: FlaskConical, c: "from-fuchsia-500 to-purple-600" },
  { t: "Biology", files: 142, chapters: 16, i: Dna, c: "from-emerald-500 to-cyan-500" },
  { t: "Mathematics", files: 168, chapters: 18, i: Sigma, c: "from-amber-500 to-pink-500" },
  { t: "English", files: 64, chapters: 8, i: Languages, c: "from-sky-500 to-indigo-500" },
  { t: "ICT", files: 52, chapters: 9, i: Cpu, c: "from-violet-500 to-blue-600" },
];

const chapters = [
  { t: "Kinematics", files: 18, progress: 70, updated: true, downloadable: true },
  { t: "Newton's Laws of Motion", files: 22, progress: 55, updated: true, downloadable: true },
  { t: "Work, Energy & Power", files: 16, progress: 88, updated: false, downloadable: true },
  { t: "Rotational Dynamics", files: 14, progress: 30, updated: false, downloadable: true },
  { t: "Gravitation", files: 12, progress: 0, updated: true, downloadable: false },
];

type Resource = {
  id: string;
  title: string;
  chapter: string;
  type: "PDF" | "TEXT" | "IQS" | "PYQ" | "MODEL";
  questions: number;
  downloads: number;
};

const resources: Resource[] = [
  { id: "r1", title: "Newton's Laws — Important Questions 2026", chapter: "Newton's Laws", type: "IQS", questions: 75, downloads: 4820 },
  { id: "r2", title: "Mechanics PYQ Bundle (2018–2025)", chapter: "Mechanics", type: "PYQ", questions: 240, downloads: 9120 },
  { id: "r3", title: "Kinematics Model Test Paper Set A", chapter: "Kinematics", type: "MODEL", questions: 50, downloads: 3210 },
  { id: "r4", title: "Energy & Power Concept Sheet", chapter: "Work & Energy", type: "PDF", questions: 38, downloads: 1840 },
  { id: "r5", title: "Rotational Dynamics Short Q&A", chapter: "Rotational", type: "TEXT", questions: 60, downloads: 2010 },
  { id: "r6", title: "Gravitation — Conceptual Bank", chapter: "Gravitation", type: "PDF", questions: 42, downloads: 1560 },
];

const typeMeta: Record<Resource["type"], { label: string; icon: any; tone: string }> = {
  PDF: { label: "PDF", icon: File, tone: "text-rose-400 bg-rose-400/10 border-rose-400/30" },
  TEXT: { label: "Text", icon: FileText, tone: "text-sky-400 bg-sky-400/10 border-sky-400/30" },
  IQS: { label: "Important Qns", icon: Star, tone: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  PYQ: { label: "Previous Year", icon: Clock, tone: "text-[var(--neon-purple)] bg-[var(--neon-purple)]/10 border-[var(--neon-purple)]/30" },
  MODEL: { label: "Model Test", icon: FileSpreadsheet, tone: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
};

export function QuestionBankFlow() {
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
            <SubjectCard key={s.t} subject={s} delay={i * 60}
              onClick={() => { setSubject(s.t); setStep(2); }} />
          ))}
        </Grid>
      )}
      {step === 2 && <ChapterList onPick={(c) => { setChapter(c); setStep(3); }} />}
      {step === 3 && (
        <>
          <BankViewer subject={subject || "Physics"} chapter={chapter || "Newton's Laws of Motion"} />
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
            <Database className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> Smart Question Bank
          </div>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Smart <span className="text-gradient">Question Bank</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access chapter-wise important questions, PDFs and study resources.
          </p>
        </div>
        <div className="flex gap-2">
          <Pill icon={File} label="Resources" value="648" />
          <Pill icon={Download} label="Downloads" value="12.4K" />
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
}: { step: Step; level: string; subject: string; chapter: string; setStep: (s: Step) => void }) {
  const items = [
    { i: 0, l: "Level", v: level || "—" },
    { i: 1, l: "Subject", v: subject || "—" },
    { i: 2, l: "Chapter", v: chapter || "—" },
    { i: 3, l: "Browse", v: chapter ? "Active" : "—" },
  ];
  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
      {items.map((it, idx) => {
        const active = step === it.i;
        const done = step > it.i;
        return (
          <div key={it.l} className="flex items-center gap-2">
            <button onClick={() => (done || active) && setStep(it.i as Step)}
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

function SubjectCard({ subject, onClick, delay }: { subject: typeof subjects[number]; onClick: () => void; delay: number }) {
  const Icon = subject.i;
  return (
    <button onClick={onClick} className="group relative animate-fade-in text-left"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${subject.c} opacity-0 blur transition-opacity duration-300 group-hover:opacity-60`} />
      <div className="glass relative h-full overflow-hidden rounded-3xl p-6 shadow-card-soft transition-transform duration-300 group-hover:-translate-y-1">
        <div className="absolute right-4 top-4 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {subject.chapters} chapters
        </div>
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.c} text-white shadow-glow`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{subject.t}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{subject.files} question files</p>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Download className="h-3 w-3" /> avg 1.2K
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-gradient">
            Browse <ChevronRight className="h-3 w-3" />
          </span>
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
                  <Database className="h-5 w-5" />
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
                  <div className="text-xs text-muted-foreground">{ch.files} resources · {ch.progress}% covered</div>
                </div>
              </div>
              <div className="hidden flex-1 sm:block">
                <div className="ml-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted/60">
                  <div className="h-full rounded-full bg-cta-gradient" style={{ width: `${ch.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-lg border p-1.5 text-xs ${ch.downloadable ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400" : "border-border/60 bg-muted/40 text-muted-foreground"}`}>
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
                      {ch.files} files
                    </span>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-muted-foreground">PDF · Text · PYQ · Model</span>
                  </div>
                  <button onClick={() => onPick(ch.t)}
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform">
                    Open Bank <ChevronRight className="h-4 w-4" />
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

/* ----------------------------- viewer ----------------------------- */

function BankViewer({ subject, chapter }: { subject: string; chapter: string }) {
  const [mode, setMode] = useState<"text" | "pdf">("pdf");
  const [zoom, setZoom] = useState(100);
  const [bookmarked, setBookmarked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [active, setActive] = useState<Resource>(resources[0]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | Resource["type"]>("ALL");

  const filtered = useMemo(() => {
    return resources.filter((r) =>
      (typeFilter === "ALL" || r.type === typeFilter) &&
      (query === "" || r.title.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, typeFilter]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {/* Resource cards row */}
        <div className="glass rounded-2xl p-4 shadow-card-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(["ALL", "PDF", "TEXT", "IQS", "PYQ", "MODEL"] as const).map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                    typeFilter === t ? "bg-cta-gradient text-white shadow-glow" : "border border-border/60 bg-muted/40 text-foreground/70 hover:text-foreground"
                  }`}>
                  {t === "ALL" ? "All" : typeMeta[t].label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources…"
                className="w-full rounded-xl border border-border/60 bg-muted/30 py-1.5 pl-8 pr-3 text-xs placeholder:text-muted-foreground/70 focus:border-[var(--neon-purple)]/50 focus:outline-none" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filtered.map((r, i) => (
              <ResourceCard key={r.id} r={r} active={active.id === r.id} onOpen={() => setActive(r)} delay={i * 40} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                No resources match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Viewer toolbar */}
        <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search inside document…"
              className="w-full rounded-xl border border-border/60 bg-muted/30 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--neon-purple)]/50 focus:outline-none" />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
            <ToggleBtn active={mode === "pdf"} onClick={() => setMode("pdf")} icon={File} label="PDF" />
            <ToggleBtn active={mode === "text"} onClick={() => setMode("text")} icon={FileText} label="Text" />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
            <IconBtn onClick={() => setZoom((z) => Math.max(75, z - 10))} Icon={ZoomOut} />
            <span className="px-2 text-xs font-semibold tabular-nums">{zoom}%</span>
            <IconBtn onClick={() => setZoom((z) => Math.min(150, z + 10))} Icon={ZoomIn} />
          </div>
          <button onClick={() => setBookmarked((b) => !b)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
              bookmarked ? "border-amber-400/40 bg-amber-400/15 text-amber-400" : "border-border/60 bg-muted/40 text-foreground/80 hover:bg-muted"
            }`}>
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-amber-400" : ""}`} /> Save
          </button>
          <button onClick={() => setFullscreen((f) => !f)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-2 text-xs font-medium hover:bg-muted">
            <Maximize2 className="h-3.5 w-3.5" /> {fullscreen ? "Exit" : "Fullscreen"}
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-cta-gradient px-3 py-2 text-xs font-semibold text-white shadow-glow">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>

        {/* Document viewer */}
        <div className={`glass relative overflow-hidden rounded-3xl shadow-card-soft ${fullscreen ? "fixed inset-4 z-50" : ""}`}>
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />

          <div className={`relative overflow-y-auto p-6 sm:p-8 ${fullscreen ? "h-full" : "max-h-[640px]"}`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-muted/60 px-2 py-0.5 font-semibold">{subject}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">{chapter}</span>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeMeta[active.type].tone}`}>
                {(() => { const I = typeMeta[active.type].icon; return <I className="h-3 w-3" />; })()}
                {typeMeta[active.type].label}
              </span>
            </div>
            <div style={{ fontSize: `${zoom}%` }} className="mx-auto max-w-2xl">
              {mode === "pdf" ? <PdfDocPreview resource={active} chapter={chapter} subject={subject} />
                              : <TextDocPreview resource={active} />}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <StudyWidget />
        <QuickAccess setActive={setActive} />
      </div>
    </div>
  );
}

function ResourceCard({ r, active, onOpen, delay }: { r: Resource; active: boolean; onOpen: () => void; delay: number }) {
  const meta = typeMeta[r.type];
  const Icon = meta.icon;
  return (
    <button onClick={onOpen}
      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all animate-fade-in ${
        active ? "border-[var(--neon-purple)]/50 bg-[var(--neon-purple)]/5 shadow-glow"
               : "border-border/60 bg-muted/30 hover:-translate-y-0.5 hover:border-[var(--neon-purple)]/40"
      }`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}>
      <div className="flex gap-3">
        <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 text-[var(--neon-purple)]">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${meta.tone}`}>
              {meta.label}
            </span>
            <span className="truncate text-[10px] text-muted-foreground">{r.chapter}</span>
          </div>
          <div className="mt-1 truncate font-display text-sm font-bold">{r.title}</div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" /> {r.questions} qns</span>
            <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> {r.downloads.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-gradient">
        Open Viewer <ArrowUpRight className="ml-1 h-3 w-3" />
      </div>
    </button>
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
function IconBtn({ onClick, Icon }: any) {
  return (
    <button onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/70 hover:bg-muted hover:text-foreground">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function PdfDocPreview({ resource, chapter, subject }: { resource: Resource; chapter: string; subject: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white/95 p-8 text-zinc-900 shadow-xl dark:bg-zinc-100">
      <div className="mb-4 flex items-center justify-between text-[11px] text-zinc-500">
        <span>{subject} · {chapter}</span>
        <span>Page 1 of 8</span>
      </div>
      <h2 className="font-display text-2xl font-bold">{resource.title}</h2>
      <p className="mt-1 text-xs text-zinc-500">EduMaster Pro · Curated Question Bank · {resource.questions} questions</p>

      <ol className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-800">
        <li>
          <div className="font-semibold">Q1. State Newton's Second Law of Motion and derive F = ma.</div>
          <p className="mt-1 text-zinc-600">[Marks: 5 · Difficulty: Medium · Frequently asked]</p>
        </li>
        <li>
          <div className="font-semibold">Q2. A body of mass 2 kg is acted upon by a force of 10 N. Find acceleration.</div>
          <p className="mt-1 text-zinc-600">[Marks: 2 · Numerical · Easy]</p>
        </li>
        <li>
          <div className="font-semibold">Q3. Two bodies of masses m₁ and m₂ are connected by a string over a pulley…</div>
          <p className="mt-1 text-zinc-600">[Marks: 5 · Hard · PYQ 2024]</p>
        </li>
        <li>
          <div className="font-semibold">Q4. Distinguish between inertia of rest and inertia of motion with examples.</div>
          <p className="mt-1 text-zinc-600">[Marks: 3 · Conceptual]</p>
        </li>
      </ol>

      <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-xs text-zinc-700">
        <div className="flex items-center gap-1 font-semibold text-amber-700">
          <Highlighter className="h-3.5 w-3.5" /> Important Note
        </div>
        Q3 and Q5 have appeared in 3 out of last 5 board exams — high priority for revision.
      </div>
    </div>
  );
}

function TextDocPreview({ resource }: { resource: Resource }) {
  return (
    <article className="space-y-5">
      <h2 className="font-display text-3xl font-bold tracking-tight">{resource.title}</h2>
      <p className="text-sm text-muted-foreground">{resource.questions} curated questions · {resource.downloads.toLocaleString()} downloads</p>

      <section>
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Hash className="h-4 w-4 text-[var(--neon-purple)]" /> Important Questions
        </h3>
        <ol className="mt-2 space-y-3 text-[15px] text-foreground/90">
          {[
            "Define inertia and explain its types with examples.",
            "Derive the expression for impulse and link it to the change in momentum.",
            "State and prove the law of conservation of linear momentum.",
            "A bullet of mass 10 g moving at 400 m/s embeds in a 2 kg block at rest. Find the final velocity.",
            "Explain pseudo forces with reference to non-inertial frames of reference.",
          ].map((q, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-border/40 bg-muted/30 p-3">
              <span className="font-display text-sm font-bold text-gradient">Q{String(i + 1).padStart(2, "0")}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--neon-purple)]">
          <Highlighter className="h-4 w-4" /> Highlighted: Frequently Asked
        </div>
        <p className="mt-2 text-sm">Q2 and Q4 appear in 70% of past board examinations — prioritise these in revision.</p>
      </section>
    </article>
  );
}

/* ----------------------------- right sidebar ----------------------------- */

function StudyWidget() {
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Study Resources</span>
      <div className="mt-3 space-y-2">
        <Row label="Resources Viewed" value="148" icon={Eye} />
        <Row label="Downloads" value="62" icon={Download} />
        <Row label="Saved" value="24" icon={Bookmark} />
        <Row label="Last Opened" value="Kinematics IQS" icon={Clock} />
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Weekly Goal
        </div>
        <div className="mt-1 text-muted-foreground">5 of 7 resources reviewed</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          <div className="h-full w-[71%] rounded-full bg-cta-gradient" />
        </div>
      </div>
    </div>
  );
}

function QuickAccess({ setActive }: { setActive: (r: Resource) => void }) {
  const groups = [
    { l: "Important Sets", items: [resources[0], resources[2]], Icon: Star },
    { l: "Popular", items: [resources[1]], Icon: Flame },
    { l: "Recent Uploads", items: [resources[4], resources[5]], Icon: Clock },
  ];
  return (
    <div className="glass rounded-3xl p-5 shadow-card-soft">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Quick Access</span>
      <div className="mt-3 space-y-4">
        {groups.map((g) => (
          <div key={g.l}>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <g.Icon className="h-3 w-3 text-[var(--neon-blue)]" /> {g.l}
            </div>
            <ul className="mt-2 space-y-1.5">
              {g.items.map((r) => (
                <li key={r.id}>
                  <button onClick={() => setActive(r)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted/50">
                    {(() => { const I = typeMeta[r.type].icon; return <I className="h-3.5 w-3.5 text-[var(--neon-purple)]" />; })()}
                    <span className="truncate text-foreground/90">{r.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
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

/* ----------------------------- recommendations ----------------------------- */

function Recommended() {
  const items = [
    { t: "Rotational Dynamics PYQ Pack", reason: "Weak chapter · boost score", Icon: TrendingUp, c: "from-rose-500 to-amber-500" },
    { t: "Thermodynamics Model Test", reason: "Most downloaded this week", Icon: Flame, c: "from-fuchsia-500 to-purple-600" },
    { t: "Modern Physics — Important Qns", reason: "Recently added", Icon: Sparkles, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
    { t: "Optics Trending Sheet", reason: "Trending across users", Icon: ArrowUpRight, c: "from-emerald-500 to-cyan-500" },
  ];
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold">Recommended Resources</div>
          <div className="text-xs text-muted-foreground">Curated picks based on your weak chapters and platform trends.</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-purple)]">
          <Sparkles className="h-3 w-3" /> AI Picks
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <button key={it.t} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-4 text-left transition hover:-translate-y-0.5">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${it.c} text-white shadow-glow`}>
              <it.Icon className="h-4 w-4" />
            </div>
            <div className="font-display mt-3 text-sm font-bold">{it.t}</div>
            <div className="text-[11px] text-muted-foreground">{it.reason}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
              Open <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
