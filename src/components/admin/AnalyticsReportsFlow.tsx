import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Search, Bell, Sun, Moon, Download, Calendar, Sparkles, CircleDot,
  Users, GraduationCap, Target, Clock, FileDown, TrendingUp, Activity,
  Layers, FileText, PlayCircle, Database, Cpu, HardDrive,
  Zap, Wifi, Brain, Lightbulb, AlertTriangle, Trophy, Flame, Award,
  ChevronRight, Mail, FileSpreadsheet, FileType, RotateCw, ArrowUpRight,
  Eye, ListChecks, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { CountUp } from "@/components/realtime/CountUp";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { adminAnalyticsOverview } from "@/lib/admin-analytics.functions";

/* ---------- chart primitives ---------- */
function Spark({ data, color = "var(--neon-purple)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${30 - (v / max) * 26}`).join(" ");
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

function AreaChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  const toPath = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${100 - (v / max) * 90}`).join(" ");
  return (
    <>
      <svg viewBox="0 0 100 100" className="h-64 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ga-1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.3" />
        ))}
        <polygon points={`0,100 ${toPath} 100,100`} fill="url(#ga-1)" />
        <polyline points={toPath} fill="none" stroke="var(--neon-purple)" strokeWidth="0.8" />
      </svg>
      <div className="mt-2 grid text-[10px] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((m, i) => <span key={i} className="text-center">{m}</span>)}
      </div>
    </>
  );
}

function Donut({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = Math.max(slices.reduce((s, x) => s + x.value, 0), 1);
  let acc = 0;
  const r = 38;
  const C = 2 * Math.PI * r;
  const avg = Math.round(slices.reduce((s, x) => s + x.value, 0) / Math.max(slices.length, 1));
  return (
    <svg viewBox="0 0 100 100" className="h-56 w-full">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="14" />
      {slices.map((s, i) => {
        const dash = (s.value / total) * C;
        const off = -((acc / total) * C);
        acc += s.value;
        return (
          <circle key={i} cx="50" cy="50" r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={off}
            transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 4px ${s.color})` }} />
        );
      })}
      <text x="50" y="48" textAnchor="middle" className="fill-current font-display text-[10px] font-bold">{avg}%</text>
      <text x="50" y="58" textAnchor="middle" className="fill-current text-[5px] opacity-60">avg accuracy</text>
    </svg>
  );
}

