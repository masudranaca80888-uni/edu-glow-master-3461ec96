import {
  Search, Bell, Sun, Moon, Filter, Download, Calendar, Sparkles, CircleDot,
  Users, GraduationCap, Target, Clock, FileDown, TrendingUp, Activity,
  BarChart3, PieChart, Layers, FileText, PlayCircle, Database, Cpu, HardDrive,
  Zap, Wifi, Brain, Lightbulb, AlertTriangle, Trophy, Flame, Award, Star,
  ChevronRight, Mail, FileSpreadsheet, FileType, RotateCw, ArrowUpRight,
  ArrowDownRight, Crown, Eye, ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

/* ---------- chart primitives ---------- */
function Spark({ data, color = "var(--neon-purple)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 26}`).join(" ");
  const id = color.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`an-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#an-${id})`} />
    </svg>
  );
}

function AreaChart() {
  const a = [12, 18, 16, 24, 30, 28, 36, 42, 48, 56, 62, 74];
  const b = [8, 12, 14, 18, 22, 26, 30, 34, 38, 44, 48, 56];
  const c = [4, 6, 8, 10, 13, 15, 18, 21, 24, 28, 32, 38];
  const toPath = (d: number[]) => {
    const max = 80;
    return d.map((v, i) => `${(i / (d.length - 1)) * 100},${100 - (v / max) * 90}`).join(" ");
  };
  return (
    <svg viewBox="0 0 100 100" className="h-64 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ga-1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ga-2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-blue)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ga-3" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.3" />
      ))}
      <polygon points={`0,100 ${toPath(a)} 100,100`} fill="url(#ga-1)" />
      <polyline points={toPath(a)} fill="none" stroke="var(--neon-purple)" strokeWidth="0.8" />
      <polygon points={`0,100 ${toPath(b)} 100,100`} fill="url(#ga-2)" />
      <polyline points={toPath(b)} fill="none" stroke="var(--neon-blue)" strokeWidth="0.8" />
      <polygon points={`0,100 ${toPath(c)} 100,100`} fill="url(#ga-3)" />
      <polyline points={toPath(c)} fill="none" stroke="#10b981" strokeWidth="0.8" />
    </svg>
  );
}

function Donut({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const r = 38;
  const C = 2 * Math.PI * r;
  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="h-56 w-full">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="14" />
        {slices.map((s, i) => {
          const dash = (s.value / total) * C;
          const off = -((acc / total) * C);
          acc += s.value;
          return (
            <circle
              key={i}
              cx="50" cy="50" r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={off}
              transform="rotate(-90 50 50)"
              strokeLinecap="butt"
              style={{ filter: `drop-shadow(0 0 4px ${s.color})` }}
            />
          );
        })}
        <text x="50" y="48" textAnchor="middle" className="fill-current font-display text-[10px] font-bold">81.4%</text>
        <text x="50" y="58" textAnchor="middle" className="fill-current text-[5px] opacity-60">avg accuracy</text>
      </svg>
    </div>
  );
}

function Heatmap() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const weeks = 14;
  const cells: number[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: weeks }, () => Math.floor(Math.random() * 5))
  );
  const palette = ["bg-white/[0.04]", "bg-[var(--neon-purple)]/20", "bg-[var(--neon-purple)]/40", "bg-[var(--neon-purple)]/60", "bg-[var(--neon-purple)]/90"];
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-1 pt-1 text-[9px] text-muted-foreground">
        {days.map((d, i) => <span key={i} className="h-3.5">{d}</span>)}
      </div>
      <div className="flex-1">
        <div className="grid grid-rows-7 gap-1" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
          {cells.flatMap((row, ri) =>
            row.map((v, ci) => (
              <div
                key={`${ri}-${ci}`}
                className={`h-3.5 rounded-sm ${palette[v]} transition-all hover:scale-110`}
                style={v >= 3 ? { boxShadow: "0 0 6px var(--neon-purple)" } : undefined}
              />
            ))
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          {palette.map((p, i) => <span key={i} className={`h-3 w-3 rounded-sm ${p}`} />)}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function Bars({ data, color = "var(--neon-blue)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox="0 0 100 40" className="h-12 w-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * 34;
        const w = 100 / data.length - 2;
        return <rect key={i} x={i * (100 / data.length) + 1} y={40 - h} width={w} height={h} rx="1.2" fill={color} opacity={0.55 + (i / data.length) * 0.4} />;
      })}
    </svg>
  );
}

