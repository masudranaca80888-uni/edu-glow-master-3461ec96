import {
  Search,
  Bell,
  Sun,
  Moon,
  Activity,
  Plus,
  Sparkles,
  Layers,
  BookOpen,
  Send,
  CalendarClock,
  Download,
  Filter,
  ArrowUpDown,
  Trophy,
  Users,
  Timer,
  CheckCircle2,
  Target,
  PlayCircle,
  Edit3,
  Trash2,
  EyeOff,
  Eye,
  Copy,
  BarChart3,
  ChevronRight,
  GripVertical,
  Shuffle,
  Bell as BellRing,
  Flame,
  Save,
  Rocket,
  CalendarPlus,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

/* ---------- helpers ---------- */

function Spark({ data, color = "var(--neon-purple)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full">
      <defs>
        <linearGradient id={`g-${color.replace(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#g-${color.replace(/\W/g, "")})`} />
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mocks, students, subjects, IDs…"
          className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" />
          All systems nominal · 99.99%
        </div>
        <Button size="icon" variant="ghost" className="rounded-xl">
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>
        <Button size="icon" variant="ghost" className="relative rounded-xl">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple)]" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 p-1 pl-3">
          <div className="leading-tight text-right">
            <p className="text-xs font-semibold">Asha Rahman</p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
          <div className="bg-cta-gradient flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-glow">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- header & actions ---------- */

function HeaderBlock() {
  return (
    <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Trophy className="mr-1 h-3 w-3" /> Mock Center
            </Badge>
            <span className="text-xs text-muted-foreground">/ Admin / Mock Test Manager</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Mock Test <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create, schedule and manage full mock examinations with surgical precision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient rounded-xl text-white shadow-glow hover:opacity-95">
            <Plus className="h-4 w-4" /> Create Mock Test
          </Button>
          <Button variant="outline" className="rounded-xl border-white/15 bg-background/40">
            <Sparkles className="h-4 w-4" /> Generate from MCQs
          </Button>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {[
          { l: "Full Subject Mock", i: BookOpen },
          { l: "Chapter Wise Mock", i: Layers },
          { l: "Publish Mock", i: Send },
          { l: "Schedule Mock", i: CalendarClock },
          { l: "Export Mock", i: Download },
        ].map((a) => (
          <button
            key={a.l}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-background/50 px-3.5 py-2 text-xs font-medium backdrop-blur transition-all hover:border-[var(--neon-purple)]/40 hover:shadow-glow"
          >
            <a.i className="h-3.5 w-3.5 text-[var(--neon-purple)] group-hover:text-[var(--neon-blue)]" />
            {a.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterPanel() {
  const pills = ["Level", "Subject", "Mock Type", "Status", "Date"];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mock test by title or ID…"
            className="h-9 rounded-xl border-white/10 bg-background/60 pl-9"
          />
        </div>
        {pills.map((p) => (
          <button
            key={p}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs hover:border-[var(--neon-blue)]/40"
          >
            <Filter className="h-3 w-3" /> {p} <ChevronRight className="h-3 w-3 rotate-90" />
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs">
          <ArrowUpDown className="h-3 w-3" /> Sort: Latest
        </div>
      </div>
    </div>
  );
}

/* ---------- stats ---------- */

function StatGrid() {
  const stats = [
    { l: "Total Mock Tests", v: "1,284", d: "+42 this week", i: Trophy, c: "var(--neon-purple)", s: [4, 6, 5, 8, 7, 10, 12] },
    { l: "Active Mock Exams", v: "37", d: "8 live now", i: PlayCircle, c: "#22c55e", s: [3, 4, 4, 5, 6, 7, 8] },
    { l: "Scheduled Mocks", v: "62", d: "Next: in 2h 14m", i: CalendarClock, c: "var(--neon-blue)", s: [2, 3, 5, 4, 6, 7, 8] },
    { l: "Total Participants", v: "84,932", d: "+3.2k this week", i: Users, c: "#a855f7", s: [10, 12, 14, 13, 16, 18, 21] },
    { l: "Avg Student Accuracy", v: "76.4%", d: "+2.1% vs last", i: Target, c: "#f59e0b", s: [60, 65, 64, 70, 72, 74, 76] },
    { l: "Completion Rate", v: "91.8%", d: "Healthy", i: CheckCircle2, c: "#06b6d4", s: [80, 82, 85, 88, 89, 90, 91] },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.l}
          className="glass group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
            style={{ background: s.c }}
          />
          <div className="flex items-center justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10"
              style={{ background: `color-mix(in oklab, ${s.c} 15%, transparent)` }}
            >
              <s.i className="h-4 w-4" style={{ color: s.c }} />
            </div>
            <span className="text-[10px] text-muted-foreground">7d</span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">{s.l}</p>
          <p className="font-display text-2xl font-bold tracking-tight">{s.v}</p>
          <Spark data={s.s} color={s.c} />
          <p className="text-[10px] text-muted-foreground">{s.d}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- table ---------- */

const MOCKS = [
  { id: "MK-3042", t: "Full Constitutional Law Mock", lvl: "Advanced", sub: "Law", ty: "Full", q: 100, dur: "120m", p: 4_812, st: "Published", date: "May 18, 2026" },
  { id: "MK-3041", t: "Microeconomics Chapter Mock", lvl: "Professional", sub: "Economics", ty: "Chapter", q: 40, dur: "60m", p: 2_134, st: "Scheduled", date: "May 22, 2026" },
  { id: "MK-3040", t: "Anatomy & Physiology Final", lvl: "Certificate", sub: "Medical", ty: "Full", q: 150, dur: "180m", p: 6_290, st: "Published", date: "May 17, 2026" },
  { id: "MK-3039", t: "Calculus II — Integrals", lvl: "Professional", sub: "Math", ty: "Chapter", q: 30, dur: "45m", p: 1_476, st: "Draft", date: "—" },
  { id: "MK-3038", t: "Organic Chemistry Sprint", lvl: "Advanced", sub: "Chemistry", ty: "Chapter", q: 35, dur: "50m", p: 982, st: "Hidden", date: "May 14, 2026" },
  { id: "MK-3037", t: "World History — Cold War", lvl: "Certificate", sub: "History", ty: "Full", q: 80, dur: "90m", p: 3_201, st: "Published", date: "May 12, 2026" },
];

function statusTone(s: string) {
  switch (s) {
    case "Published": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Scheduled": return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case "Draft": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Hidden": return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    default: return "bg-muted text-foreground";
  }
}

function MockTable() {
  return (
    <div className="glass shadow-card-soft overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <h3 className="font-display text-lg font-bold">All Mock Tests</h3>
          <p className="text-xs text-muted-foreground">Showing 6 of 1,284 — live sync enabled</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-white/10 bg-background/40">
            <CircleDot className="mr-1 h-2.5 w-2.5 animate-pulse text-emerald-400" /> Live
          </Badge>
          <Button size="sm" variant="outline" className="rounded-xl border-white/10">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="pl-4">Mock ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>MCQs</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Publish</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCKS.map((m) => (
              <TableRow key={m.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="pl-4 font-mono text-xs text-muted-foreground">{m.id}</TableCell>
                <TableCell className="font-medium">{m.t}</TableCell>
                <TableCell><Badge variant="outline" className="border-white/10 text-[10px]">{m.lvl}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{m.sub}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] text-[var(--neon-purple)]">{m.ty}</span>
                </TableCell>
                <TableCell>{m.q}</TableCell>
                <TableCell>{m.dur}</TableCell>
                <TableCell>{m.p.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusTone(m.st)} border text-[10px]`}>{m.st}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{m.date}</TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-0.5">
                    {[Edit3, Eye, Copy, Send, EyeOff, BarChart3, Trash2].map((I, i) => (
                      <button
                        key={i}
                        className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
                      >
                        <I className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-muted-foreground">
        <span>Page 1 of 215</span>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10">Prev</Button>
          <Button size="sm" className="bg-cta-gradient h-7 rounded-lg text-white">1</Button>
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10">2</Button>
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10">3</Button>
          <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10">Next</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- builder ---------- */

function Step({ n, title, active, children }: { n: number; title: string; active?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border p-4 transition-all ${active ? "border-[var(--neon-purple)]/50 bg-[var(--neon-purple)]/5 shadow-glow" : "border-white/10 bg-background/30"}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${active ? "bg-cta-gradient text-white shadow-glow" : "bg-muted text-muted-foreground"}`}>{n}</div>
        <h4 className="font-display text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function MockBuilder() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Mock Test Builder</h3>
          <p className="text-xs text-muted-foreground">Construct a full mock in four guided steps.</p>
        </div>
        <Badge className="bg-cta-gradient border-0 text-white shadow-glow">Step 1 of 4 in progress</Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Step n={1} title="Scope Selection" active>
          <div className="grid grid-cols-3 gap-2">
            {["Certificate", "Professional", "Advanced"].map((l, i) => (
              <button key={l} className={`rounded-xl border px-3 py-2 text-xs font-medium ${i === 1 ? "border-[var(--neon-blue)]/50 bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]" : "border-white/10 bg-background/40"}`}>{l}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Law", "Math", "Medical", "Economics", "History"].map((s, i) => (
              <span key={s} className={`rounded-md border px-2 py-1 text-[11px] ${i === 0 ? "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "border-white/10"}`}>{s}</span>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2">
            <span className="text-xs">Full Subject Mock</span>
            <Switch defaultChecked />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["Ch.1 Foundations", "Ch.2 Rights", "Ch.3 Federalism", "Ch.4 Judiciary"].map((c, i) => (
              <span key={c} className={`rounded-md border px-2 py-1 text-[11px] ${i < 2 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-muted-foreground"}`}>{c}</span>
            ))}
          </div>
        </Step>

        <Step n={2} title="Question Selection">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search MCQ database…" className="h-9 rounded-xl border-white/10 bg-background/40 pl-9" />
          </div>
          <ul className="mt-3 space-y-2">
            {["Define separation of powers in modern constitutions.", "Which article ensures equality before law?", "What is the role of judicial review?"].map((q, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs">
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="flex-1 truncate">{q}</span>
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2">
            <span className="flex items-center gap-2 text-xs"><Shuffle className="h-3.5 w-3.5" /> Randomize question order</span>
            <Switch defaultChecked />
          </div>
        </Step>

        <Step n={3} title="Mock Settings">
          <div className="space-y-2.5">
            <Input placeholder="Mock title — e.g. Constitutional Law Final 2026" className="h-9 rounded-xl border-white/10 bg-background/40" />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs">
                <Timer className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> 120 min
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs">
                <Target className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> 200 marks
              </div>
            </div>
            {[
              { l: "Negative marking (-0.25)", v: true },
              { l: "Auto publish on schedule", v: true },
              { l: "Rank leaderboard", v: true },
              { l: "Instant result reveal", v: false },
            ].map((o) => (
              <div key={o.l} className="flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-xs">
                {o.l}
                <Switch defaultChecked={o.v} />
              </div>
            ))}
          </div>
        </Step>

        <Step n={4} title="Schedule & Publish">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="text-[10px] text-muted-foreground">Date</p>
              <p className="font-display text-sm font-semibold">May 28, 2026</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="text-[10px] text-muted-foreground">Time</p>
              <p className="font-display text-sm font-semibold">10:00 AM IST</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-xs">
            <span className="flex items-center gap-2"><BellRing className="h-3.5 w-3.5" /> Send notification on publish</span>
            <Switch defaultChecked />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><Save className="h-3.5 w-3.5" /> Save Draft</Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><Eye className="h-3.5 w-3.5" /> Preview</Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><CalendarPlus className="h-3.5 w-3.5" /> Schedule</Button>
            <Button className="bg-cta-gradient rounded-xl text-white shadow-glow"><Rocket className="h-3.5 w-3.5" /> Publish</Button>
          </div>
        </Step>
      </div>
    </div>
  );
}

/* ---------- right sidebar widgets ---------- */

function AnalyticsWidget() {
  const bars = [40, 65, 50, 80, 70, 95, 88];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-sm font-bold">Mock Analytics</h4>
        <BarChart3 className="h-4 w-4 text-[var(--neon-blue)]" />
      </div>
      <p className="text-[10px] text-muted-foreground">Daily participation · last 7d</p>
      <div className="mt-2 flex h-24 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-90" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Avg completion</p>
          <p className="font-semibold">91.8%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Top mock</p>
          <p className="truncate font-semibold">Const. Law Final</p>
        </div>
        <div className="col-span-2 rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Most active subject</p>
          <p className="font-semibold">Medical · 12.4k attempts</p>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  const top = [
    { n: "Ishaan Verma", a: "94.2%", xp: "4,820", s: 28 },
    { n: "Mira Khan", a: "92.7%", xp: "4,610", s: 21 },
    { n: "Daniel Cho", a: "91.3%", xp: "4,402", s: 19 },
    { n: "Yuki Tanaka", a: "90.0%", xp: "4,210", s: 17 },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-sm font-bold">Top Rankers</h4>
        <Trophy className="h-4 w-4 text-amber-400" />
      </div>
      <ul className="space-y-2">
        {top.map((t, i) => (
          <li key={t.n} className="flex items-center gap-3 rounded-xl border border-white/10 bg-background/40 p-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${i === 0 ? "bg-cta-gradient text-white shadow-glow" : "bg-muted"}`}>#{i + 1}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{t.n}</p>
              <p className="text-[10px] text-muted-foreground">Acc {t.a} · {t.xp} XP</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <Flame className="h-3 w-3" /> {t.s}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { i: Plus, c: "var(--neon-purple)", t: "New mock created", s: "Calculus II — Integrals · by Asha", a: "2m ago" },
    { i: Edit3, c: "var(--neon-blue)", t: "Mock edited", s: "Constitutional Law Final · settings updated", a: "14m ago" },
    { i: Users, c: "#22c55e", t: "84 student submissions", s: "Anatomy & Physiology Final", a: "32m ago" },
    { i: CalendarClock, c: "#f59e0b", t: "Scheduled publish queued", s: "Microeconomics Chapter Mock · May 22, 10:00", a: "1h ago" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-sm font-bold">Recent Activity</h4>
        <Activity className="h-4 w-4 text-[var(--neon-purple)]" />
      </div>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10" style={{ background: `color-mix(in oklab, ${it.c} 15%, transparent)` }}>
              <it.i className="h-3.5 w-3.5" style={{ color: it.c }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium">{it.t}</p>
              <p className="truncate text-[11px] text-muted-foreground">{it.s}</p>
              <p className="text-[10px] text-muted-foreground">{it.a}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- bottom: upcoming schedule ---------- */

function UpcomingSchedule() {
  const rows = [
    { t: "Microeconomics Chapter Mock", d: "May 22, 2026 · 10:00 AM", r: 1_842, rem: "On" },
    { t: "Cold War Full Mock", d: "May 24, 2026 · 06:00 PM", r: 2_410, rem: "On" },
    { t: "Anatomy Sprint #4", d: "May 26, 2026 · 09:00 AM", r: 980, rem: "Off" },
    { t: "Constitutional Law Final 2026", d: "May 28, 2026 · 10:00 AM", r: 5_204, rem: "On" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Upcoming Mock Schedule</h3>
          <p className="text-xs text-muted-foreground">Next 7 days of scheduled exams</p>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl border-white/10">
          <CalendarClock className="h-3.5 w-3.5" /> View Calendar
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.t} className="group rounded-2xl border border-white/10 bg-background/40 p-4 transition-all hover:border-[var(--neon-blue)]/40 hover:shadow-glow">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{r.t}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{r.d}</p>
              </div>
              <Badge variant="outline" className={`border text-[10px] ${r.rem === "On" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-muted-foreground"}`}>
                Reminder {r.rem}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {r.r.toLocaleString()} registered
              </div>
              <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10">
                <Edit3 className="h-3 w-3" /> Quick edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- root ---------- */

export function MockTestManagerFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <HeaderBlock />
      <FilterPanel />
      <StatGrid />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <MockTable />
          <MockBuilder />
        </div>
        <aside className="space-y-4">
          <AnalyticsWidget />
          <Leaderboard />
          <ActivityFeed />
        </aside>
      </div>

      <UpcomingSchedule />
    </div>
  );
}
