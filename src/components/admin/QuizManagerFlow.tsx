import { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Activity,
  Plus,
  Sparkles,
  Copy,
  Send,
  EyeOff,
  Download,
  Timer,
  CheckCircle2,
  Eye,
  Trash2,
  Edit3,
  Calendar,
  Filter,
  ListChecks,
  TrendingUp,
  Trophy,
  Save,
  Clock,
  Shuffle,
  Zap,
  ChevronRight,
  Star,
  FileText,
} from "lucide-react";

/* ---------- Topbar ---------- */
function AdminTopbar() {
  const [dark, setDark] = useState(true);
  return (
    <div className="glass shadow-card-soft flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3">
      <div className="relative flex min-w-[220px] flex-1 items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search quizzes, chapters, students…"
          className="w-full rounded-xl border border-border/40 bg-background/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--neon-purple)]/60"
        />
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-400">
        <Activity className="h-3.5 w-3.5 animate-pulse" /> System Healthy
      </div>
      <button
        onClick={() => setDark((d) => !d)}
        className="glass rounded-xl p-2 hover:shadow-glow"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button className="glass relative rounded-xl p-2 hover:shadow-glow">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--neon-purple)] shadow-glow" />
      </button>
      <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-glow">
        AD
      </div>
    </div>
  );
}

/* ---------- Action Bar ---------- */
const ACTIONS = [
  { l: "Create New Quiz", i: Plus, primary: true },
  { l: "Generate from MCQs", i: Sparkles },
  { l: "Duplicate Quiz", i: Copy },
  { l: "Publish Quiz", i: Send },
  { l: "Hide Quiz", i: EyeOff },
  { l: "Export Quiz", i: Download },
];