/* ---------- sections ---------- */
function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search reports, KPIs, students…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur" />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Sync · live · 12ms
        </div>
        <Button size="icon" variant="ghost" className="rounded-xl">
          <Sun className="h-4 w-4 dark:hidden" /><Moon className="hidden h-4 w-4 dark:block" />
        </Button>
        <Button size="icon" variant="ghost" className="relative rounded-xl">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple)]" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 p-1 pl-3">
          <div className="text-right leading-tight">
            <p className="text-xs font-semibold">Asha Rahman</p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
          <div className="bg-cta-gradient flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-glow">AR</div>
        </div>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow"><Sparkles className="mr-1 h-3 w-3" /> Insights Engine</Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">v3.2 · live</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Analytics &amp; <span className="text-gradient">Reports Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track student performance, engagement and platform growth with advanced analytics and real-time intelligence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
            <FileDown className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur"><Mail className="mr-2 h-4 w-4" /> Schedule</Button>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-background/40 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Real-time</span>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterBar() {
  const chips = [
    { l: "Last 30 days", i: Calendar },
    { l: "All Levels", i: Layers },
    { l: "All Subjects", i: GraduationCap },
    { l: "All Students", i: Users },
  ];
  return (
    <section className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-3">
      {chips.map((c) => (
        <Button key={c.l} variant="outline" size="sm" className="h-9 rounded-xl border-white/15 backdrop-blur">
          <c.i className="mr-2 h-3.5 w-3.5" /> {c.l}
          <ChevronRight className="ml-1 h-3 w-3 rotate-90 opacity-60" />
        </Button>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-9 rounded-xl border-white/15"><RotateCw className="mr-2 h-3.5 w-3.5" /> Refresh</Button>
        <Button size="sm" className="bg-cta-gradient h-9 text-white shadow-glow"><Download className="mr-2 h-3.5 w-3.5" /> Export</Button>
      </div>
    </section>
  );
}

const kpis = [
  { label: "Active Students", value: "162,480", delta: "+4.2%", up: true, icon: Users, color: "var(--neon-purple)", data: [4, 6, 8, 10, 12, 14, 18] },
  { label: "Exams Taken", value: "489,210", delta: "+12.8%", up: true, icon: ListChecks, color: "var(--neon-blue)", data: [3, 6, 9, 11, 13, 16, 20] },
  { label: "Avg Accuracy", value: "81.4%", delta: "+1.6%", up: true, icon: Target, color: "#10b981", data: [6, 7, 7, 8, 9, 10, 11] },
  { label: "Daily Engagement", value: "47m 12s", delta: "+3m", up: true, icon: Clock, color: "#f59e0b", data: [4, 5, 6, 7, 8, 9, 12] },
  { label: "Resource Downloads", value: "92,418", delta: "+8.4%", up: true, icon: Download, color: "#06b6d4", data: [3, 5, 7, 9, 11, 13, 15] },
  { label: "Platform Growth", value: "+18.6%", delta: "MoM", up: true, icon: TrendingUp, color: "#a78bfa", data: [2, 4, 6, 9, 11, 14, 17] },
];

function KPIGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((s) => (
        <div key={s.label} className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl" style={{ background: `${s.color}33` }} />
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/40" style={{ boxShadow: `0 0 16px ${s.color}55` }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <Badge variant="outline" className={`gap-1 text-[10px] ${s.up ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}`}>
              {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {s.delta}
            </Badge>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="font-display text-2xl font-bold tracking-tight">{s.value}</p>
          <Spark data={s.data} color={s.color} />
        </div>
      ))}
    </section>
  );
}

function GrowthChart() {
  return (
    <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Student Growth Analytics</h2>
          <p className="text-xs text-muted-foreground">Registrations · DAU · Retention · 12 months</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--neon-purple)] shadow-[0_0_6px_var(--neon-purple)]" /> Registrations</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--neon-blue)] shadow-[0_0_6px_var(--neon-blue)]" /> DAU</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" /> Retention</span>
        </div>
      </div>
      <AreaChart />
      <div className="mt-2 grid grid-cols-12 text-[10px] text-muted-foreground">
        {["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"].map((m) => (
          <span key={m} className="text-center">{m}</span>
        ))}
      </div>
    </div>
  );
}

