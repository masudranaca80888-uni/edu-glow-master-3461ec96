import {
  Search, Bell, Sun, Moon, Plus, Upload, Download, Filter, ArrowUpDown,
  CheckCircle2, Eye, Activity, BarChart3, Edit3, Trash2, Copy,
  Send, Sparkles, CircleDot, Users, Megaphone, Calendar, Mail,
  Smartphone, MessageSquare, Image as ImageIcon, Link as LinkIcon,
  AlertTriangle, Clock, Pause, Play, Pin, Flame, Zap, Target,
  CheckCircle, XCircle, RotateCw, Smile, Bold, Italic, List,
  ChevronRight, MoreHorizontal, Layers, FileText, PlayCircle,
  GraduationCap, Wrench, Trophy as TrophyIcon, Inbox,
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
        <linearGradient id={`nm-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#nm-${id})`} />
    </svg>
  );
}

function Bars({ data, color = "var(--neon-blue)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox="0 0 100 40" className="h-12 w-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * 34;
        const w = 100 / data.length - 2;
        return (
          <rect
            key={i}
            x={i * (100 / data.length) + 1}
            y={40 - h}
            width={w}
            height={h}
            rx="1.2"
            fill={color}
            opacity={0.55 + (i / data.length) * 0.4}
          />
        );
      })}
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notifications, audiences, IDs…"
          className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Delivery · 99.7% live
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
          <div className="text-right leading-tight">
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

function PageHeader() {
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Sparkles className="mr-1 h-3 w-3" /> Comms Engine
            </Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">
              v3.2 · live
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Notification <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create, schedule and manage announcements, alerts and system notifications across every channel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
            <Plus className="mr-2 h-4 w-4" /> Create Notification
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Megaphone className="mr-2 h-4 w-4" /> Send Announcement
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </Button>
          <Button variant="outline" className="border-amber-400/30 text-amber-400 hover:bg-amber-500/10">
            <Zap className="mr-2 h-4 w-4" /> Push Alert
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Mail className="mr-2 h-4 w-4" /> Email Broadcast
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Download className="mr-2 h-4 w-4" /> Export Logs
          </Button>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { label: "Total Notifications", value: "48,712", delta: "+312", icon: Bell, color: "var(--neon-purple)", data: [3, 5, 7, 8, 11, 13, 16] },
  { label: "Delivered", value: "46,108", delta: "+98.4%", icon: CheckCircle, color: "var(--neon-blue)", data: [4, 6, 8, 10, 12, 15, 18] },
  { label: "Scheduled", value: "342", delta: "+24", icon: Calendar, color: "#a78bfa", data: [2, 4, 5, 7, 8, 10, 12] },
  { label: "Open Rate", value: "72.3%", delta: "+3.1%", icon: Eye, color: "#10b981", data: [5, 6, 8, 9, 11, 13, 15] },
  { label: "Push Success", value: "99.1%", delta: "+0.4%", icon: Smartphone, color: "#06b6d4", data: [9, 9, 10, 11, 11, 12, 13] },
  { label: "Active Alerts", value: "18", delta: "live", icon: Flame, color: "#ef4444", data: [2, 3, 4, 5, 6, 7, 9] },
];

function StatGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div key={s.label} className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition-opacity group-hover:opacity-80" style={{ background: `${s.color}33` }} />
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/40" style={{ boxShadow: `0 0 16px ${s.color}55` }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">{s.delta}</Badge>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="font-display text-2xl font-bold tracking-tight">{s.value}</p>
          <Spark data={s.data} color={s.color} />
        </div>
      ))}
    </section>
  );
}

function FilterBar() {
  const chips = ["Type", "Audience", "Delivery Status", "Priority"];
  return (
    <section className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search notifications…" className="h-9 rounded-xl border-white/10 bg-background/60 pl-9" />
      </div>
      {chips.map((c) => (
        <Button key={c} variant="outline" size="sm" className="h-9 rounded-xl border-white/15 backdrop-blur">
          <Filter className="mr-2 h-3.5 w-3.5" /> {c}
          <ChevronRight className="ml-1 h-3 w-3 rotate-90 opacity-60" />
        </Button>
      ))}
      <Button variant="outline" size="sm" className="h-9 rounded-xl border-white/15 backdrop-blur">
        <ArrowUpDown className="mr-2 h-3.5 w-3.5" /> Latest / Most Opened
      </Button>
    </section>
  );
}

