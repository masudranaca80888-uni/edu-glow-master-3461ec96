import {
  Search,
  Bell,
  Moon,
  Sun,
  CircleDot,
  Users,
  ListChecks,
  Trophy,
  CreditCard,
  Timer,
  Activity,
  Server,
  Upload,
  PlusCircle,
  Send,
  PlayCircle,
  FileUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Database,
  HardDrive,
  Wifi,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Layers,
  Download,
  PenSquare,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export function AdminFlow() {
  return (
    <div className="space-y-4">
      <AdminTopbar />
      <Header />
      <StatGrid />

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <WeeklyActivityChart />
          <div className="grid gap-4 lg:grid-cols-2">
            <SubjectPerformance />
            <McqUploadChart />
          </div>
          <ExamParticipation />
          <RecentActivityFeed />
          <QuickActions />
        </div>

        <aside className="space-y-4">
          <PlatformStatus />
          <TopStudents />
          <PendingTasks />
        </aside>
      </div>

      <SystemOverview />
    </div>
  );
}

/* ---------------- Topbar ---------------- */
function AdminTopbar() {
  const [dark, setDark] = useState(true);
  return (
    <div className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search users, exams, content…"
          className="h-10 w-full rounded-xl border border-border/60 bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-[var(--neon-blue)]/60"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] text-emerald-300 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" />
          All systems operational
        </div>
        <button
          onClick={() => setDark((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/40 hover:text-foreground"
        >
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/40">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cta-gradient px-1 text-[9px] font-bold text-white shadow-glow">
            7
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-1.5 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta-gradient text-[10px] font-bold text-white shadow-glow">
            AD
          </div>
          <div className="leading-tight">
            <p className="text-xs font-semibold">Admin</p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header() {
  return (
    <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--neon-blue)]">
            <ShieldCheck className="h-3.5 w-3.5" /> Control Center · Live
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Admin <span className="text-gradient">Control Center</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage students, exams, resources and platform analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-cta-gradient flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
            <PlusCircle className="h-4 w-4" /> New Resource
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 text-sm">
            <Send className="h-4 w-4" /> Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Stat grid ---------------- */
function StatGrid() {
  const stats = [
    { l: "Total Students", v: "48,920", d: "+312 this week", up: true, i: Users, tint: "text-sky-300", spark: [12, 18, 14, 22, 19, 28, 24] },
    { l: "Total MCQs", v: "126,408", d: "+1,284 new", up: true, i: ListChecks, tint: "text-fuchsia-300", spark: [10, 14, 20, 18, 26, 30, 34] },
    { l: "Active Exams", v: "182", d: "+8 today", up: true, i: Trophy, tint: "text-amber-300", spark: [22, 20, 26, 18, 24, 28, 30] },
    { l: "Revenue", v: "$184.2K", d: "−2.1% vs last", up: false, i: CreditCard, tint: "text-emerald-300", spark: [24, 28, 22, 30, 26, 20, 22] },
    { l: "Daily Active", v: "12,402", d: "+4.8%", up: true, i: Activity, tint: "text-violet-300", spark: [16, 22, 18, 28, 24, 32, 30] },
    { l: "Server Status", v: "99.98%", d: "All healthy", up: true, i: Server, tint: "text-teal-300", spark: [28, 30, 28, 30, 32, 30, 32] },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.l}
          className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[var(--neon-purple)]/0 to-[var(--neon-blue)]/0 opacity-0 transition-opacity group-hover:opacity-30 group-hover:from-[var(--neon-purple)]/40 group-hover:to-[var(--neon-blue)]/40" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 ${s.tint}`}>
                <s.i className="h-4 w-4" />
              </div>
              <span
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  s.up
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                }`}
              >
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {s.d.split(" ")[0]}
              </span>
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className="font-display text-2xl font-bold">{s.v}</p>
            <Spark data={s.spark} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const h = 28;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-7 w-full">
      <defs>
        <linearGradient id={`g-${pts.length}`} x1="0" x2="1">
          <stop offset="0%" stopColor="var(--neon-purple)" />
          <stop offset="100%" stopColor="var(--neon-blue)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#g-${pts.length})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

/* ---------------- Weekly activity ---------------- */
function WeeklyActivityChart() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const a = [40, 55, 48, 70, 62, 88, 75];
  const b = [28, 38, 32, 52, 45, 60, 56];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Weekly Student Activity</h3>
          <p className="text-xs text-muted-foreground">Active learners vs new sign-ups</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--neon-purple)]" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--neon-blue)]" /> New
          </span>
        </div>
      </div>
      <div className="mt-5 flex h-48 items-end gap-3">
        {days.map((d, i) => (
          <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-end justify-center gap-1">
              <div
                className="w-1/2 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)] to-fuchsia-400 shadow-[0_0_12px_var(--neon-purple)]"
                style={{ height: `${a[i] * 1.6}px` }}
              />
              <div
                className="w-1/2 rounded-t-md bg-gradient-to-t from-[var(--neon-blue)] to-sky-300 opacity-80"
                style={{ height: `${b[i] * 1.6}px` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Subject performance (donut) ---------------- */
function SubjectPerformance() {
  const data = [
    { l: "Mathematics", v: 32, c: "#a855f7" },
    { l: "Physics", v: 24, c: "#3b82f6" },
    { l: "Chemistry", v: 18, c: "#22d3ee" },
    { l: "Biology", v: 16, c: "#f472b6" },
    { l: "English", v: 10, c: "#f59e0b" },
  ];
  const total = data.reduce((s, d) => s + d.v, 0);
  let offset = 0;
  const C = 2 * Math.PI * 42;
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <h3 className="font-display text-lg font-semibold">Subject Performance</h3>
      <p className="text-xs text-muted-foreground">Average score distribution</p>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeOpacity="0.3" strokeWidth="12" fill="none" />
            {data.map((d) => {
              const len = (d.v / total) * C;
              const el = (
                <circle
                  key={d.l}
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={d.c}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold">82%</span>
            <span className="text-[10px] text-muted-foreground">avg score</span>
          </div>
        </div>
        <ul className="flex-1 space-y-1.5 text-xs">
          {data.map((d) => (
            <li key={d.l} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: d.c }} />
                {d.l}
              </span>
              <span className="text-muted-foreground">{d.v}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- MCQ upload area chart ---------------- */
function McqUploadChart() {
  const data = [22, 30, 26, 42, 38, 56, 50, 68, 62, 78, 72, 90];
  const w = 320, h = 130;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - (v / max) * (h - 10)}`).join(" ");
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">MCQ Upload Analytics</h3>
          <p className="text-xs text-muted-foreground">Past 12 months</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
          +312%
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-32 w-full">
        <defs>
          <linearGradient id="areaG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--neon-blue)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="lineG" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--neon-purple)" />
            <stop offset="100%" stopColor="var(--neon-blue)" />
          </linearGradient>
        </defs>
        <polygon fill="url(#areaG)" points={`0,${h} ${pts} ${w},${h}`} />
        <polyline fill="none" stroke="url(#lineG)" strokeWidth="2" points={pts} />
      </svg>
    </div>
  );
}

/* ---------------- Exam participation ---------------- */
function ExamParticipation() {
  const rows = [
    { e: "JEE Mock #14", p: 4820, t: 6000, c: "from-fuchsia-500 to-purple-500" },
    { e: "NEET Full Test #08", p: 3214, t: 5000, c: "from-sky-500 to-blue-500" },
    { e: "Class 12 Physics Quiz", p: 2105, t: 3000, c: "from-emerald-500 to-teal-500" },
    { e: "Maths Speed Drill", p: 1832, t: 2500, c: "from-amber-500 to-orange-500" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Exam Participation</h3>
          <p className="text-xs text-muted-foreground">Live & recently completed</p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.e}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">{r.e}</span>
              <span className="text-muted-foreground">
                {r.p.toLocaleString()} / {r.t.toLocaleString()}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/40">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${r.c} shadow-[0_0_10px_currentColor]`}
                style={{ width: `${(r.p / r.t) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Recent activity feed ---------------- */
function RecentActivityFeed() {
  const acts = [
    { i: UserPlus, t: "New student registration · Rohan M.", time: "Just now", tag: "Signup", c: "text-sky-300 bg-sky-500/15" },
    { i: FileUp, t: "Uploaded 240 MCQs · Chemistry", time: "4m ago", tag: "Upload", c: "text-fuchsia-300 bg-fuchsia-500/15" },
    { i: Trophy, t: "Mock submission · JEE #14 — 542 entries", time: "12m ago", tag: "Exam", c: "text-amber-300 bg-amber-500/15" },
    { i: PenSquare, t: "Admin edited grading rubric · Physics", time: "30m ago", tag: "Admin", c: "text-violet-300 bg-violet-500/15" },
    { i: Send, t: "Broadcast sent · 48,920 recipients", time: "1h ago", tag: "Notify", c: "text-emerald-300 bg-emerald-500/15" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Live Activity</h3>
        <span className="flex items-center gap-1 text-[11px] text-emerald-300">
          <CircleDot className="h-3 w-3 animate-pulse" /> Live
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {acts.map((a, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${a.c}`}>
              <a.i className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{a.t}</p>
              <p className="text-[10px] text-muted-foreground">{a.time}</p>
            </div>
            <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
              {a.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Quick actions ---------------- */
function QuickActions() {
  const actions = [
    { t: "Upload MCQ", i: Upload, c: "from-fuchsia-500/30 to-purple-500/10 text-fuchsia-300" },
    { t: "Create Quiz", i: Timer, c: "from-sky-500/30 to-blue-500/10 text-sky-300" },
    { t: "Publish Mock", i: Trophy, c: "from-amber-500/30 to-orange-500/10 text-amber-300" },
    { t: "Add Video Class", i: PlayCircle, c: "from-violet-500/30 to-indigo-500/10 text-violet-300" },
    { t: "Upload Notes", i: FileText, c: "from-cyan-500/30 to-teal-500/10 text-cyan-300" },
    { t: "Send Notification", i: Send, c: "from-emerald-500/30 to-green-500/10 text-emerald-300" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((a) => (
          <button
            key={a.t}
            className={`group flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-gradient-to-br ${a.c} p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-glow`}
          >
            <a.i className="h-5 w-5" />
            <span className="text-xs font-semibold text-foreground">{a.t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Platform status ---------------- */
function PlatformStatus() {
  const items = [
    { i: Server, l: "Active servers", v: "12 / 12", ok: true },
    { i: Database, l: "Database health", v: "Optimal", ok: true },
    { i: Wifi, l: "API response", v: "82ms", ok: true },
    { i: HardDrive, l: "Storage", v: "68% used", ok: false },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-emerald-300" />
        <h3 className="text-sm font-semibold">Platform Status</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.l} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40">
              <it.i className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium">{it.l}</p>
              <p className="text-[10px] text-muted-foreground">{it.v}</p>
            </div>
            <span
              className={`h-2 w-2 rounded-full ${
                it.ok ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Top students ---------------- */
function TopStudents() {
  const s = [
    { r: 1, n: "Ananya P.", xp: "12,480", acc: "94%", streak: 28 },
    { r: 2, n: "Rohan M.", xp: "11,920", acc: "92%", streak: 24 },
    { r: 3, n: "Ishita K.", xp: "10,540", acc: "90%", streak: 22 },
    { r: 4, n: "Karan V.", xp: "9,820", acc: "89%", streak: 19 },
    { r: 5, n: "Sara N.", xp: "9,210", acc: "88%", streak: 18 },
  ];
  const medal = (r: number) =>
    r === 1 ? "bg-amber-500/20 text-amber-300" : r === 2 ? "bg-slate-400/20 text-slate-200" : r === 3 ? "bg-orange-500/20 text-orange-300" : "bg-muted/40 text-foreground/70";
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-semibold">Top Performing Students</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {s.map((it) => (
          <li
            key={it.n}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-2.5"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold ${medal(it.r)}`}>
              #{it.r}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{it.n}</p>
              <p className="text-[10px] text-muted-foreground">
                {it.xp} XP · {it.acc} acc
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-500/10 px-2 py-0.5 text-[10px] text-orange-300">
              <Flame className="h-2.5 w-2.5" /> {it.streak}d
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Pending tasks ---------------- */
function PendingTasks() {
  const tasks = [
    { i: CheckCircle2, t: "Approve 12 instructor MCQ batches", c: "text-amber-300" },
    { i: Clock, t: "Schedule NEET full-length test", c: "text-sky-300" },
    { i: PenSquare, t: "Finalize draft notification (#48)", c: "text-fuchsia-300" },
    { i: AlertCircle, t: "Review 3 flagged reports", c: "text-rose-300" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Pending Tasks</h3>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">
          {tasks.length} pending
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-2.5">
            <t.i className={`h-4 w-4 ${t.c}`} />
            <span className="flex-1 text-xs">{t.t}</span>
            <button className="text-[10px] text-muted-foreground hover:text-foreground">Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- System overview ---------------- */
function SystemOverview() {
  const items = [
    { l: "Total downloads", v: "248,930", i: Download, tint: "text-sky-300" },
    { l: "Video watch hours", v: "92,418 h", i: PlayCircle, tint: "text-fuchsia-300" },
    { l: "Flash card usage", v: "1.2M flips", i: Layers, tint: "text-violet-300" },
    { l: "Most active subject", v: "Mathematics", i: Sparkles, tint: "text-amber-300" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">System Overview</h3>
          <p className="text-xs text-muted-foreground">Aggregate platform usage signals</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.l}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{it.l}</p>
                <p className="font-display mt-1 text-xl font-bold">{it.v}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 ${it.tint}`}>
                <it.i className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