const subjects = [
  { label: "Physics", value: 28, color: "#a78bfa" },
  { label: "Chemistry", value: 22, color: "var(--neon-blue)" },
  { label: "Maths", value: 24, color: "var(--neon-purple)" },
  { label: "Biology", value: 18, color: "#10b981" },
  { label: "English", value: 8, color: "#f59e0b" },
];

function SubjectPerformance() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Subject Performance</h2>
          <p className="text-xs text-muted-foreground">Avg accuracy across subjects</p>
        </div>
        <Badge variant="outline" className="border-white/15 text-[10px]">Filterable</Badge>
      </div>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-2">
        <Donut slices={subjects} />
        <div className="space-y-2">
          {subjects.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <span className="flex-1 text-xs">{s.label}</span>
              <div className="w-24"><Progress value={s.value * 3.4} className="h-1.5" /></div>
              <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">{Math.round(s.value * 3.4)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParticipationHeatmap() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Exam Participation</h2>
          <p className="text-xs text-muted-foreground">Mock + quiz activity · last 14 weeks</p>
        </div>
        <div className="flex gap-2 text-[11px]">
          <Badge variant="outline" className="border-emerald-400/30 text-emerald-400">Mock 92%</Badge>
          <Badge variant="outline" className="border-sky-400/30 text-sky-400">Quiz 88%</Badge>
        </div>
      </div>
      <div className="mt-4"><Heatmap /></div>
    </div>
  );
}

const resources = [
  { l: "PDF Downloads", v: 32418, color: "var(--neon-purple)", i: FileText, d: [4, 6, 8, 10, 11, 14, 18] },
  { l: "Video Watch Hours", v: 18420, color: "#ef4444", i: PlayCircle, d: [3, 5, 7, 9, 12, 14, 17] },
  { l: "Flash Card Usage", v: 28140, color: "var(--neon-blue)", i: Layers, d: [2, 4, 6, 9, 11, 13, 16] },
  { l: "Notes Engagement", v: 13560, color: "#10b981", i: FileType, d: [3, 4, 6, 8, 9, 11, 14] },
];