function HeatBars({ days }: { days: { label: string; value: number }[] }) {
  const max = Math.max(...days.map((d) => d.value), 1);
  return (
    <div className="flex h-32 items-end gap-1.5">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="w-full rounded-t bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all"
               style={{ height: `${(d.value / max) * 100}%`, minHeight: 2, opacity: 0.4 + (d.value / max) * 0.6 }} />
          <span className="text-[9px] text-muted-foreground">{d.label.slice(0, 1)}</span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

const RANGES = [
  { l: "Last 7 days", days: 7 },
  { l: "Last 30 days", days: 30 },
  { l: "Last 90 days", days: 90 },
  { l: "Last 12 months", days: 365 },
];

export function AnalyticsReportsFlow() {
  const qc = useQueryClient();
  const overviewFn = useServerFn(adminAnalyticsOverview);
  const [rangeIdx, setRangeIdx] = useState(1);
  const [realtime, setRealtime] = useState(true);

  const range = useMemo(() => {
    const to = new Date();
    const from = new Date(to.getTime() - RANGES[rangeIdx].days * 24 * 60 * 60 * 1000);
    return { from: from.toISOString(), to: to.toISOString() };
  }, [rangeIdx]);

  const q = useQuery({
    queryKey: ["admin-analytics", rangeIdx],
    queryFn: () => overviewFn({ data: range }),
    refetchInterval: realtime ? 30_000 : false,
  });

  // realtime: invalidate on attempts/profiles change
  useEffect(() => {
    if (!realtime) return;
    const ch = supabase
      .channel("analytics-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "exam_attempts" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-analytics"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-analytics"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc, realtime]);

  const data = q.data;

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports, KPIs, students…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
            <CircleDot className="h-3 w-3 animate-pulse" /> {realtime ? "Live · streaming" : "Live paused"}
          </div>
          <Button size="icon" variant="ghost" className="rounded-xl">
            <Sun className="h-4 w-4 dark:hidden" /><Moon className="hidden h-4 w-4 dark:block" />
          </Button>
          <Button size="icon" variant="ghost" className="relative rounded-xl"><Bell className="h-4 w-4" /></Button>
        </div>
      </header>

      {/* Page Header */}
      <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow"><Sparkles className="mr-1 h-3 w-3" /> Insights Engine</Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Analytics &amp; <span className="text-gradient">Reports Center</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Track student performance, engagement and platform growth with realtime data.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button className="bg-cta-gradient text-white shadow-glow" onClick={() => qc.invalidateQueries({ queryKey: ["admin-analytics"] })}>
              <RotateCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" className="border-white/15" onClick={() => exportCsv(data)}>
              <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-background/40 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Real-time</span>
              <Switch checked={realtime} onCheckedChange={setRealtime} />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <Select value={String(rangeIdx)} onValueChange={(v) => setRangeIdx(Number(v))}>
          <SelectTrigger className="h-9 w-40"><Calendar className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {RANGES.map((r, i) => <SelectItem key={r.l} value={String(i)}>{r.l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-[10px]">
          {new Date(range.from).toLocaleDateString()} → {new Date(range.to).toLocaleDateString()}
        </Badge>
        {q.isFetching && <Badge variant="outline" className="gap-1 text-[10px]"><Loader2 className="h-3 w-3 animate-spin" /> updating</Badge>}
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { l: "Total Users", v: data?.kpis.totalUsers ?? 0, i: Users, c: "var(--neon-purple)" },
          { l: "Active Users", v: data?.kpis.activeUsers ?? 0, i: Activity, c: "var(--neon-blue)" },
          { l: "New Sign-ups", v: data?.kpis.newUsers ?? 0, i: TrendingUp, c: "#10b981" },
          { l: "Exams Taken", v: data?.kpis.attempts ?? 0, i: ListChecks, c: "#f59e0b" },
          { l: "Avg Accuracy", v: (data?.kpis.accuracy ?? 0) + "%", i: Target, c: "#06b6d4" },
          { l: "Avg Engagement", v: formatDuration(data?.kpis.avgEngagementSec ?? 0), i: Clock, c: "#a78bfa" },
        ].map((s) => (
          <div key={s.l} className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl" style={{ background: `${s.c}33` }} />
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/40" style={{ boxShadow: `0 0 16px ${s.c}55` }}>
                <s.i className="h-4 w-4" style={{ color: s.c }} />
              </div>
              <Badge variant="outline" className="gap-1 border-emerald-500/30 text-[10px] text-emerald-400">
                <ArrowUpRight className="h-3 w-3" /> live
              </Badge>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            <p className="font-display text-2xl font-bold tracking-tight">{typeof s.v === "number" ? s.v.toLocaleString() : s.v}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          {/* Growth */}
          <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">Student Growth</h2>
                <p className="text-xs text-muted-foreground">New registrations · last 12 months</p>
              </div>
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-[var(--neon-purple)]" /> Registrations
              </span>
            </div>
            <AreaChart
              data={(data?.growth ?? []).map((g) => g.registrations)}
              labels={(data?.growth ?? []).map((g) => g.label)}
            />
          </div>

          {/* Subject + Participation */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="glass shadow-card-soft rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">Subject Performance</h2>
                  <p className="text-xs text-muted-foreground">Avg accuracy from completed attempts</p>
                </div>
              </div>
              <div className="mt-3 grid items-center gap-4 sm:grid-cols-2">
                <Donut slices={(data?.subjectPerformance ?? []).map((s, i) => ({
                  label: s.name, value: Math.max(s.accuracy, 1), color: s.color ?? ["#a78bfa","#60a5fa","#34d399","#f59e0b","#06b6d4"][i % 5],
                }))} />
                <div className="space-y-2">
                  {(data?.subjectPerformance ?? []).slice(0, 6).map((s, i) => {
                    const color = s.color ?? ["#a78bfa","#60a5fa","#34d399","#f59e0b","#06b6d4"][i % 5];
                    return (
                      <div key={s.id} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                        <span className="flex-1 text-xs">{s.name}</span>
                        <div className="w-24"><Progress value={s.accuracy} className="h-1.5" /></div>
                        <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">{s.accuracy}%</span>
                      </div>
                    );
                  })}
                  {(!data || data.subjectPerformance.length === 0) && (
                    <p className="text-center text-xs text-muted-foreground">No subject data yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="glass shadow-card-soft rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">Exam Participation</h2>
                  <p className="text-xs text-muted-foreground">Attempts per day · last 14 days</p>
                </div>
                <Badge variant="outline" className="border-emerald-400/30 text-[10px] text-emerald-400">live</Badge>
              </div>
              <div className="mt-4"><HeatBars days={data?.participation ?? []} /></div>
            </div>
          </div>

          {/* Resources */}
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Resource Usage</h2>
              <Badge variant="outline" className="text-[10px]">all time</Badge>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { l: "PDF Note downloads", v: data?.resources.noteDownloads ?? 0, c: "var(--neon-purple)", i: FileText },
                { l: "Q-Bank downloads", v: data?.resources.qbDownloads ?? 0, c: "#ef4444", i: FileType },
                { l: "Video views", v: data?.resources.videoViews ?? 0, c: "var(--neon-blue)", i: PlayCircle },
                { l: "Flash card views", v: data?.resources.flashViews ?? 0, c: "#10b981", i: Layers },
                { l: "Note views", v: data?.resources.noteViews ?? 0, c: "#f59e0b", i: Eye },
              ].map((r) => (
                <div key={r.l} className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-background/60" style={{ boxShadow: `0 0 10px ${r.c}55` }}>
                      <r.i className="h-4 w-4" style={{ color: r.c }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                      <p className="font-display text-lg font-bold tracking-tight">{r.v.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live */}
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <h2 className="font-display text-lg font-bold">Live Performance · last 5 min</h2>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-400">streaming</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                { l: "Active learners", v: data?.live.users5m ?? 0, i: Users, c: "text-emerald-400" },
                { l: "Live attempts", v: data?.live.attempts5m ?? 0, i: Trophy, c: "text-fuchsia-400" },
                { l: "Content items", v: data?.kpis.contentItems ?? 0, i: Database, c: "text-sky-400" },
                { l: "Downloads", v: data?.kpis.downloads ?? 0, i: Download, c: "text-amber-400" },
              ].map((l) => (
                <div key={l.l} className="rounded-xl border border-white/10 bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <l.i className={`h-3.5 w-3.5 ${l.c}`} /> {l.l}
                  </div>
                  <p className="mt-1 font-display text-xl font-bold">{l.v.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Students */}
          <div className="glass shadow-card-soft rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Top Students</h2>
              <Badge variant="outline" className="text-[10px]">{RANGES[rangeIdx].l}</Badge>
            </div>
            <ul className="mt-3 space-y-2">
              {(data?.topStudents ?? []).map((s, i) => {
                const rank = i + 1;
                const rankColor = rank === 1 ? "from-amber-400 to-orange-500" : rank === 2 ? "from-slate-300 to-slate-500" : rank === 3 ? "from-amber-700 to-amber-900" : "from-white/10 to-white/5";
                return (
                  <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/30 p-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${rankColor} text-xs font-bold text-white`}>{rank}</div>
                    <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white">
                      {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground">{s.score} pts · {s.accuracy}% acc · {s.attempts} attempts · {s.level}</p>
                    </div>
                    <Award className="h-4 w-4 text-amber-400" />
                  </li>
                );
              })}
              {(!data || data.topStudents.length === 0) && (
                <li className="rounded-xl border border-white/10 bg-background/30 p-6 text-center text-xs text-muted-foreground">
                  No completed attempts in this range yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-4 xl:col-span-4">
          {/* System Health (static, infra) */}
          <div className="glass shadow-card-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-emerald-400" /><h3 className="font-display text-sm font-semibold">System Health</h3></div>
              <Badge variant="outline" className="border-emerald-500/30 text-[10px] text-emerald-400">99.99% up</Badge>
            </div>
            <ul className="mt-3 space-y-3">
              {[
                { l: "API Latency", i: Zap, c: "#10b981", v: 28, suffix: "ms", pct: 22 },
                { l: "DB Load", i: Database, c: "var(--neon-blue)", v: 58, suffix: "%", pct: 58 },
                { l: "Server CPU", i: Cpu, c: "var(--neon-purple)", v: 42, suffix: "%", pct: 42 },
                { l: "Storage", i: HardDrive, c: "#f59e0b", v: 71, suffix: "%", pct: 71 },
              ].map((h) => (
                <li key={h.l}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2"><h.i className="h-3.5 w-3.5" style={{ color: h.c }} /> {h.l}</span>
                    <span className="tabular-nums text-muted-foreground">{h.v}{h.suffix}</span>
                  </div>
                  <Progress value={h.pct} className="mt-1.5 h-1.5" />
                </li>
              ))}
            </ul>
          </div>

          {/* AI Insights (derived) */}
          <div className="glass shadow-card-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-[var(--neon-purple)]" /><h3 className="font-display text-sm font-semibold">Quick Insights</h3></div>
              <Badge className="bg-cta-gradient border-0 text-[10px] text-white">beta</Badge>
            </div>
            <ul className="mt-3 space-y-2">
              {buildInsights(data).map((ins, i) => (
                <li key={i} className="rounded-xl border border-white/10 bg-background/30 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold"><ins.icon className={`h-3.5 w-3.5 ${ins.tone}`} /> {ins.t}</div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{ins.d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Live counters */}
          <div className="glass shadow-card-soft rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <h3 className="font-display text-sm font-semibold">Now</h3>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between"><span>Online learners (5m)</span><span className="font-mono">{data?.live.users5m ?? 0}</span></div>
              <div className="flex justify-between"><span>Live attempts (5m)</span><span className="font-mono">{data?.live.attempts5m ?? 0}</span></div>
              <div className="flex justify-between"><span>Total active users</span><span className="font-mono">{data?.kpis.activeUsers ?? 0}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity table */}
      <section className="glass shadow-card-soft overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--neon-purple)]" />
            <h2 className="font-display text-lg font-semibold">Top Students Snapshot</h2>
          </div>
          <Button size="sm" variant="outline" className="h-8 rounded-lg border-white/15" onClick={() => exportCsv(data)}>
            <Download className="mr-1.5 h-3.5 w-3.5" />Download CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Level</TableHead>
                <TableHead className="text-xs">Attempts</TableHead>
                <TableHead className="text-xs">Accuracy</TableHead>
                <TableHead className="text-right text-xs">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.topStudents ?? []).map((s) => (
                <TableRow key={s.id} className="border-white/5">
                  <TableCell className="text-sm font-medium">{s.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">{s.level}</TableCell>
                  <TableCell className="text-xs">{s.attempts}</TableCell>
                  <TableCell className="text-xs">{s.accuracy}%</TableCell>
                  <TableCell className="text-right text-xs font-mono">{s.score}</TableCell>
                </TableRow>
              ))}
              {(!data || data.topStudents.length === 0) && (
                <TableRow><TableCell colSpan={5} className="text-center text-xs text-muted-foreground">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

type Overview = Awaited<ReturnType<typeof adminAnalyticsOverview>>;

function buildInsights(data: Overview | undefined) {
  if (!data) return [{ icon: Lightbulb, tone: "text-amber-400", t: "Loading…", d: "Insights will appear once data is loaded." }];
  const out: { icon: typeof Lightbulb; tone: string; t: string; d: string }[] = [];
  if (data.subjectPerformance.length) {
    const weakest = [...data.subjectPerformance].filter((s) => s.attempts > 0).sort((a, b) => a.accuracy - b.accuracy)[0];
    if (weakest) out.push({ icon: AlertTriangle, tone: "text-red-400", t: "Weakest subject", d: `${weakest.name} averages ${weakest.accuracy}% across ${weakest.attempts} attempts.` });
  }
  if (data.kpis.newUsers > 0) out.push({ icon: TrendingUp, tone: "text-emerald-400", t: "Growth", d: `${data.kpis.newUsers} new sign-ups in this range.` });
  if (data.kpis.attempts === 0) out.push({ icon: Clock, tone: "text-sky-400", t: "Quiet window", d: "No completed exam attempts in the selected range." });
  if (data.live.users5m > 0) out.push({ icon: Flame, tone: "text-orange-400", t: "Activity now", d: `${data.live.users5m} learners active in the last 5 minutes.` });
  if (!out.length) out.push({ icon: Lightbulb, tone: "text-amber-400", t: "All clear", d: "Metrics look healthy. Keep shipping content." });
  return out.slice(0, 4);
}

function exportCsv(data: Overview | undefined) {
  if (!data) return;
  const lines: string[] = [];
  lines.push("Metric,Value");
  lines.push(`Total Users,${data.kpis.totalUsers}`);
  lines.push(`Active Users,${data.kpis.activeUsers}`);
  lines.push(`New Sign-ups,${data.kpis.newUsers}`);
  lines.push(`Exam Attempts,${data.kpis.attempts}`);
  lines.push(`Avg Accuracy %,${data.kpis.accuracy}`);
  lines.push(`Avg Engagement seconds,${data.kpis.avgEngagementSec}`);
  lines.push(`Downloads,${data.kpis.downloads}`);
  lines.push("");
  lines.push("Subject,Accuracy %,Attempts");
  for (const s of data.subjectPerformance) lines.push(`${csv(s.name)},${s.accuracy},${s.attempts}`);
  lines.push("");
  lines.push("Top Student,Level,Attempts,Accuracy %,Score");
  for (const s of data.topStudents) lines.push(`${csv(s.name)},${csv(s.level)},${s.attempts},${s.accuracy},${s.score}`);
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csv(s: string) { return `"${(s ?? "").replace(/"/g, '""')}"`; }

// Ensure unused icon imports referenced for tree-shaking suppression
void GraduationCap; void ChevronRight; void FileSpreadsheet; void Mail;
