import { useMemo, useState } from "react";
import {
  Bell,
  Megaphone,
  Trophy,
  Timer,
  PlayCircle,
  Layers,
  FileText,
  AlertTriangle,
  Search,
  CheckCheck,
  Trash2,
  Filter,
  ArrowUpDown,
  Pin,
  Activity,
  Clock,
  Sparkles,
  ChevronRight,
  Download,
  LogIn,
  GraduationCap,
  CalendarClock,
} from "lucide-react";

type NType =
  | "Announcement"
  | "Mock Test"
  | "Quiz"
  | "Result"
  | "Class"
  | "Flash Card"
  | "Short Note"
  | "Reminder"
  | "System";

type Priority = "high" | "medium" | "low";

type Notif = {
  id: string;
  type: NType;
  title: string;
  message: string;
  time: string;
  priority: Priority;
  unread: boolean;
  pinned?: boolean;
};

const ICONS: Record<NType, typeof Bell> = {
  Announcement: Megaphone,
  "Mock Test": Trophy,
  Quiz: Timer,
  Result: Sparkles,
  Class: PlayCircle,
  "Flash Card": Layers,
  "Short Note": FileText,
  Reminder: CalendarClock,
  System: AlertTriangle,
};

const TYPE_TINT: Record<NType, string> = {
  Announcement: "from-fuchsia-500/30 to-purple-500/10 text-fuchsia-300",
  "Mock Test": "from-amber-400/30 to-orange-500/10 text-amber-300",
  Quiz: "from-sky-400/30 to-blue-500/10 text-sky-300",
  Result: "from-emerald-400/30 to-teal-500/10 text-emerald-300",
  Class: "from-violet-500/30 to-indigo-500/10 text-violet-300",
  "Flash Card": "from-pink-400/30 to-rose-500/10 text-pink-300",
  "Short Note": "from-cyan-400/30 to-sky-500/10 text-cyan-300",
  Reminder: "from-yellow-400/30 to-amber-500/10 text-yellow-300",
  System: "from-red-500/30 to-rose-500/10 text-red-300",
};

const SEED: Notif[] = [
  { id: "n1", type: "Announcement", title: "New Semester Schedule Released", message: "Spring 2026 schedule is now live. Check enrolled courses and updated exam dates.", time: "2m ago", priority: "high", unread: true, pinned: true },
  { id: "n2", type: "Mock Test", title: "JEE Mock Test #14 Published", message: "Full-length 3-hour mock with detailed solutions is now available.", time: "18m ago", priority: "high", unread: true },
  { id: "n3", type: "Result", title: "Physics Quiz Result Ready", message: "You scored 87% (rank #12 of 540). Review your weak topics now.", time: "1h ago", priority: "medium", unread: true },
  { id: "n4", type: "Class", title: "New Video Class: Thermodynamics", message: "Prof. R. Kapoor uploaded a 42-min masterclass on entropy.", time: "3h ago", priority: "medium", unread: false },
  { id: "n5", type: "Flash Card", title: "Organic Chemistry Deck Updated", message: "32 new cards added — reactions & mechanisms revamped.", time: "5h ago", priority: "low", unread: true },
  { id: "n6", type: "Short Note", title: "Calculus Quick Notes Uploaded", message: "Concise 14-page revision PDF available in Short Notes.", time: "Yesterday", priority: "low", unread: false },
  { id: "n7", type: "Reminder", title: "Mock Test Reminder · 8:00 PM", message: "Your scheduled NEET full-length test starts in 6 hours.", time: "Yesterday", priority: "high", unread: false, pinned: true },
  { id: "n8", type: "System", title: "Scheduled Maintenance · Sun 2 AM", message: "Platform will be briefly unavailable for performance upgrades.", time: "2d ago", priority: "low", unread: false },
];

const FILTERS = [
  "All Notifications",
  "Announcements",
  "Mock Tests",
  "Quiz Updates",
  "Results",
  "Classes",
  "System Alerts",
] as const;