function ResourceUsage() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Resource Usage</h2>
        <Badge variant="outline" className="border-white/15 text-[10px]">7 days</Badge>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {resources.map((r) => (
          <div key={r.l} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-3 transition-all hover:border-white/20 hover:shadow-glow">
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl" style={{ background: `${r.color}33` }} />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-background/60" style={{ boxShadow: `0 0 10px ${r.color}55` }}>
                <r.i className="h-4 w-4" style={{ color: r.color }} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                <p className="font-display text-lg font-bold tracking-tight">{r.v.toLocaleString()}</p>
              </div>
            </div>
            <Spark data={r.d} color={r.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

const mcqChapters = [
  { c: "Thermodynamics", subj: "Physics", diff: 78 },
  { c: "Organic Reactions", subj: "Chemistry", diff: 72 },
  { c: "Calculus · Integrals", subj: "Maths", diff: 69 },
  { c: "Genetics", subj: "Biology", diff: 64 },
  { c: "Modern Physics", subj: "Physics", diff: 61 },
];

function McqAnalytics() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">MCQ Practice Analytics</h2>
          <p className="text-xs text-muted-foreground">Solved volume · difficult chapters · avg time</p>
        </div>
        <Badge variant="outline" className="border-white/15 text-[10px]">live</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Solved</p>
          <p className="font-display text-base font-bold text-[var(--neon-purple)]">3.42M</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Avg time / Q</p>
          <p className="font-display text-base font-bold text-[var(--neon-blue)]">38s</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Top subject</p>
          <p className="font-display text-base font-bold text-emerald-400">Physics</p>
        </div>
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Most Difficult Chapters</p>
      <ul className="mt-2 space-y-2">
        {mcqChapters.map((m) => (
          <li key={m.c} className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/30 px-3 py-2">
            <div className="flex-1">
              <p className="text-sm font-medium">{m.c}</p>
              <p className="text-[10px] text-muted-foreground">{m.subj}</p>
            </div>
            <div className="w-28"><Progress value={m.diff} className="h-1.5" /></div>
            <span className="w-9 text-right text-[11px] tabular-nums text-red-400">{m.diff}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const live = [
  { l: "Active students online", v: "12,408", i: Users, c: "text-emerald-400" },
  { l: "Live mock attempts", v: "1,284", i: Trophy, c: "text-fuchsia-400" },
  { l: "Quiz sessions", v: "3,180", i: ListChecks, c: "text-sky-400" },
  { l: "Uploads / min", v: "42", i: Activity, c: "text-amber-400" },
];

function LivePerformance() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <h2 className="font-display text-lg font-bold">Live Performance</h2>
        </div>
        <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-400">streaming</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {live.map((l) => (
          <div key={l.l} className="rounded-xl border border-white/10 bg-background/40 p-3">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <l.i className={`h-3.5 w-3.5 ${l.c}`} /> {l.l}
            </div>
            <p className="mt-1 font-display text-xl font-bold">{l.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const top = [
  { n: "Aarav Mehta", xp: 18420, acc: 96, streak: 84, sub: ["P","C","M"], rank: 1 },
  { n: "Sara Khan", xp: 17890, acc: 94, streak: 76, sub: ["B","C"], rank: 2 },
  { n: "Rohan Das", xp: 17310, acc: 92, streak: 68, sub: ["M","P"], rank: 3 },
  { n: "Ishita Roy", xp: 16780, acc: 91, streak: 62, sub: ["C","B"], rank: 4 },
  { n: "Vikram Singh", xp: 16240, acc: 89, streak: 54, sub: ["P","M"], rank: 5 },
];

function TopStudents() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Top Students</h2>
        <Badge variant="outline" className="border-white/15 text-[10px]">This week</Badge>
      </div>
      <ul className="mt-3 space-y-2">
        {top.map((s) => {
          const rankColor =
            s.rank === 1 ? "from-amber-400 to-orange-500" :
            s.rank === 2 ? "from-slate-300 to-slate-500" :
            s.rank === 3 ? "from-amber-700 to-amber-900" : "from-white/10 to-white/5";
          return (
            <li key={s.n} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/30 p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${rankColor} text-xs font-bold text-white shadow-glow`}>
                {s.rank}
              </div>
              <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-glow">
                {s.n.split(" ").map((w) => w[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.n}</p>
                <p className="text-[10px] text-muted-foreground">{s.xp.toLocaleString()} XP · {s.acc}% acc · <Flame className="inline h-3 w-3 text-orange-400" /> {s.streak}d</p>
              </div>
              <div className="flex gap-1">
                {s.sub.map((b, i) => (
                  <span key={i} className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-background/60 text-[10px] font-bold" style={{ boxShadow: "0 0 6px var(--neon-purple)" }}>{b}</span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReportGenerator() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Report Generator</h2>
          <p className="text-xs text-muted-foreground">Build & schedule custom analytics reports</p>
        </div>
        <Badge className="bg-cta-gradient border-0 text-white"><Sparkles className="mr-1 h-3 w-3" /> AI-assist</Badge>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Select metrics</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Students Growth","Subject Performance","Exam Participation","Resource Usage","MCQ Analytics","Engagement Time","Top Students","Revenue","Cohort Retention"].map((m, i) => (
              <label key={m} className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs">
                <Switch defaultChecked={i < 5} />
                <span className="truncate">{m}</span>
              </label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Input placeholder="Report name" defaultValue="May 2026 · Performance Snapshot" className="h-9 rounded-xl border-white/10 bg-background/60 text-xs sm:col-span-2" />
            <Input type="date" defaultValue="2026-05-20" className="h-9 rounded-xl border-white/10 bg-background/60 text-xs" />
          </div>
        </div>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Export options</p>
          <Button className="bg-cta-gradient w-full justify-start text-white shadow-glow"><FileType className="mr-2 h-4 w-4" /> Generate PDF</Button>
          <Button variant="outline" className="w-full justify-start border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10"><FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel</Button>
          <Button variant="outline" className="w-full justify-start border-white/15"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button variant="outline" className="w-full justify-start border-sky-400/30 text-sky-400 hover:bg-sky-500/10"><Calendar className="mr-2 h-4 w-4" /> Schedule weekly</Button>
          <Button variant="outline" className="w-full justify-start border-white/15"><Mail className="mr-2 h-4 w-4" /> Email report</Button>
        </div>
      </div>
    </div>
  );
}

const health = [
  { l: "Server CPU", v: 42, suffix: "%", i: Cpu, c: "var(--neon-purple)" },
  { l: "DB Load", v: 58, suffix: "%", i: Database, c: "var(--neon-blue)" },
  { l: "API Latency", v: 28, suffix: "ms", raw: 28, i: Zap, c: "#10b981" },
  { l: "Storage", v: 71, suffix: "%", i: HardDrive, c: "#f59e0b" },
];

function SystemHealth() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-emerald-400" />
          <h3 className="font-display text-sm font-semibold">System Health</h3>
        </div>
        <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-400">99.99% up</Badge>
      </div>
      <ul className="mt-3 space-y-3">
        {health.map((h) => (
          <li key={h.l}>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><h.i className="h-3.5 w-3.5" style={{ color: h.c }} /> {h.l}</span>
              <span className="tabular-nums text-muted-foreground">{h.v}{h.suffix}</span>
            </div>
            <Progress value={h.suffix === "ms" ? 22 : h.v} className="mt-1.5 h-1.5" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const insights = [
  { i: AlertTriangle, c: "text-red-400", t: "Weakest subject", d: "Organic Chemistry accuracy dropped 4.2% this week — consider releasing revision notes." },
  { i: Clock, c: "text-sky-400", t: "Most active time", d: "Engagement peaks at 8–10pm IST. Schedule new releases in this window." },
  { i: Lightbulb, c: "text-amber-400", t: "Content gap", d: "Modern Physics has 2.3× demand vs supply. Add 18 more MCQ sets." },
  { i: TrendingUp, c: "text-emerald-400", t: "Predicted growth", d: "DAU forecast +14.2% next 30 days based on cohort momentum." },
];

function AiInsights() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[var(--neon-purple)]" />
          <h3 className="font-display text-sm font-semibold">AI Insights</h3>
        </div>
        <Badge className="bg-cta-gradient border-0 text-[10px] text-white">beta</Badge>
      </div>
      <ul className="mt-3 space-y-2">
        {insights.map((ins, i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-background/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold"><ins.i className={`h-3.5 w-3.5 ${ins.c}`} /> {ins.t}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">{ins.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const reports = [
  { n: "May 2026 · Performance Snapshot", by: "Asha Rahman", d: "May 20, 2026", t: "PDF" },
  { n: "Q1 · Subject-wise Accuracy", by: "Devansh Iyer", d: "May 18, 2026", t: "Excel" },
  { n: "Mock Test 11 · Participation", by: "Asha Rahman", d: "May 17, 2026", t: "CSV" },
  { n: "Cohort Retention · 90d", by: "Priya Verma", d: "May 14, 2026", t: "PDF" },
  { n: "Resource Engagement Weekly", by: "Auto · Scheduler", d: "May 13, 2026", t: "PDF" },
];
const tIcon = { PDF: FileType, Excel: FileSpreadsheet, CSV: Download };
const tColor: Record<string, string> = {
  PDF: "border-red-500/30 bg-red-500/10 text-red-300",
  Excel: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  CSV: "border-sky-500/30 bg-sky-500/10 text-sky-300",
};

function RecentReports() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[var(--neon-purple)]" />
          <h2 className="font-display text-lg font-semibold">Recent Reports</h2>
          <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">last 30 days</Badge>
        </div>
        <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/15"><Eye className="mr-1.5 h-3.5 w-3.5" />View all</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs">Report Name</TableHead>
              <TableHead className="text-xs">Generated By</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-right text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => {
              const TI = tIcon[r.t as keyof typeof tIcon];
              return (
                <TableRow key={r.n} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                  <TableCell className="text-sm font-medium">{r.n}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.by}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.d}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`gap-1 text-[10px] ${tColor[r.t]}`}><TI className="h-3 w-3" /> {r.t}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/15"><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function AnalyticsReportsFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <FilterBar />
      <KPIGrid />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <GrowthChart />
          <div className="grid gap-4 lg:grid-cols-2">
            <SubjectPerformance />
            <ParticipationHeatmap />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ResourceUsage />
            <McqAnalytics />
          </div>
          <LivePerformance />
          <TopStudents />
          <ReportGenerator />
        </div>
        <div className="space-y-4 xl:col-span-4">
          <SystemHealth />
          <AiInsights />
        </div>
      </div>
      <RecentReports />
    </div>
  );
}