type Row = {
  id: string;
  title: string;
  type: "Push" | "Email" | "In-App" | "Announcement";
  audience: string;
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Delivered" | "Scheduled" | "Failed" | "Sending" | "Paused";
  open: number;
  scheduled: string;
  sent: string;
};

const rows: Row[] = [
  { id: "NTF-2841", title: "JEE Main Mock Test 12 is live", type: "Push", audience: "All Students", priority: "High", status: "Delivered", open: 78, scheduled: "—", sent: "May 20 · 09:12" },
  { id: "NTF-2840", title: "Maintenance window tonight 02:00 IST", type: "Announcement", audience: "All Users", priority: "Critical", status: "Scheduled", open: 0, scheduled: "May 20 · 22:00", sent: "—" },
  { id: "NTF-2839", title: "New Physics flashcards added", type: "In-App", audience: "Selected Subjects", priority: "Medium", status: "Delivered", open: 64, scheduled: "—", sent: "May 19 · 18:40" },
  { id: "NTF-2838", title: "Premium 30% off — last 24h", type: "Email", audience: "Free Users", priority: "High", status: "Sending", open: 42, scheduled: "—", sent: "May 19 · 16:00" },
  { id: "NTF-2837", title: "Result published · NEET PYQ Set 8", type: "Push", audience: "NEET 2026", priority: "Medium", status: "Delivered", open: 81, scheduled: "—", sent: "May 19 · 11:25" },
  { id: "NTF-2836", title: "Video class — Organic Chemistry Pt. 4", type: "In-App", audience: "Class 12", priority: "Low", status: "Delivered", open: 56, scheduled: "—", sent: "May 18 · 20:10" },
  { id: "NTF-2835", title: "Server outage retry batch", type: "Push", audience: "Premium Users", priority: "High", status: "Failed", open: 0, scheduled: "—", sent: "May 18 · 14:02" },
  { id: "NTF-2834", title: "Weekly leaderboard reset", type: "Announcement", audience: "All Students", priority: "Low", status: "Paused", open: 12, scheduled: "May 21 · 00:00", sent: "—" },
];

const tone = {
  Delivered: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Scheduled: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  Failed: "border-red-500/30 bg-red-500/10 text-red-400",
  Sending: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Paused: "border-zinc-400/30 bg-zinc-400/10 text-zinc-400",
};

const ptone = {
  Critical: "border-red-500/40 bg-red-500/15 text-red-400",
  High: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300",
  Medium: "border-sky-400/30 bg-sky-500/10 text-sky-300",
  Low: "border-white/15 text-muted-foreground",
};

const typeIcon = {
  Push: Smartphone, Email: Mail, "In-App": MessageSquare, Announcement: Megaphone,
};

