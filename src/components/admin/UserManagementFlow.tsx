import {
  Search, Bell, Sun, Moon, Plus, Upload, Download, Filter, ArrowUpDown,
  ChevronRight, CheckCircle2, Eye, Activity, BarChart3, Edit3, Trash2,
  Send, EyeOff, Sparkles, CircleDot, Users, UserPlus, ShieldCheck,
  UserCog, Crown, UserX, TrendingUp, MessageSquare, X, Mail, Phone,
  MapPin, Calendar, Award, Flame, Smartphone, LogIn, CreditCard,
  Trophy, Target, Lock, Unlock, AlertTriangle, FileSpreadsheet,
  CloudUpload, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";

function Spark({ data, color = "var(--neon-purple)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 26}`).join(" ");
  const id = color.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`um-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#um-${id})`} />
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search users, emails, IDs…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur" />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Auth · 99.99% uptime
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
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Sparkles className="mr-1 h-3 w-3" /> Identity Control
            </Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">v3.2 · live</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            User <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage students, admins, permissions, subscriptions and platform activity across every account.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <ShieldCheck className="mr-2 h-4 w-4" /> Create Admin
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Upload className="mr-2 h-4 w-4" /> Import Users
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Download className="mr-2 h-4 w-4" /> Export List
          </Button>
          <Button variant="outline" className="border-amber-400/30 text-amber-400 hover:bg-amber-500/10">
            <UserX className="mr-2 h-4 w-4" /> Suspend
          </Button>
          <Button variant="outline" className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10">
            <Send className="mr-2 h-4 w-4" /> Notify
          </Button>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { label: "Total Users", value: "184,210", delta: "+1.8K", icon: Users, color: "var(--neon-purple)", data: [4, 6, 8, 10, 12, 14, 18] },
  { label: "Active Students", value: "162,480", delta: "+4.2%", icon: Activity, color: "var(--neon-blue)", data: [3, 6, 8, 9, 11, 13, 17] },
  { label: "Premium Subs", value: "28,940", delta: "+612", icon: Crown, color: "#f59e0b", data: [2, 4, 6, 8, 10, 12, 15] },
  { label: "Suspended", value: "1,284", delta: "−18", icon: UserX, color: "#ef4444", data: [9, 8, 7, 6, 5, 5, 4] },
  { label: "Daily Active", value: "42,180", delta: "+9.8%", icon: TrendingUp, color: "#10b981", data: [5, 8, 9, 12, 14, 17, 21] },
  { label: "New Today", value: "1,492", delta: "+12.4%", icon: UserPlus, color: "#a78bfa", data: [3, 5, 7, 8, 10, 12, 14] },
];

function StatGrid() {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div key={s.label} className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 20% 0%, ${s.color}22, transparent 60%)` }} />
          <div className="relative flex items-start justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${s.color}22`, color: s.color, boxShadow: `0 0 18px ${s.color}33` }}>
              <s.icon className="h-4 w-4" />
            </div>
            <Badge variant="outline" className="border-white/10 text-[10px] text-muted-foreground">{s.delta}</Badge>
          </div>
          <p className="relative mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="relative font-display text-2xl font-bold tracking-tight">{s.value}</p>
          <div className="relative mt-1"><Spark data={s.data} color={s.color} /></div>
        </div>
      ))}
    </section>
  );
}