function ActionBar() {
  return (
    <div className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-3">
      {ACTIONS.map(({ l, i: Icon, primary }) => (
        <button
          key={l}
          className={`group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 ${
            primary
              ? "bg-cta-gradient text-white shadow-glow"
              : "border border-border/40 bg-background/40 hover:border-[var(--neon-blue)]/60"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Filters ---------- */
function FilterPanel() {
  const fields = [
    { l: "Level", v: "All Levels" },
    { l: "Subject", v: "All Subjects" },
    { l: "Chapter", v: "All Chapters" },
    { l: "Status", v: "Any Status" },
    { l: "Date", v: "Anytime" },
    { l: "Sort", v: "Latest" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Filter className="h-3.5 w-3.5" /> Filter & Search Panel
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        <div className="relative col-span-2 md:col-span-3 lg:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search quiz title…"
            className="w-full rounded-xl border border-border/40 bg-background/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--neon-purple)]/60"
          />
        </div>
        {fields.map((f) => (
          <button
            key={f.l}
            className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-xs hover:border-[var(--neon-blue)]/60"
          >
            <span className="text-muted-foreground">{f.l}</span>
            <span className="font-medium">{f.v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stat cards ---------- */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 30 - ((v - min) / (max - min || 1)) * 26 - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-10 w-full">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
      <polygon
        fill={`url(#g-${color})`}
        points={`0,30 ${pts} 100,30`}
      />
    </svg>
  );
}

const STATS = [
  { l: "Total Quizzes", v: "1,248", d: "+86 this month", i: ListChecks, c: "#a855f7", g: [10, 14, 12, 18, 22, 28, 34] },
  { l: "Published", v: "984", d: "78.8% live", i: Send, c: "#22d3ee", g: [12, 18, 14, 20, 26, 24, 30] },
  { l: "Hidden", v: "164", d: "Under review", i: EyeOff, c: "#f472b6", g: [20, 14, 18, 12, 16, 10, 14] },
  { l: "Active Attempts", v: "3,672", d: "Live now", i: Activity, c: "#34d399", g: [8, 14, 22, 18, 28, 32, 40] },
  { l: "Avg Completion", v: "87.3%", d: "+2.4% week", i: Trophy, c: "#fbbf24", g: [60, 65, 62, 70, 74, 78, 87] },
];

function StatGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {STATS.map(({ l, v, d, i: Icon, c, g }) => (
        <div
          key={l}
          className="glass group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: `radial-gradient(120px circle at 80% 0%, ${c}22, transparent)` }}
          />
          <div className="flex items-start justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${c}22`, color: c, boxShadow: `0 0 22px ${c}33` }}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[10px] text-muted-foreground">{d}</span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold tracking-tight">{v}</p>
          <p className="text-xs text-muted-foreground">{l}</p>
          <div className="mt-2"><Sparkline data={g} color={c} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Quiz Table ---------- */
const ROWS = [
  { id: "QZ-2041", t: "Algebra Foundations · Set A", lvl: "Class 9", sub: "Math", ch: "Polynomials", mcq: 10, dur: "15m", st: "Published", at: 412, dt: "May 12" },
  { id: "QZ-2040", t: "Photosynthesis Quick Check", lvl: "Class 10", sub: "Biology", ch: "Life Processes", mcq: 10, dur: "12m", st: "Published", at: 308, dt: "May 11" },
  { id: "QZ-2039", t: "Kinematics Sprint", lvl: "Class 11", sub: "Physics", ch: "Motion", mcq: 10, dur: "20m", st: "Draft", at: 0, dt: "May 11" },
  { id: "QZ-2038", t: "Organic Nomenclature", lvl: "Class 12", sub: "Chemistry", ch: "Hydrocarbons", mcq: 10, dur: "18m", st: "Hidden", at: 96, dt: "May 10" },
  { id: "QZ-2037", t: "Modern History · Round 2", lvl: "Class 10", sub: "History", ch: "Nationalism", mcq: 10, dur: "15m", st: "Published", at: 524, dt: "May 09" },
  { id: "QZ-2036", t: "Probability Power Quiz", lvl: "Class 12", sub: "Math", ch: "Probability", mcq: 10, dur: "20m", st: "Scheduled", at: 0, dt: "May 14" },
];

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Published: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
    Draft: "bg-amber-400/10 text-amber-400 border-amber-400/30",
    Hidden: "bg-rose-400/10 text-rose-400 border-rose-400/30",
    Scheduled: "bg-sky-400/10 text-sky-400 border-sky-400/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[s]}`}>
      {s}
    </span>
  );
}

function QuizTable() {
  return (
    <div className="glass shadow-card-soft overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div>
          <h3 className="font-display text-sm font-bold tracking-tight">All Quizzes</h3>
          <p className="text-[11px] text-muted-foreground">1,248 records · 10 per quiz · auto-validated</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow" />
          Live sync
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-background/30 text-muted-foreground">
            <tr className="text-left">
              {["Quiz ID", "Title", "Level", "Subject", "Chapter", "MCQs", "Duration", "Status", "Attempts", "Date", "Actions"].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-t border-border/30 transition-colors hover:bg-background/40">
                <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-[var(--neon-blue)]">{r.id}</td>
                <td className="px-3 py-3 font-medium">{r.t}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.lvl}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.sub}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.ch}</td>
                <td className="px-3 py-3">{r.mcq}</td>
                <td className="px-3 py-3 text-muted-foreground">{r.dur}</td>
                <td className="px-3 py-3"><StatusBadge s={r.st} /></td>
                <td className="px-3 py-3 font-medium">{r.at.toLocaleString()}</td>
                <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{r.dt}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    {[Edit3, Eye, Copy, Send, EyeOff, Trash2].map((Ic, k) => (
                      <button key={k} className="rounded-lg border border-border/40 bg-background/40 p-1.5 hover:border-[var(--neon-purple)]/60 hover:text-[var(--neon-purple)]">
                        <Ic className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
        <span>Showing 1–6 of 1,248</span>
        <div className="flex items-center gap-1">
          {["1", "2", "3", "…", "208"].map((p) => (
            <button key={p} className="rounded-md border border-border/40 px-2 py-1 hover:border-[var(--neon-blue)]/60">{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Quiz Builder ---------- */
const MCQ_POOL = Array.from({ length: 12 }).map((_, i) => ({
  id: `MCQ-${(8120 + i).toString()}`,
  q: [
    "Which of the following is a quadratic polynomial?",
    "The SI unit of electric current is …",
    "Photosynthesis primarily occurs in the …",
    "Find the derivative of sin(x²).",
    "Which Mughal emperor built the Taj Mahal?",
    "Identify the noble gas configuration.",
    "What is the value of g at sea level?",
    "DNA replication occurs during which phase?",
    "Speed of light in vacuum equals …",
    "Pythagoras theorem applies to which triangle?",
    "Mitochondria are the powerhouse of the …",
    "Solve: lim x→0 (sin x / x)",
  ][i],
  sub: ["Math", "Physics", "Biology", "Math", "History", "Chemistry", "Physics", "Biology", "Physics", "Math", "Biology", "Math"][i],
  diff: ["Easy", "Medium", "Hard", "Medium", "Easy", "Hard", "Medium", "Hard", "Easy", "Easy", "Easy", "Medium"][i],
}));

function QuizBuilder() {
  const [selected, setSelected] = useState<string[]>(MCQ_POOL.slice(0, 6).map((m) => m.id));
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 10 ? [...s, id] : s));

  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold tracking-tight">Quiz Builder</h3>
          <p className="text-xs text-muted-foreground">Compose a chapter-wise timed quiz in four steps</p>
        </div>
        <span className="rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-3 py-1 text-[10px] text-[var(--neon-purple)]">
          {selected.length}/10 MCQs selected
        </span>
      </div>

      {/* Step 1 */}
      <Step n={1} title="Select Scope" icon={Filter}>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            { l: "Level", v: "Class 10" },
            { l: "Subject", v: "Physics" },
            { l: "Chapter", v: "Light · Reflection & Refraction" },
          ].map((f) => (
            <div key={f.l} className="rounded-xl border border-border/40 bg-background/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.l}</p>
              <p className="text-sm font-medium">{f.v}</p>
            </div>
          ))}
        </div>
      </Step>

      {/* Step 2 */}
      <Step n={2} title="Pick Exactly 10 MCQs from Practice Pool" icon={ListChecks}>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search MCQs by keyword, chapter, ID…" className="w-full rounded-xl border border-border/40 bg-background/40 py-2 pl-9 pr-3 text-xs outline-none focus:border-[var(--neon-blue)]/60" />
          </div>
          <button className="rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-xs hover:border-[var(--neon-purple)]/60">All Subjects</button>
          <button className="rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-xs hover:border-[var(--neon-purple)]/60">All Difficulty</button>
        </div>
        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
          {MCQ_POOL.map((m) => {
            const on = selected.includes(m.id);
            return (
              <label
                key={m.id}
                className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                  on
                    ? "border-[var(--neon-purple)]/60 bg-[var(--neon-purple)]/10 shadow-glow"
                    : "border-border/40 bg-background/30 hover:border-[var(--neon-blue)]/50"
                }`}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(m.id)} className="mt-1 h-4 w-4 accent-[var(--neon-purple)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--neon-blue)]">{m.id}</span>
                    <span className="rounded-full bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">{m.sub}</span>
                    <span className="rounded-full bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">{m.diff}</span>
                  </div>
                  <p className="mt-1 truncate text-xs">{m.q}</p>
                </div>
                <button type="button" className="opacity-0 transition-opacity group-hover:opacity-100" aria-label="Preview">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </label>
            );
          })}
        </div>
      </Step>

      {/* Step 3 */}
      <Step n={3} title="Quiz Settings" icon={Timer}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Quiz Title" icon={FileText}>
            <input defaultValue="Light · Reflection & Refraction · Set 4" className="w-full rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-sm outline-none focus:border-[var(--neon-purple)]/60" />
          </Field>
          <Field label="Duration (minutes)" icon={Clock}>
            <input type="number" defaultValue={15} className="w-full rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-sm outline-none focus:border-[var(--neon-purple)]/60" />
          </Field>
          <ToggleRow label="Auto publish on save" icon={Send} defaultOn />
          <ToggleRow label="Randomize question order" icon={Shuffle} defaultOn />
          <ToggleRow label="Show instant result" icon={Zap} />
          <ToggleRow label="Allow retake after 24h" icon={CheckCircle2} defaultOn />
        </div>
      </Step>

      {/* Step 4 */}
      <Step n={4} title="Publish" icon={Send}>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { l: "Save Draft", i: Save, ghost: true },
            { l: "Preview Quiz", i: Eye, ghost: true },
            { l: "Schedule Quiz", i: Calendar, ghost: true },
            { l: "Publish Quiz", i: Send },
          ].map(({ l, i: Icon, ghost }) => (
            <button
              key={l}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all hover:-translate-y-0.5 ${
                ghost ? "border border-border/40 bg-background/40 hover:border-[var(--neon-blue)]/60" : "bg-cta-gradient text-white shadow-glow"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {l}
            </button>
          ))}
        </div>
      </Step>
    </div>
  );
}

function Step({ n, title, icon: Icon, children }: { n: number; title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-2xl border border-border/30 bg-background/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-gradient text-[11px] font-bold text-white shadow-glow">
          {n}
        </div>
        <Icon className="h-3.5 w-3.5 text-[var(--neon-blue)]" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ label, icon: Icon, defaultOn }: { label: string; icon: any; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((x) => !x)}
      className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2 text-xs hover:border-[var(--neon-purple)]/50"
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> {label}
      </span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-[var(--neon-purple)] shadow-glow" : "bg-border/60"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

/* ---------- Right widgets ---------- */
function AnalyticsWidget() {
  const bars = [28, 42, 36, 58, 48, 72, 64];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold tracking-tight">Quiz Analytics</h3>
        <TrendingUp className="h-4 w-4 text-[var(--neon-blue)]" />
      </div>
      <p className="font-display text-2xl font-bold">12,408</p>
      <p className="text-[11px] text-muted-foreground">Daily attempts · last 7 days</p>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-80" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {[
          { l: "Completion trend", v: "+6.4%", c: "text-emerald-400" },
          { l: "Avg student score", v: "78.2%", c: "text-[var(--neon-blue)]" },
          { l: "Most played", v: "Algebra · Set A", c: "text-[var(--neon-purple)]" },
        ].map((r) => (
          <div key={r.l} className="flex items-center justify-between border-t border-border/30 pt-2">
            <span className="text-muted-foreground">{r.l}</span>
            <span className={`font-semibold ${r.c}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const items = [
    { i: Plus, t: "New quiz created", d: "Probability Power Quiz · QZ-2036", time: "2m" },
    { i: Edit3, t: "Quiz edited", d: "Kinematics Sprint · timing updated", time: "12m" },
    { i: Send, t: "Published update", d: "Photosynthesis Quick Check · v2", time: "44m" },
    { i: Trophy, t: "Student attempt", d: "Aarav scored 9/10 · Algebra Foundations", time: "1h" },
    { i: EyeOff, t: "Quiz hidden", d: "Organic Nomenclature · pending review", time: "2h" },
    { i: Calendar, t: "Scheduled", d: "Probability Power Quiz · May 14, 9:00", time: "3h" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <h3 className="mb-3 font-display text-sm font-bold tracking-tight">Recent Activity</h3>
      <div className="space-y-3">
        {items.map(({ i: Icon, t, d, time }, k) => (
          <div key={k} className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 bg-background/40 text-[var(--neon-blue)]">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{t}</p>
              <p className="truncate text-[11px] text-muted-foreground">{d}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Popular Quizzes ---------- */
const POPULAR = [
  { n: "Algebra Foundations · Set A", a: 4128, s: "82%", c: "94%", b: "Math" },
  { n: "Photosynthesis Quick Check", a: 3084, s: "76%", c: "91%", b: "Biology" },
  { n: "Kinematics Sprint", a: 2871, s: "71%", c: "88%", b: "Physics" },
  { n: "Modern History · Round 2", a: 2640, s: "79%", c: "92%", b: "History" },
  { n: "Organic Nomenclature", a: 2104, s: "68%", c: "84%", b: "Chemistry" },
];

function PopularQuizzes() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold tracking-tight">Popular Quizzes</h3>
          <p className="text-[11px] text-muted-foreground">Ranked by attempts · last 30 days</p>
        </div>
        <Star className="h-4 w-4 text-amber-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              {["#", "Quiz Name", "Attempts", "Avg Score", "Completion", "Top Subject", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {POPULAR.map((p, i) => (
              <tr key={p.n} className="border-t border-border/30 transition-colors hover:bg-background/40">
                <td className="px-3 py-3 font-mono text-[var(--neon-purple)]">0{i + 1}</td>
                <td className="px-3 py-3 font-medium">{p.n}</td>
                <td className="px-3 py-3">{p.a.toLocaleString()}</td>
                <td className="px-3 py-3 text-emerald-400">{p.s}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border/40">
                      <div className="h-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" style={{ width: p.c }} />
                    </div>
                    <span className="text-muted-foreground">{p.c}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center rounded-full border border-[var(--neon-blue)]/30 bg-[var(--neon-blue)]/10 px-2 py-0.5 text-[10px] text-[var(--neon-blue)]">
                    {p.b}
                  </span>
                </td>
                <td className="px-3 py-3 text-muted-foreground"><ChevronRight className="h-4 w-4" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Floating particles ---------- */
function Particles() {
  const dots = useMemo(
    () => Array.from({ length: 14 }).map(() => ({
      l: Math.random() * 100,
      t: Math.random() * 100,
      s: 2 + Math.random() * 3,
      d: 4 + Math.random() * 6,
    })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[var(--neon-purple)]/40 blur-[1px] animate-pulse-glow"
          style={{ left: `${d.l}%`, top: `${d.t}%`, width: d.s, height: d.s, animationDuration: `${d.d}s` }}
        />
      ))}
    </div>
  );
}

/* ---------- Page ---------- */
export function QuizManagerFlow() {
  return (
    <>
      <Particles />
      <AdminTopbar />

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Quiz <span className="text-gradient">Management Center</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage and publish chapter-wise timed quizzes.
          </p>
        </div>
        <span className="hidden rounded-full border border-border/40 bg-background/40 px-3 py-1 text-[11px] text-muted-foreground md:inline-flex">
          Last sync · just now
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <ActionBar />
        <FilterPanel />
        <StatGrid />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <QuizTable />
            <QuizBuilder />
          </div>
          <div className="space-y-4">
            <AnalyticsWidget />
            <RecentActivity />
          </div>
        </div>

        <PopularQuizzes />
      </div>
    </>
  );
}