function NotificationTable() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-[var(--neon-purple)]" />
          <h2 className="font-display text-lg font-semibold">All Notifications</h2>
          <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">8 of 48,712</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/15"><RotateCw className="mr-1.5 h-3.5 w-3.5" />Refresh</Button>
          <Button size="sm" className="bg-cta-gradient h-8 text-white shadow-glow"><Plus className="mr-1.5 h-3.5 w-3.5" />New</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Audience</TableHead>
              <TableHead className="text-xs">Priority</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Open Rate</TableHead>
              <TableHead className="text-xs">Scheduled</TableHead>
              <TableHead className="text-xs">Sent</TableHead>
              <TableHead className="text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const TI = typeIcon[r.type];
              return (
                <TableRow key={r.id} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="max-w-[260px]">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1 border-white/15">
                      <TI className="h-3 w-3" /> {r.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.audience}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${ptone[r.priority]}`}>{r.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`gap-1 text-[10px] ${tone[r.status]}`}>
                      <CircleDot className="h-2.5 w-2.5" /> {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Progress value={r.open} className="h-1.5" />
                      <span className="w-9 text-right text-[11px] tabular-nums text-muted-foreground">{r.open}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.scheduled}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.sent}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Send className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><Pause className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
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

const audiences = [
  { label: "All Students", count: "162,480", icon: Users, active: true },
  { label: "Selected Levels", count: "48 levels", icon: Layers },
  { label: "Selected Subjects", count: "24 subjects", icon: GraduationCap },
  { label: "Individual Users", count: "0 picked", icon: Target },
  { label: "Premium Users", count: "28,940", icon: TrophyIcon },
  { label: "Admin Only", count: "42", icon: AlertTriangle },
];

function Step({ n, title, active }: { n: number; title: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${active ? "bg-cta-gradient border-transparent text-white shadow-glow" : "border-white/15 bg-background/40 text-muted-foreground"}`}>{n}</div>
      <span className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{title}</span>
    </div>
  );
}

