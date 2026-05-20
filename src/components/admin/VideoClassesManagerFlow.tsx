import {
  Search, Bell, Sun, Moon, Plus, Upload, Youtube, ListVideo, Send, EyeOff,
  Download, Filter, ArrowUpDown, ChevronRight, BookOpen, CheckCircle2, Eye,
  Flame, Activity, BarChart3, Edit3, Trash2, Copy, Image as ImageIcon,
  Save, Rocket, CalendarPlus, Sparkles, CircleDot, Star, Play, Pause,
  PlayCircle, Video, Clock, Users, TrendingUp, GripVertical, Maximize2,
  Volume2, SkipForward, Link2, Layers, Film, Mic2,
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
        <linearGradient id={`vc-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#vc-${id})`} />
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search classes, instructors, playlists…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur" />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Streaming · 8 edges live
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
              <Sparkles className="mr-1 h-3 w-3" /> Streaming Studio
            </Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">v3.2 · live</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Video Classes <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Upload, organize and manage premium chapter-wise video lessons across every level and subject.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
            <Plus className="mr-2 h-4 w-4" /> Add Video Class
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <Youtube className="mr-2 h-4 w-4" /> Import YouTube
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <ListVideo className="mr-2 h-4 w-4" /> Bulk Playlist
          </Button>
          <Button variant="outline" className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/10">
            <Send className="mr-2 h-4 w-4" /> Publish
          </Button>
          <Button variant="outline" className="border-amber-400/30 text-amber-400 hover:bg-amber-500/10">
            <EyeOff className="mr-2 h-4 w-4" /> Hide
          </Button>
          <Button variant="outline" className="border-white/15">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { label: "Total Classes", value: "2,840", delta: "+96", icon: Video, color: "var(--neon-purple)", data: [3, 5, 7, 6, 10, 13, 16] },
  { label: "Published", value: "2,512", delta: "+72", icon: PlayCircle, color: "var(--neon-blue)", data: [2, 4, 6, 8, 9, 12, 14] },
  { label: "Hidden", value: "328", delta: "−8", icon: EyeOff, color: "#f59e0b", data: [7, 6, 8, 5, 4, 4, 5] },
  { label: "Watch Hours", value: "184K", delta: "+22.6%", icon: Clock, color: "#10b981", data: [4, 8, 9, 12, 15, 19, 23] },
  { label: "Top Subject", value: "Physics", delta: "62K hrs", icon: Flame, color: "#ef4444", data: [5, 8, 11, 13, 12, 16, 19] },
  { label: "Avg Completion", value: "78.4%", delta: "+4.2%", icon: TrendingUp, color: "#a78bfa", data: [3, 5, 8, 9, 10, 12, 14] },
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
  const chips = ["All Levels", "Class 9", "Class 10", "HSC", "Admission"];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search classes by title, instructor or ID…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
        </div>
        {["Level", "Subject", "Chapter", "Instructor", "Status"].map((l) => (
          <Button key={l} variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
            <Filter className="mr-2 h-3.5 w-3.5" /> {l}
            <ChevronRight className="ml-1 h-3 w-3 rotate-90 opacity-50" />
          </Button>
        ))}
        <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
          <ArrowUpDown className="mr-2 h-3.5 w-3.5" /> Most Watched
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {chips.map((c, i) => (
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

const rows = [
  { id: "VC-3081", title: "Newton's Laws — Full Conceptual Walkthrough", subject: "Physics", chapter: "Mechanics", inst: "Tahmid Hasan", dur: "48:12", views: "82.4K", comp: 86, status: "Published", date: "May 14" },
  { id: "VC-3082", title: "Organic Reactions Master Class — Part 3", subject: "Chemistry", chapter: "Organic", inst: "Nabila Ahmed", dur: "62:40", views: "54.1K", comp: 74, status: "Published", date: "May 12" },
  { id: "VC-3083", title: "Integration Tricks for Admission Math", subject: "Mathematics", chapter: "Calculus", inst: "Rafiq Khan", dur: "38:55", views: "39.2K", comp: 68, status: "Scheduled", date: "May 22" },
  { id: "VC-3084", title: "Genetics — Mendel to DNA in 40 Minutes", subject: "Biology", chapter: "Genetics", inst: "Sumaya Karim", dur: "41:08", views: "28.6K", comp: 81, status: "Draft", date: "May 10" },
  { id: "VC-3085", title: "Essay Writing — HSC Board Format", subject: "English", chapter: "Writing", inst: "Imran Iqbal", dur: "29:42", views: "17.9K", comp: 64, status: "Hidden", date: "May 08" },
  { id: "VC-3086", title: "ICT — Database Design Crash Course", subject: "ICT", chapter: "DBMS", inst: "Tanvir Alam", dur: "55:21", views: "44.7K", comp: 79, status: "Published", date: "May 06" },
];

function statusTone(s: string) {
  const m: Record<string, string> = {
    Published: "border-emerald-400/40 bg-emerald-500/10 text-emerald-400",
    Draft: "border-amber-400/40 bg-amber-500/10 text-amber-400",
    Scheduled: "border-sky-400/40 bg-sky-500/10 text-sky-400",
    Hidden: "border-rose-400/40 bg-rose-500/10 text-rose-400",
  };
  return m[s] ?? "border-white/20 text-muted-foreground";
}

function ClassTable() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <p className="font-display text-lg font-bold">Video Class Library</p>
          <p className="text-xs text-muted-foreground">{rows.length} of 2,840 classes · live edge CDN</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-white/15">
            <ListVideo className="mr-2 h-3.5 w-3.5" /> Playlists
          </Button>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow">
            <Plus className="mr-2 h-3.5 w-3.5" /> New Class
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              {["ID", "Class", "Subject", "Chapter", "Instructor", "Duration", "Views", "Completion", "Status", "Upload", ""].map((h, i) => (
                <TableHead key={i} className={`text-[11px] uppercase tracking-wider ${i >= 6 && i <= 7 ? "text-right" : ""} ${i === 10 ? "text-right" : ""}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{r.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-[var(--neon-purple)]/40 to-[var(--neon-blue)]/40 ring-1 ring-white/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-4 w-4 fill-white text-white drop-shadow" />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[9px] font-mono text-white">{r.dur}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground">HD · 1080p · CDN-cached</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{r.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.chapter}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--neon-blue)]/20 text-[10px] font-bold text-[var(--neon-blue)]">
                      {r.inst.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <span className="text-xs">{r.inst}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{r.dur}</TableCell>
                <TableCell className="text-right font-mono text-xs">{r.views}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress value={r.comp} className="h-1.5 w-16" />
                    <span className="w-8 font-mono text-[11px]">{r.comp}%</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className={statusTone(r.status)}>{r.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {[Edit3, Eye, Copy, Send, EyeOff, Trash2].map((I, i) => (
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

function ClassCreator() {
  const steps = ["Setup", "Video Import", "Player Preview", "Publish"];
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-2xl p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Class Creator</p>
          <p className="font-display text-xl font-bold">Build a new video lesson</p>
        </div>
        <Badge variant="outline" className="border-white/15">
          <Sparkles className="mr-1 h-3 w-3 text-[var(--neon-purple)]" /> AI metadata
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
              i <= 2 ? "bg-cta-gradient text-white shadow-glow" : "border border-white/15 text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-xs ${i <= 2 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* STEP 1 */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1 · Setup</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { l: "Level", v: "HSC · 2nd Year" },
              { l: "Subject", v: "Physics" },
              { l: "Chapter", v: "Mechanics" },
              { l: "Instructor", v: "Tahmid Hasan" },
              { l: "Category", v: "Conceptual Lecture" },
              { l: "Language", v: "Bangla · EN sub" },
            ].map((f) => (
              <div key={f.l} className="rounded-lg border border-white/10 bg-background/40 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.l}</p>
                <p className="mt-1 truncate font-medium">{f.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 2 */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2 · Video Import</p>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue="https://youtube.com/watch?v=neWtonLAW01" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="border-white/15"><Youtube className="mr-2 h-3.5 w-3.5" /> Single</Button>
            <Button size="sm" variant="outline" className="border-white/15"><ListVideo className="mr-2 h-3.5 w-3.5" /> Playlist</Button>
            <Button size="sm" variant="outline" className="border-white/15"><ImageIcon className="mr-2 h-3.5 w-3.5" /> Thumbnail</Button>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/5 p-2.5 text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-muted-foreground">Auto-detected · <span className="font-mono text-foreground">48:12</span> · 1080p · captions found</span>
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-background/40 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Description</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              A complete walkthrough of Newton's three laws with worked HSC board examples and intuitive diagrams.
            </p>
          </div>
        </div>

        {/* STEP 3 — Player Preview */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 3 · Cinematic Preview</p>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7"><Maximize2 className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Sun className="h-3.5 w-3.5 dark:hidden" /><Moon className="hidden h-3.5 w-3.5 dark:block" /></Button>
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-black via-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 shadow-glow">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="group flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/30 transition-all hover:scale-110 hover:bg-white/20">
                  <Play className="h-7 w-7 fill-white text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 space-y-2 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-white/80">12:48</span>
                  <div className="relative h-1 flex-1 rounded-full bg-white/15">
                    <div className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
                    <div className="absolute left-1/4 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
                  </div>
                  <span className="font-mono text-[10px] text-white/80">48:12</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Pause className="h-4 w-4" /><SkipForward className="h-4 w-4" /><Volume2 className="h-4 w-4" />
                  <span className="ml-2 text-[11px] font-medium">Newton's Laws — Walkthrough</span>
                  <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px]">1080p</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-background/40 p-2">
              <p className="px-1 text-[10px] uppercase tracking-wider text-muted-foreground">Up next · Mechanics</p>
              {[
                { t: "1.1 Frames of Reference", d: "08:14", a: true },
                { t: "1.2 Newton's First Law", d: "12:48", a: false },
                { t: "1.3 Newton's Second Law", d: "14:22", a: false },
                { t: "1.4 Newton's Third Law", d: "12:48", a: false },
              ].map((v, i) => (
                <div key={i} className={`flex items-center gap-2 rounded-lg p-1.5 ${v.a ? "bg-cta-gradient text-white shadow-glow" : "hover:bg-white/5"}`}>
                  <div className="relative h-8 w-12 shrink-0 overflow-hidden rounded bg-gradient-to-br from-[var(--neon-purple)]/40 to-[var(--neon-blue)]/40">
                    <Play className="absolute inset-0 m-auto h-3 w-3 fill-white text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[11px] font-medium ${v.a ? "text-white" : ""}`}>{v.t}</p>
                    <p className={`font-mono text-[10px] ${v.a ? "text-white/80" : "text-muted-foreground"}`}>{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4 lg:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 4 · Publish</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { l: "Hide from Students", d: "Keep private until reviewed" },
              { l: "Featured Class", d: "Pin to homepage hero rail" },
              { l: "Allow Downloads", d: "Offline playback for Pro tier" },
            ].map((t, i) => (
              <div key={t.l} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 p-2.5">
                <div>
                  <p className="text-xs font-medium">{t.l}</p>
                  <p className="text-[10px] text-muted-foreground">{t.d}</p>
                </div>
                <Switch defaultChecked={i !== 0} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" className="border-white/15"><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
            <Button variant="outline" className="border-white/15"><CalendarPlus className="mr-2 h-4 w-4" /> Schedule</Button>
            <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
              <Rocket className="mr-2 h-4 w-4" /> Publish Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaylistManager() {
  const lessons = [
    { n: 1, t: "Frames of Reference", d: "08:14" },
    { n: 2, t: "Newton's First Law", d: "12:48" },
    { n: 3, t: "Newton's Second Law", d: "14:22" },
    { n: 4, t: "Newton's Third Law", d: "12:48" },
    { n: 5, t: "Friction & Inclined Planes", d: "18:02" },
    { n: 6, t: "Worked Board Problems", d: "22:36" },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Playlist Manager</p>
          <p className="font-display text-lg font-bold">Mechanics · 6 lessons · 1h 28m</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-white/15"><Plus className="mr-2 h-3.5 w-3.5" /> Add Lesson</Button>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow"><Save className="mr-2 h-3.5 w-3.5" /> Save Order</Button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {lessons.map((l) => (
          <div key={l.n} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-background/40 p-2.5 transition-all hover:border-[var(--neon-purple)]/40 hover:bg-white/[0.04]">
            <GripVertical className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-[var(--neon-purple)]" />
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-gradient font-mono text-[11px] font-bold text-white shadow-glow">
              {String(l.n).padStart(2, "0")}
            </div>
            <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-[var(--neon-purple)]/40 to-[var(--neon-blue)]/40 ring-1 ring-white/10">
              <Play className="absolute inset-0 m-auto h-3.5 w-3.5 fill-white text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{l.t}</p>
              <p className="text-[11px] text-muted-foreground">Chapter · Mechanics · HD</p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">{l.d}</span>
            <Button size="icon" variant="ghost" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7"><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnalyticsWidget() {
  const bars = [48, 62, 78, 54, 92, 88, 74];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Daily Watch Hours</p>
        <BarChart3 className="h-4 w-4 text-[var(--neon-purple)]" />
      </div>
      <p className="mt-1 font-display text-2xl font-bold">
        12.8K <span className="text-xs font-normal text-emerald-400">▲ 14.2%</span>
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
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Most Watched</p>
        {[
          { t: "Newton's Laws Walkthrough", v: "82.4K" },
          { t: "Organic Reactions P3", v: "54.1K" },
          { t: "ICT — Database Crash", v: "44.7K" },
        ].map((r) => (
          <div key={r.t} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 px-2.5 py-1.5">
            <span className="truncate text-xs">{r.t}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Student engagement</p>
        <div className="mt-1 flex items-center gap-2">
          <Progress value={82} className="h-1.5 flex-1" />
          <span className="font-mono text-xs">82%</span>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { i: Upload, c: "var(--neon-purple)", t: "New video uploaded", s: "Physics · Newton's Laws · 2m" },
    { i: Edit3, c: "var(--neon-blue)", t: "Class edited", s: "Chemistry · Organic P3 · 14m" },
    { i: Send, c: "#10b981", t: "Playlist published", s: "Math · Calculus Drill · 28m" },
    { i: Eye, c: "#f59e0b", t: "Watch surge", s: "Biology · Genetics · +1.4K views · 1h" },
    { i: EyeOff, c: "#ef4444", t: "Class hidden", s: "English · Essay Writing · 2h" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Recent Activity</p>
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

function TopInstructors() {
  const list = [
    { n: "Tahmid Hasan", s: "Physics", v: "182K", c: "var(--neon-purple)" },
    { n: "Nabila Ahmed", s: "Chemistry", v: "148K", c: "var(--neon-blue)" },
    { n: "Rafiq Khan", s: "Math", v: "121K", c: "#10b981" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Top Instructors</p>
        <Mic2 className="h-4 w-4 text-[var(--neon-purple)]" />
      </div>
      <ul className="mt-3 space-y-2">
        {list.map((i) => (
          <li key={i.n} className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/40 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: `${i.c}22`, color: i.c, boxShadow: `0 0 10px ${i.c}33` }}>
              {i.n.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{i.n}</p>
              <p className="text-[10px] text-muted-foreground">{i.s}</p>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">{i.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PopularCollections() {
  const cols = [
    { t: "HSC Physics — Mechanics Masterclass", q: 24, h: "12.4K", comp: 86, sub: "Physics", c: "var(--neon-purple)" },
    { t: "Organic Chemistry Deep Dive", q: 18, h: "9.2K", comp: 78, sub: "Chemistry", c: "var(--neon-blue)" },
    { t: "Admission Math Drill", q: 32, h: "8.6K", comp: 71, sub: "Mathematics", c: "#10b981" },
    { t: "Biology — Genetics Visual Atlas", q: 14, h: "6.8K", comp: 83, sub: "Biology", c: "#ef4444" },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Popular collections</p>
          <p className="font-display text-lg font-bold">Top performing playlists</p>
        </div>
        <Button variant="outline" size="sm" className="border-white/15">
          <BookOpen className="mr-2 h-3.5 w-3.5" /> Browse All
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div key={c.t} className="group relative overflow-hidden rounded-xl border border-white/10 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: `${c.c}33` }} />
            <div className="relative flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${c.c}22`, color: c.c, boxShadow: `0 0 14px ${c.c}33` }}>
                <Film className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="border-white/15 text-[10px]">{c.sub}</Badge>
            </div>
            <p className="relative mt-3 line-clamp-2 text-sm font-semibold">{c.t}</p>
            <div className="relative mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Vids</p>
                <p className="font-mono text-xs font-bold">{c.q}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Hrs</p>
                <p className="font-mono text-xs font-bold">{c.h}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Cmp</p>
                <p className="font-mono text-xs font-bold">{c.comp}%</p>
              </div>
            </div>
            <div className="relative mt-3">
              <Progress value={c.comp} className="h-1.5" />
            </div>
            <div className="relative mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 3.1K learners</span>
              <span className="inline-flex items-center gap-1 text-emerald-400"><TrendingUp className="h-3 w-3" /> +9%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function VideoClassesManagerFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <StatGrid />
      <FilterPanel />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <ClassTable />
          <ClassCreator />
          <PlaylistManager />
        </div>
        <aside className="space-y-4">
          <AnalyticsWidget />
          <ActivityFeed />
          <TopInstructors />
        </aside>
      </div>
      <PopularCollections />
    </div>
  );
}