function FilterPanel() {
  const roles = ["All Users", "Students", "Admins", "Moderators", "Instructors"];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email, phone or ID…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
        </div>
        {["Role", "Status", "Subscription", "Level"].map((l) => (
          <Button key={l} variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
            <Filter className="mr-2 h-3.5 w-3.5" /> {l}
            <ChevronRight className="ml-1 h-3 w-3 rotate-90 opacity-50" />
          </Button>
        ))}
        <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
          <ArrowUpDown className="mr-2 h-3.5 w-3.5" /> Most Active
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {roles.map((c, i) => (
          <button key={c}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
              i === 0 ? "border-transparent bg-cta-gradient text-white shadow-glow"
                      : "border-white/15 text-foreground/80 hover:border-white/30 hover:bg-muted/40"
            }`}>
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}

const users = [
  { id: "U-10248", name: "Tahmid Hasan", email: "tahmid.h@edu.io", role: "Student", plan: "Premium", xp: 12480, acc: 92, last: "2m ago", status: "Active", c: "var(--neon-purple)" },
  { id: "U-10249", name: "Nabila Ahmed", email: "nabila.a@edu.io", role: "Student", plan: "Pro", xp: 9820, acc: 88, last: "14m ago", status: "Active", c: "var(--neon-blue)" },
  { id: "U-10250", name: "Rafiq Khan", email: "rafiq.k@edu.io", role: "Instructor", plan: "—", xp: 0, acc: 0, last: "1h ago", status: "Active", c: "#10b981" },
  { id: "U-10251", name: "Sumaya Karim", email: "sumaya.k@edu.io", role: "Student", plan: "Free", xp: 4180, acc: 71, last: "3h ago", status: "Pending", c: "#f59e0b" },
  { id: "U-10252", name: "Imran Iqbal", email: "imran.i@edu.io", role: "Moderator", plan: "—", xp: 0, acc: 0, last: "1d ago", status: "Active", c: "#a78bfa" },
  { id: "U-10253", name: "Maliha Roy", email: "maliha.r@edu.io", role: "Student", plan: "Premium", xp: 8240, acc: 84, last: "4d ago", status: "Suspended", c: "#ef4444" },
];

function statusTone(s: string) {
  const m: Record<string, string> = {
    Active: "border-emerald-400/40 bg-emerald-500/10 text-emerald-400",
    Pending: "border-amber-400/40 bg-amber-500/10 text-amber-400",
    Suspended: "border-rose-400/40 bg-rose-500/10 text-rose-400",
  };
  return m[s] ?? "border-white/20 text-muted-foreground";
}

function planTone(p: string) {
  const m: Record<string, string> = {
    Premium: "border-amber-400/40 bg-amber-500/10 text-amber-400",
    Pro: "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]",
    Free: "border-white/15 text-muted-foreground",
  };
  return m[p] ?? "border-white/10 text-muted-foreground";
}

function UserTable() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <p className="font-display text-lg font-bold">All Users</p>
          <p className="text-xs text-muted-foreground">{users.length} of 184,210 · realtime sync</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-white/15">
            <UserCog className="mr-2 h-3.5 w-3.5" /> Roles
          </Button>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow">
            <UserPlus className="mr-2 h-3.5 w-3.5" /> New User
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {["ID", "User", "Email", "Role", "Plan", "XP", "Accuracy", "Last Active", "Status", ""].map((h, i) => (
                <TableHead key={i} className={`text-[11px] uppercase tracking-wider ${i === 5 || i === 6 ? "text-right" : ""} ${i === 9 ? "text-right" : ""}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{u.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-glow"
                        style={{ background: `linear-gradient(135deg, ${u.c}, ${u.c}66)` }}>
                        {u.name.split(" ").map((p) => p[0]).join("")}
                      </div>
                      {u.status === "Active" && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">HSC · Science</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/15 text-[11px]">{u.role}</Badge>
                </TableCell>
                <TableCell><Badge variant="outline" className={planTone(u.plan)}>{u.plan}</Badge></TableCell>
                <TableCell className="text-right font-mono text-xs">{u.xp ? u.xp.toLocaleString() : "—"}</TableCell>
                <TableCell className="text-right">
                  {u.acc ? (
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={u.acc} className="h-1.5 w-14" />
                      <span className="w-8 font-mono text-[11px]">{u.acc}%</span>
                    </div>
                  ) : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.last}</TableCell>
                <TableCell><Badge variant="outline" className={statusTone(u.status)}>{u.status}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {[Eye, Edit3, MessageSquare, UserX, Trash2].map((I, i) => (
                      <Button key={i} size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-white/5">
                        <I className="h-3.5 w-3.5" />
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function ProfileDrawer() {
  const sections = [
    { i: Award, t: "Total XP", v: "12,480", c: "var(--neon-purple)" },
    { i: Target, t: "Accuracy", v: "92%", c: "var(--neon-blue)" },
    { i: Flame, t: "Streak", v: "48 days", c: "#ef4444" },
    { i: Trophy, t: "Rank", v: "#142", c: "#f59e0b" },
  ];
  const activity = [
    { i: CheckCircle2, c: "#10b981", t: "Completed HSC Physics Mock #18", s: "Score 92/100 · 2m ago" },
    { i: Download, c: "var(--neon-purple)", t: "Downloaded Mechanics Imp Qns", s: "4.2 MB · 1h ago" },
    { i: LogIn, c: "var(--neon-blue)", t: "Logged in from iPhone 15 Pro", s: "Dhaka, BD · 3h ago" },
    { i: CreditCard, c: "#f59e0b", t: "Upgraded to Premium Yearly", s: "৳ 4,800 · 2d ago" },
  ];
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
      <div className="relative flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">User Profile</p>
          <p className="font-display text-lg font-bold">Sliding Drawer · Tahmid Hasan</p>
        </div>
        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg"><X className="h-4 w-4" /></Button>
      </div>

      <div className="relative grid gap-4 p-5 lg:grid-cols-[260px_1fr]">
        {/* Identity card */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--neon-purple)]/20 via-background/40 to-[var(--neon-blue)]/20 p-5 text-center shadow-glow">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cta-gradient text-2xl font-bold text-white shadow-glow ring-4 ring-white/10">
              TH
            </div>
            <p className="mt-3 font-display text-lg font-bold">Tahmid Hasan</p>
            <p className="text-[11px] text-muted-foreground">U-10248 · HSC 2nd Year</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="outline" className={planTone("Premium")}><Crown className="mr-1 h-3 w-3" /> Premium</Badge>
              <Badge variant="outline" className={statusTone("Active")}><CircleDot className="mr-1 h-2 w-2 animate-pulse" /> Active</Badge>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-background/40 p-3 text-xs">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Personal Information</p>
            <ul className="mt-2 space-y-1.5">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> tahmid.h@edu.io</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> +880 1700 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Joined Jan 12, 2024</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-cta-gradient text-white shadow-glow"><MessageSquare className="mr-2 h-3.5 w-3.5" /> Message</Button>
            <Button size="sm" variant="outline" className="border-white/15"><Edit3 className="h-3.5 w-3.5" /></Button>
            <Button size="sm" variant="outline" className="border-amber-400/30 text-amber-400"><UserX className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        {/* Stats & activity */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {sections.map((s) => (
              <div key={s.t} className="rounded-xl border border-white/10 bg-background/40 p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: `${s.c}22`, color: s.c, boxShadow: `0 0 12px ${s.c}33` }}>
                  <s.i className="h-3.5 w-3.5" />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{s.t}</p>
                <p className="font-display text-lg font-bold">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Subscription</p>
              <p className="mt-1 font-display text-sm font-bold">Premium Yearly · ৳ 4,800</p>
              <p className="text-[10px] text-muted-foreground">Renews Jan 12, 2026 · auto-renew on</p>
              <Progress value={68} className="mt-2 h-1.5" />
              <p className="mt-1 text-[10px] text-muted-foreground">68% of period · 116 days left</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Achievement badges</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  { i: Trophy, c: "#f59e0b" }, { i: Flame, c: "#ef4444" },
                  { i: Star, c: "var(--neon-purple)" }, { i: Award, c: "var(--neon-blue)" },
                  { i: Target, c: "#10b981" }, { i: Crown, c: "#a78bfa" },
                ].map((b, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10"
                    style={{ background: `${b.c}18`, color: b.c, boxShadow: `0 0 10px ${b.c}33` }}>
                    <b.i className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-background/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recent activity · downloads · logins</p>
              <Badge variant="outline" className="border-white/15 text-[10px]">live</Badge>
            </div>
            <ul className="mt-2 space-y-1.5">
              {activity.map((a, i) => (
                <li key={i} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-background/40 p-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${a.c}22`, color: a.c, boxShadow: `0 0 10px ${a.c}33` }}>
                    <a.i className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{a.t}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{a.s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-background/40 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Device history</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {[
                { n: "iPhone 15 Pro · iOS 18.2", l: "Dhaka · 3h ago", a: true },
                { n: "MacBook Air M3 · Safari", l: "Dhaka · 1d ago", a: false },
              ].map((d) => (
                <div key={d.n} className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/40 p-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--neon-blue)]/15 text-[var(--neon-blue)]">
                    <Smartphone className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{d.n}</p>
                    <p className="text-[10px] text-muted-foreground">{d.l}</p>
                  </div>
                  {d.a && <Badge variant="outline" className="border-emerald-400/40 text-[10px] text-emerald-400">current</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleManager() {
  const roles = [
    { n: "Super Admin", c: "var(--neon-purple)", users: 4, sec: "Critical" },
    { n: "Content Admin", c: "var(--neon-blue)", users: 12, sec: "High" },
    { n: "Moderator", c: "#10b981", users: 28, sec: "Medium" },
    { n: "Instructor", c: "#f59e0b", users: 142, sec: "Standard" },
  ];
  const perms = [
    { m: "MCQ Manager", r: true, w: true, d: true },
    { m: "Quiz Manager", r: true, w: true, d: false },
    { m: "Mock Tests", r: true, w: true, d: false },
    { m: "Question Bank", r: true, w: true, d: true },
    { m: "Video Classes", r: true, w: false, d: false },
    { m: "User Management", r: true, w: false, d: false },
    { m: "Notifications", r: true, w: true, d: false },
    { m: "Analytics", r: true, w: false, d: false },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Admin Role Manager</p>
          <p className="font-display text-lg font-bold">Permissions & access control</p>
        </div>
        <Button size="sm" className="bg-cta-gradient text-white shadow-glow">
          <Plus className="mr-2 h-3.5 w-3.5" /> Custom Role
        </Button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {roles.map((r, i) => (
            <button key={r.n}
              className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                i === 1 ? "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 shadow-glow" : "border-white/10 bg-background/40 hover:border-white/20"
              }`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: `${r.c}22`, color: r.c, boxShadow: `0 0 12px ${r.c}33` }}>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{r.n}</p>
                <p className="text-[10px] text-muted-foreground">{r.users} assigned · {r.sec}</p>
              </div>
              {i === 1 && <ChevronRight className="h-4 w-4 text-[var(--neon-purple)]" />}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content Admin · Permissions</p>
            <Badge variant="outline" className="border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]">
              <Lock className="mr-1 h-3 w-3" /> High security
            </Badge>
          </div>
          <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left">Module</th><th className="px-3 py-2">Read</th><th className="px-3 py-2">Write</th><th className="px-3 py-2">Delete</th></tr>
              </thead>
              <tbody>
                {perms.map((p) => (
                  <tr key={p.m} className="border-t border-white/5">
                    <td className="px-3 py-2 text-xs">{p.m}</td>
                    <td className="px-3 py-2 text-center"><Switch defaultChecked={p.r} /></td>
                    <td className="px-3 py-2 text-center"><Switch defaultChecked={p.w} /></td>
                    <td className="px-3 py-2 text-center"><Switch defaultChecked={p.d} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              { l: "2FA Required", i: Lock, c: "#10b981" },
              { l: "SSO Enabled", i: ShieldCheck, c: "var(--neon-blue)" },
              { l: "IP Restricted", i: Unlock, c: "#f59e0b" },
              { l: "Audit Logged", i: Eye, c: "var(--neon-purple)" },
            ].map((b) => (
              <Badge key={b.l} variant="outline" className="gap-1 border-white/15" style={{ color: b.c }}>
                <b.i className="h-3 w-3" /> {b.l}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BulkImport() {
  const rows = [
    { n: "students-hsc-2025-batch.csv", s: "1.2 MB · 4,820 rows", ok: true, p: 100, dup: 12 },
    { n: "instructors-onboard.xlsx", s: "320 KB · 48 rows", ok: true, p: 100, dup: 0 },
    { n: "trial-users-malformed.csv", s: "—", ok: false, p: 38, dup: 0 },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Bulk User Import</p>
          <p className="font-display text-lg font-bold">CSV & Excel onboarding</p>
        </div>
        <Button className="bg-cta-gradient text-white shadow-glow">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Import
        </Button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-background/30 p-8 text-center">
          <CloudUpload className="mb-3 h-10 w-10 text-[var(--neon-blue)]" />
          <p className="text-sm font-medium">Drop CSV or Excel files</p>
          <p className="text-xs text-muted-foreground">Supports .csv · .xlsx · up to 50K rows</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="border-white/15">
              <FileSpreadsheet className="mr-2 h-3.5 w-3.5" /> Browse
            </Button>
            <Button size="sm" variant="outline" className="border-white/15">
              <Download className="mr-2 h-3.5 w-3.5" /> Template
            </Button>
          </div>
        </div>
        <div className="space-y-2.5">
          {rows.map((f) => (
            <div key={f.n} className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {f.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
                  <div>
                    <p className="text-xs font-medium">{f.n}</p>
                    <p className="text-[10px] text-muted-foreground">{f.s}{f.dup ? ` · ${f.dup} duplicates` : ""}</p>
                  </div>
                </div>
                <Badge variant="outline" className={f.ok ? "border-emerald-400/40 text-emerald-400" : "border-rose-400/40 text-rose-400"}>
                  {f.ok ? (f.dup ? "Review" : "Valid") : "Error"}
                </Badge>
              </div>
              <Progress value={f.p} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnalyticsWidget() {
  const bars = [52, 64, 78, 60, 88, 95, 82];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Daily Active Users</p>
        <BarChart3 className="h-4 w-4 text-[var(--neon-purple)]" />
      </div>
      <p className="mt-1 font-display text-2xl font-bold">
        42.1K <span className="text-xs font-normal text-emerald-400">▲ 9.8%</span>
      </p>
      <div className="mt-3 flex h-24 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/80 transition-all hover:from-[var(--neon-purple)]/60 hover:to-[var(--neon-blue)]" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">User growth trend</p>
        <Spark data={[2, 4, 5, 8, 10, 12, 15, 18, 22]} color="var(--neon-purple)" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-background/40 p-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg session</p>
          <p className="font-display text-sm font-bold">24m 18s</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-background/40 p-2 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Retention</p>
          <p className="font-display text-sm font-bold">82%</p>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { i: UserPlus, c: "var(--neon-purple)", t: "New registration", s: "Maliha Tabassum · HSC · 2m" },
    { i: CreditCard, c: "#f59e0b", t: "Subscription upgrade", s: "Sajid Hossain → Premium · 14m" },
    { i: LogIn, c: "var(--neon-blue)", t: "Login from new device", s: "Tahmid Hasan · iPhone · 28m" },
    { i: UserX, c: "#ef4444", t: "Account suspended", s: "Spam violation · 1h" },
    { i: ShieldCheck, c: "#10b981", t: "Admin promoted", s: "Imran Iqbal → Moderator · 2h" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Recent User Activity</p>
        <Activity className="h-4 w-4 text-[var(--neon-blue)]" />
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((a, i) => (
          <li key={i} className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-background/40 p-2.5">
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${a.c}22`, color: a.c, boxShadow: `0 0 12px ${a.c}33` }}>
              <a.i className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">{a.t}</p>
              <p className="truncate text-[10px] text-muted-foreground">{a.s}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Leaderboard() {
  const top = [
    { r: 1, n: "Tahmid Hasan", xp: 12480, acc: 92, streak: 48, badge: "Diamond", c: "#a78bfa" },
    { r: 2, n: "Nabila Ahmed", xp: 11820, acc: 88, streak: 41, badge: "Platinum", c: "var(--neon-blue)" },
    { r: 3, n: "Sajid Hossain", xp: 10940, acc: 86, streak: 38, badge: "Platinum", c: "var(--neon-purple)" },
    { r: 4, n: "Maliha Roy", xp: 9840, acc: 84, streak: 32, badge: "Gold", c: "#f59e0b" },
    { r: 5, n: "Arif Reza", xp: 9120, acc: 82, streak: 29, badge: "Gold", c: "#f59e0b" },
    { r: 6, n: "Sumaya Karim", xp: 8480, acc: 79, streak: 24, badge: "Silver", c: "#10b981" },
    { r: 7, n: "Imran Iqbal", xp: 7920, acc: 76, streak: 21, badge: "Silver", c: "#10b981" },
    { r: 8, n: "Rumana Akter", xp: 7340, acc: 74, streak: 18, badge: "Bronze", c: "#ef4444" },
  ];
  const rankTone = (r: number) =>
    r === 1 ? "border-amber-400/50 bg-amber-500/10 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.4)]"
    : r === 2 ? "border-slate-300/40 bg-slate-300/10 text-slate-300"
    : r === 3 ? "border-orange-400/40 bg-orange-500/10 text-orange-400"
    : "border-white/15 text-muted-foreground";
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Top Students</p>
          <p className="font-display text-lg font-bold">Leaderboard · last 30 days</p>
        </div>
        <Button variant="outline" size="sm" className="border-white/15">
          <Trophy className="mr-2 h-3.5 w-3.5" /> Full Ranking
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {top.map((s) => (
          <div key={s.r} className="group relative overflow-hidden rounded-xl border border-white/10 bg-background/40 p-3 transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: `${s.c}33` }} />
            <div className="relative flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-xs font-bold ${rankTone(s.r)}`}>
                #{s.r}
              </div>
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-glow"
                  style={{ background: `linear-gradient(135deg, ${s.c}, ${s.c}66)` }}>
                  {s.n.split(" ").map((p) => p[0]).join("")}
                </div>
                {s.r <= 3 && <Crown className="absolute -top-1.5 -right-1.5 h-4 w-4 text-amber-400 drop-shadow" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.n}</p>
                <p className="text-[10px] text-muted-foreground">{s.badge} tier</p>
              </div>
            </div>
            <div className="relative mt-3 grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">XP</p>
                <p className="font-mono text-xs font-bold">{(s.xp / 1000).toFixed(1)}K</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Acc</p>
                <p className="font-mono text-xs font-bold">{s.acc}%</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Streak</p>
                <p className="font-mono text-xs font-bold inline-flex items-center gap-0.5">
                  <Flame className="h-3 w-3 text-rose-400" />{s.streak}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UserManagementFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <StatGrid />
      <FilterPanel />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <UserTable />
          <ProfileDrawer />
          <RoleManager />
          <BulkImport />
        </div>
        <aside className="space-y-4">
          <AnalyticsWidget />
          <ActivityFeed />
        </aside>
      </div>
      <Leaderboard />
    </div>
  );
}