function NotificationCreator() {
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-20 top-0 h-60 w-60 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Notification Builder</h2>
          <p className="text-xs text-muted-foreground">Multi-step composer · audience → content → delivery → preview</p>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <Step n={1} title="Audience" active />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Step n={2} title="Content" active />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Step n={3} title="Delivery" />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Step n={4} title="Preview" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        {/* Step 1 */}
        <div className="lg:col-span-4 space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Step 1 · Audience</p>
          <div className="space-y-2">
            {audiences.map((a) => (
              <button key={a.label} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-all ${a.active ? "border-[var(--neon-purple)]/50 bg-[var(--neon-purple)]/10 shadow-glow" : "border-white/10 bg-background/40 hover:border-white/20"}`}>
                <span className="flex items-center gap-2">
                  <a.icon className="h-4 w-4 text-[var(--neon-purple)]" />
                  {a.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{a.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="lg:col-span-5 space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Step 2 · Content</p>
          <Input placeholder="Notification title…" defaultValue="JEE Main Mock Test 12 is now live 🚀" className="h-10 rounded-xl border-white/10 bg-background/60" />
          <div className="rounded-xl border border-white/10 bg-background/60">
            <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
              <Button size="icon" variant="ghost" className="h-7 w-7"><Bold className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Italic className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><List className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><LinkIcon className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Smile className="h-3.5 w-3.5" /></Button>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-7 text-[11px]"><ImageIcon className="mr-1 h-3.5 w-3.5" />Banner</Button>
              </div>
            </div>
            <textarea
              rows={5}
              defaultValue="Hey topper 👋  Mock Test 12 is live with 90 questions across PCM. Take it within 24h to qualify for bonus XP and leaderboard ranking."
              className="w-full resize-none rounded-b-xl bg-transparent px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="CTA label" defaultValue="Attempt now" className="h-9 rounded-xl border-white/10 bg-background/60" />
            <Input placeholder="CTA URL" defaultValue="/mock/jee-12" className="h-9 rounded-xl border-white/10 bg-background/60" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Priority</span>
            {(["Low", "Medium", "High", "Critical"] as const).map((p) => (
              <Badge key={p} variant="outline" className={`cursor-pointer text-[10px] ${p === "High" ? ptone.High : "border-white/15 text-muted-foreground"}`}>{p}</Badge>
            ))}
          </div>
        </div>

        {/* Step 3 */}
        <div className="lg:col-span-3 space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Step 3 · Delivery</p>
          {[
            { l: "Push notification", i: Smartphone, on: true },
            { l: "Email notification", i: Mail, on: true },
            { l: "In-app notification", i: MessageSquare, on: true },
            { l: "Schedule send", i: Calendar, on: false },
          ].map((d) => (
            <div key={d.l} className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 p-2.5">
              <span className="flex items-center gap-2 text-sm"><d.i className="h-4 w-4 text-[var(--neon-blue)]" />{d.l}</span>
              <Switch defaultChecked={d.on} />
            </div>
          ))}
          <div className="rounded-xl border border-white/10 bg-background/40 p-2.5">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Expiry</p>
            <Input type="datetime-local" defaultValue="2026-05-22T22:00" className="h-9 rounded-lg border-white/10 bg-background/60 text-xs" />
          </div>
        </div>
      </div>

      {/* Step 4 — Preview & Send */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-background/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Step 4 · Preview</p>
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-background/40 p-0.5 text-[11px]">
              <button className="rounded-md bg-cta-gradient px-2 py-1 text-white">Mobile</button>
              <button className="px-2 py-1 text-muted-foreground">Desktop</button>
              <button className="px-2 py-1 text-muted-foreground">Dark</button>
              <button className="px-2 py-1 text-muted-foreground">Light</button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Mobile preview */}
            <div className="relative mx-auto h-[360px] w-[200px] rounded-[2.2rem] border border-white/15 bg-gradient-to-b from-black/80 to-black/60 p-2 shadow-[0_0_30px_var(--neon-purple)]/30">
              <div className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/20" />
              <div className="mt-6 space-y-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="bg-cta-gradient flex h-6 w-6 items-center justify-center rounded-md shadow-glow"><Bell className="h-3 w-3 text-white" /></div>
                    <span className="text-[10px] font-semibold text-white">EduMaster Pro</span>
                    <span className="ml-auto text-[9px] text-white/60">now</span>
                  </div>
                  <p className="mt-1.5 text-[11px] font-semibold text-white">JEE Main Mock Test 12 is live 🚀</p>
                  <p className="mt-0.5 text-[10px] text-white/70">90 Qs · PCM · 24h bonus XP window</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-[10px] text-white/40">
                  Notification Center
                </div>
              </div>
            </div>
            {/* Desktop preview */}
            <div className="rounded-2xl border border-white/10 bg-background/60 p-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <div className="h-2 w-2 rounded-full bg-red-400/70" />
                <div className="h-2 w-2 rounded-full bg-amber-400/70" />
                <div className="h-2 w-2 rounded-full bg-emerald-400/70" />
                <span className="ml-2 text-[10px] text-muted-foreground">app.edumasterpro.com</span>
              </div>
              <div className="mt-3 rounded-xl border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/5 p-3 shadow-glow">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-[var(--neon-purple)]" />
                  <p className="text-sm font-semibold">JEE Main Mock Test 12 is live</p>
                  <Badge variant="outline" className={`ml-auto text-[10px] ${ptone.High}`}>High</Badge>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">90 questions across PCM · 24h bonus XP window for early submissions.</p>
                <Button size="sm" className="bg-cta-gradient mt-2 h-7 text-[11px] text-white shadow-glow">Attempt now</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-white/10 bg-background/30 p-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Summary</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Audience</span><span>All Students · 162,480</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Channels</span><span>Push · Email · In-App</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><span className="text-fuchsia-300">High</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estimated reach</span><span>158.2K</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cost (push)</span><span>$1.42</span></div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="h-9 rounded-xl border-white/15 text-[11px]">Save Draft</Button>
            <Button size="sm" variant="outline" className="h-9 rounded-xl border-sky-400/30 text-sky-300 text-[11px]"><Calendar className="mr-1 h-3 w-3" />Schedule</Button>
            <Button size="sm" className="bg-cta-gradient h-9 rounded-xl text-white shadow-glow text-[11px]"><Send className="mr-1 h-3 w-3" />Send Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsWidget() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[var(--neon-blue)]" />
          <h3 className="font-display text-sm font-semibold">Delivery Analytics</h3>
        </div>
        <Badge variant="outline" className="border-white/15 text-[10px]">7 days</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Open</p><p className="font-display text-base font-bold text-emerald-400">72.3%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Click</p><p className="font-display text-base font-bold text-sky-400">38.1%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Delivery</p><p className="font-display text-base font-bold text-fuchsia-400">99.1%</p>
        </div>
      </div>
      <div className="mt-3">
        <Bars data={[4, 6, 9, 7, 11, 13, 16]} color="var(--neon-blue)" />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Most engaged · <span className="text-foreground">Class 12 · NEET 2026</span></p>
    </div>
  );
}

const activity = [
  { t: "Sent 'JEE Mock 12' to 162.4K", time: "2m ago", i: Send, c: "text-emerald-400" },
  { t: "Failed batch retry · 248 devices", time: "9m ago", i: XCircle, c: "text-red-400" },
  { t: "Scheduled 'Maintenance notice' · 22:00", time: "18m ago", i: Calendar, c: "text-sky-400" },
  { t: "Admin Asha duplicated NTF-2839", time: "31m ago", i: Copy, c: "text-fuchsia-400" },
  { t: "Push delivered · 99.1% success", time: "1h ago", i: CheckCircle2, c: "text-emerald-400" },
];

function ActivityFeed() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--neon-purple)]" />
        <h3 className="font-display text-sm font-semibold">Recent Activity</h3>
      </div>
      <ul className="mt-3 space-y-2.5">
        {activity.map((a, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <a.i className={`mt-0.5 h-3.5 w-3.5 ${a.c}`} />
            <div className="flex-1">
              <p className="text-foreground/90">{a.t}</p>
              <p className="text-[10px] text-muted-foreground">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const pinned = [
  { t: "Server maintenance · 22:00 IST", k: "Critical", i: Wrench, c: "border-red-500/40 bg-red-500/10 text-red-300" },
  { t: "JEE Main Mock 12 · live", k: "Active", i: TrophyIcon, c: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300" },
  { t: "NEET PYQ test · tomorrow 09:00", k: "Reminder", i: Calendar, c: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
];

function PinnedAlerts() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Pin className="h-4 w-4 text-amber-400" />
        <h3 className="font-display text-sm font-semibold">Pinned Alerts</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {pinned.map((p, i) => (
          <li key={i} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${p.c}`}>
            <p.i className="h-3.5 w-3.5" />
            <span className="flex-1 truncate text-foreground/90">{p.t}</span>
            <Badge variant="outline" className="border-white/20 text-[9px]">{p.k}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

const templates = [
  { t: "Mock Test Alert", d: "Notify students when a new mock test goes live.", i: TrophyIcon, c: "var(--neon-purple)", used: 184 },
  { t: "New Quiz Published", d: "Announce fresh quizzes per subject & level.", i: FileText, c: "var(--neon-blue)", used: 96 },
  { t: "Video Class Added", d: "Push new class drops with playlist deep link.", i: PlayCircle, c: "#ef4444", used: 132 },
  { t: "Maintenance Notice", d: "System maintenance windows & downtime notice.", i: Wrench, c: "#f59e0b", used: 24 },
  { t: "Exam Reminder", d: "Countdown reminders for upcoming exams.", i: Calendar, c: "#10b981", used: 71 },
  { t: "Result Published", d: "Alert students when results are out.", i: CheckCircle, c: "#06b6d4", used: 58 },
];

function TemplatesGrid() {
  return (
    <section className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Notification Templates</h2>
          <p className="text-xs text-muted-foreground">Pre-built blueprints · one-click reuse</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/15"><Plus className="mr-1.5 h-3.5 w-3.5" />New Template</Button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.t} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-glow">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl" style={{ background: `${t.c}33` }} />
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/60" style={{ boxShadow: `0 0 14px ${t.c}55` }}>
                <t.i className="h-4 w-4" style={{ color: t.c }} />
              </div>
              <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">{t.used} uses</Badge>
            </div>
            <h3 className="mt-3 font-display text-sm font-semibold">{t.t}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.d}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Last used · 2d ago</span>
              <Button size="sm" className="bg-cta-gradient h-7 text-[11px] text-white shadow-glow">Use template</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function NotificationManagerFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <StatGrid />
      <FilterBar />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <NotificationTable />
          <NotificationCreator />
        </div>
        <div className="space-y-4 xl:col-span-4">
          <AnalyticsWidget />
          <PinnedAlerts />
          <ActivityFeed />
        </div>
      </div>
      <TemplatesGrid />
    </div>
  );
}