const filterMap: Record<(typeof FILTERS)[number], NType[] | null> = {
  "All Notifications": null,
  Announcements: ["Announcement"],
  "Mock Tests": ["Mock Test"],
  "Quiz Updates": ["Quiz"],
  Results: ["Result"],
  Classes: ["Class"],
  "System Alerts": ["System", "Reminder"],
};

export function NotificationsFlow() {
  const [items, setItems] = useState<Notif[]>(SEED);
  const [tab, setTab] = useState<(typeof FILTERS)[number]>("All Notifications");
  const [q, setQ] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let arr = [...items];
    const tf = filterMap[tab];
    if (tf) arr = arr.filter((n) => tf.includes(n.type));
    if (onlyUnread) arr = arr.filter((n) => n.unread);
    if (q.trim()) {
      const k = q.toLowerCase();
      arr = arr.filter((n) => n.title.toLowerCase().includes(k) || n.message.toLowerCase().includes(k));
    }
    return arr;
  }, [items, tab, onlyUnread, q]);

  const unreadCount = items.filter((i) => i.unread).length;
  const todayCount = items.filter((i) => i.time.includes("ago") || i.time === "Just now").length;

  const toggleSel = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })));
  const deleteSel = () => {
    setItems((arr) => arr.filter((n) => !selected.has(n.id)));
    setSelected(new Set());
  };
  const open = (id: string) =>
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--neon-blue)]">
              Inbox · Live
            </div>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Notifications <span className="text-gradient">Center</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Stay updated with exams, announcements, results and learning activities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Stat label="Total" value={items.length} />
            <Stat label="Unread" value={unreadCount} accent />
            <Stat label="Today" value={todayCount} />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="glass shadow-card-soft rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = tab === f;
            return (
              <button
                key={f}
                onClick={() => setTab(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-cta-gradient text-white shadow-glow"
                    : "border border-border/60 bg-background/40 text-foreground/70 hover:text-foreground"
                }`}
              >
                {f}
              </button>
            );
          })}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search notifications…"
                className="h-9 w-56 rounded-xl border border-border/60 bg-background/40 pl-8 pr-3 text-xs outline-none focus:border-[var(--neon-blue)]/60"
              />
            </div>
            <button className="flex h-9 items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 px-3 text-xs text-foreground/80 hover:text-foreground">
              <ArrowUpDown className="h-3.5 w-3.5" /> Latest
            </button>
            <button
              onClick={() => setOnlyUnread((v) => !v)}
              className={`flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs transition-colors ${
                onlyUnread
                  ? "border border-[var(--neon-purple)]/60 bg-[var(--neon-purple)]/15 text-foreground"
                  : "border border-border/60 bg-background/40 text-foreground/80"
              }`}
            >
              <Filter className="h-3.5 w-3.5" /> Unread
            </button>
            <button
              onClick={markAll}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 px-3 text-xs text-foreground/80 hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all
            </button>
            <button
              onClick={deleteSel}
              disabled={selected.size === 0}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3 text-xs text-destructive disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.size})
            </button>
          </div>
        </div>
      </div>

      {/* Body grid */}
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        {/* Feed */}
        <div className="space-y-3">
          {filtered.map((n) => (
            <NotifCard
              key={n.id}
              n={n}
              checked={selected.has(n.id)}
              onCheck={() => toggleSel(n.id)}
              onOpen={() => open(n.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No notifications match these filters.
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4">
          <ActivitySummary total={items.length} unread={unreadCount} today={todayCount} />
          <Pinned items={items.filter((i) => i.pinned)} />
          <QuickActions />
        </aside>
      </div>

      {/* Bottom timeline */}
      <SystemTimeline />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`flex min-w-[78px] flex-col items-center rounded-2xl border px-3 py-2 ${
        accent
          ? "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10"
          : "border-border/60 bg-background/40"
      }`}
    >
      <span className={`font-display text-xl font-bold ${accent ? "text-gradient" : ""}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

function NotifCard({
  n,
  checked,
  onCheck,
  onOpen,
}: {
  n: Notif;
  checked: boolean;
  onCheck: () => void;
  onOpen: () => void;
}) {
  const Icon = ICONS[n.type];
  const pTint =
    n.priority === "high"
      ? "border-red-400/40 bg-red-500/10 text-red-300"
      : n.priority === "medium"
        ? "border-amber-400/40 bg-amber-500/10 text-amber-300"
        : "border-emerald-400/40 bg-emerald-500/10 text-emerald-300";
  return (
    <div
      className={`group glass shadow-card-soft relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow ${
        n.unread ? "border-[var(--neon-blue)]/40" : "border-border/60"
      }`}
    >
      {n.unread && (
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--neon-purple)] to-[var(--neon-blue)]" />
      )}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          className="mt-1 h-4 w-4 accent-[var(--neon-purple)]"
        />
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${TYPE_TINT[n.type]} ring-1 ring-white/10`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{n.title}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${pTint}`}>
              {n.priority}
            </span>
            <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
              {n.type}
            </span>
            {n.pinned && (
              <span className="flex items-center gap-1 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] text-fuchsia-300">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}
            {n.unread && (
              <span className="ml-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]" />
            )}
            <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" /> {n.time}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {n.message}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onOpen}
              className="bg-cta-gradient flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white shadow-glow"
            >
              Open <ChevronRight className="h-3 w-3" />
            </button>
            <button className="rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-[11px] text-foreground/80 hover:text-foreground">
              Snooze
            </button>
            <button className="rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-[11px] text-foreground/80 hover:text-foreground">
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySummary({ total, unread, today }: { total: number; unread: number; today: number }) {
  const bars = [38, 52, 30, 68, 44, 80, 56];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--neon-blue)]" />
        <h3 className="text-sm font-semibold">Activity Summary</h3>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Mini label="Total" value={total} />
        <Mini label="Unread" value={unread} />
        <Mini label="Today" value={today} />
      </div>
      <div className="mt-4">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Last 7 days
        </p>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-80"
                style={{ height: `${b}%` }}
              />
              <span className="text-[9px] text-muted-foreground">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 py-2">
      <div className="font-display text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Pinned({ items }: { items: Notif[] }) {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Pin className="h-4 w-4 text-fuchsia-400" />
        <h3 className="text-sm font-semibold">Pinned</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((p) => {
          const Icon = ICONS[p.type];
          return (
            <li
              key={p.id}
              className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-2.5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-fuchsia-500/15 text-fuchsia-300">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">{p.time}</p>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="text-center text-[11px] text-muted-foreground">Nothing pinned yet.</li>
        )}
      </ul>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { t: "Open Mock Test", i: Trophy },
    { t: "Resume Class", i: PlayCircle },
    { t: "Continue MCQ", i: GraduationCap },
    { t: "View Results", i: Sparkles },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <h3 className="text-sm font-semibold">Quick Actions</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.t}
            className="group flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--neon-blue)]/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/20 text-foreground">
              <a.i className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium">{a.t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SystemTimeline() {
  const events = [
    { i: LogIn, t: "Signed in from Chrome · Windows", time: "10:42 AM", tag: "Auth" },
    { i: Trophy, t: "Submitted JEE Mock Test #13 — 78%", time: "Yesterday · 9:12 PM", tag: "Exam" },
    { i: Download, t: "Downloaded Calculus Short Notes (PDF)", time: "Yesterday · 4:05 PM", tag: "Notes" },
    { i: PlayCircle, t: "Completed Class · Thermodynamics Part 2", time: "2 days ago", tag: "Class" },
    { i: GraduationCap, t: "Finished 30-question MCQ Set · Biology", time: "3 days ago", tag: "Practice" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[var(--neon-purple)]" />
          <h3 className="text-sm font-semibold">Recent System Activity</h3>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </div>
      <ol className="relative mt-4 space-y-3 border-l border-border/60 pl-5">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[26px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]" />
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/40">
                <e.i className="h-4 w-4 text-foreground/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{e.t}</p>
                <p className="text-[10px] text-muted-foreground">{e.time}</p>
              </div>
              <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                {e.tag}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
