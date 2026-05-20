import {
  Search, Bell, Sun, Moon, Upload, FileText, FileType, CloudUpload,
  Send, EyeOff, Download, Filter, ArrowUpDown, ChevronRight, BookOpen,
  CheckCircle2, Eye, Flame, Activity, BarChart3, Edit3, Trash2, Copy,
  Image as ImageIcon, Save, Rocket, CalendarPlus, Sparkles, CircleDot,
  Star, ZoomIn, FileSearch, Database, FilePlus2, Folder, Archive,
  AlertTriangle, FileCheck2, Hash, TrendingUp, Users, Layers,
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
        <linearGradient id={`qb-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#qb-${id})`} />
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources, PDFs, papers…"
          className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Library online · 99.99%
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
              <Sparkles className="mr-1 h-3 w-3" /> Resource Vault
            </Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">
              v3.2 · live
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Question Bank <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage important questions, previous year papers, PDFs and model test resources across every chapter and class.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
            <Upload className="mr-2 h-4 w-4" /> Upload Resource
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <FileText className="mr-2 h-4 w-4" /> Upload PDF
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <FileType className="mr-2 h-4 w-4" /> Upload DOC/Text
          </Button>
          <Button variant="outline" className="border-white/15 backdrop-blur">
            <CloudUpload className="mr-2 h-4 w-4" /> Bulk Import
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
  { label: "Total Resources", value: "4,182", delta: "+128", icon: Database, color: "var(--neon-purple)", data: [4, 8, 6, 10, 12, 14, 18] },
  { label: "Published", value: "3,720", delta: "+96", icon: FileCheck2, color: "var(--neon-blue)", data: [2, 5, 4, 8, 9, 12, 15] },
  { label: "Hidden", value: "462", delta: "−12", icon: EyeOff, color: "#f59e0b", data: [8, 7, 9, 6, 5, 4, 5] },
  { label: "Total Downloads", value: "284K", delta: "+18.4%", icon: Download, color: "#10b981", data: [5, 9, 8, 12, 15, 20, 24] },
  { label: "Top Subject", value: "Physics", delta: "92K dl", icon: Flame, color: "#ef4444", data: [6, 8, 10, 12, 11, 14, 17] },
  { label: "Engagement Rate", value: "87.4%", delta: "+3.1%", icon: TrendingUp, color: "#a78bfa", data: [3, 6, 7, 9, 10, 11, 13] },
];

function StatGrid() {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 20% 0%, ${s.color}22, transparent 60%)` }}
          />
          <div className="relative flex items-start justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${s.color}22`, color: s.color, boxShadow: `0 0 18px ${s.color}33` }}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <Badge variant="outline" className="border-white/10 text-[10px] text-muted-foreground">
              {s.delta}
            </Badge>
          </div>
          <p className="relative mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className="relative font-display text-2xl font-bold tracking-tight">{s.value}</p>
          <div className="relative mt-1">
            <Spark data={s.data} color={s.color} />
          </div>
        </div>
      ))}
    </section>
  );
}

const filterChips = ["All Levels", "Class 9", "Class 10", "HSC", "Admission"];
const resourceTypes = [
  { label: "Important Questions", icon: Star, color: "var(--neon-purple)" },
  { label: "Previous Year Qns", icon: Archive, color: "var(--neon-blue)" },
  { label: "Model Test Papers", icon: FileCheck2, color: "#10b981" },
  { label: "PDF Notes", icon: FileText, color: "#ef4444" },
  { label: "Text Documents", icon: FileType, color: "#f59e0b" },
];

function FilterPanel() {
  return (
    <section className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search resources by title, tag or ID…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
        </div>
        {["Level", "Subject", "Chapter", "Type", "Status"].map((l) => (
          <Button key={l} variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
            <Filter className="mr-2 h-3.5 w-3.5" /> {l}
            <ChevronRight className="ml-1 h-3 w-3 rotate-90 opacity-50" />
          </Button>
        ))}
        <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-background/40">
          <ArrowUpDown className="mr-2 h-3.5 w-3.5" /> Latest
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {filterChips.map((c, i) => (
          <button
            key={c}
            className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
              i === 0
                ? "border-transparent bg-cta-gradient text-white shadow-glow"
                : "border-white/15 text-foreground/80 hover:border-white/30 hover:bg-muted/40"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-white/10" />
        {resourceTypes.map((r) => (
          <button
            key={r.label}
            className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-background/40 px-3 py-1.5 text-xs transition-all hover:-translate-y-0.5"
            style={{ boxShadow: `inset 0 0 0 1px ${r.color}22` }}
          >
            <r.icon className="h-3 w-3" style={{ color: r.color }} />
            {r.label}
          </button>
        ))}
      </div>
    </section>
  );
}

const rows = [
  { id: "QB-2041", title: "HSC Physics — Mechanics Important Qns 2025", subject: "Physics", chapter: "Mechanics", type: "Important", fmt: "PDF", dl: 12480, vw: 38210, status: "Published", date: "May 14" },
  { id: "QB-2042", title: "SSC Chemistry — Last 10 Yrs Previous Papers", subject: "Chemistry", chapter: "All", type: "Previous Year", fmt: "PDF", dl: 9820, vw: 24190, status: "Published", date: "May 12" },
  { id: "QB-2043", title: "Admission Math — Model Test #18", subject: "Mathematics", chapter: "Calculus", type: "Model Test", fmt: "PDF", dl: 6240, vw: 14920, status: "Scheduled", date: "May 22" },
  { id: "QB-2044", title: "Biology — Genetics Short Notes & Diagrams", subject: "Biology", chapter: "Genetics", type: "PDF Notes", fmt: "PDF", dl: 4180, vw: 9210, status: "Draft", date: "May 10" },
  { id: "QB-2045", title: "English — Comprehension Drill Pack", subject: "English", chapter: "Reading", type: "Text Doc", fmt: "DOCX", dl: 2940, vw: 7120, status: "Hidden", date: "May 08" },
  { id: "QB-2046", title: "ICT — HSC Board Final Suggestions 2025", subject: "ICT", chapter: "All", type: "Important", fmt: "PDF", dl: 8140, vw: 19240, status: "Published", date: "May 06" },
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

function ResourceTable() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between gap-2 p-4">
        <div>
          <p className="font-display text-lg font-bold">Resource Library</p>
          <p className="text-xs text-muted-foreground">{rows.length} of 4,182 resources · live</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-white/15">
            <Folder className="mr-2 h-3.5 w-3.5" /> Collections
          </Button>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow">
            <FilePlus2 className="mr-2 h-3.5 w-3.5" /> New Resource
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[11px] uppercase tracking-wider">ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Title</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Subject</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Chapter</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Format</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider">Downloads</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider">Views</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">Upload</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                <TableCell className="font-mono text-[11px] text-muted-foreground">{r.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--neon-purple)]/15 text-[var(--neon-purple)]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        <Hash className="mr-0.5 inline h-3 w-3" />
                        {r.type.toLowerCase().replace(/\s+/g, "-")}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{r.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.chapter}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/15 text-[11px]">
                    {r.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="rounded-md border border-white/10 bg-background/40 px-2 py-0.5 font-mono text-[10px]">
                    {r.fmt}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{r.dl.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-xs">{r.vw.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusTone(r.status)}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {[
                      { i: Edit3, k: "edit" }, { i: Eye, k: "preview" },
                      { i: Copy, k: "duplicate" }, { i: Send, k: "publish" },
                      { i: EyeOff, k: "hide" }, { i: Trash2, k: "delete" },
                    ].map((a) => (
                      <Button key={a.k} size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-white/5">
                        <a.i className="h-3.5 w-3.5" />
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

function ResourceCreator() {
  const steps = ["Setup", "Content Upload", "Preview", "Publish"];
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-2xl p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Resource Creator</p>
          <p className="font-display text-xl font-bold">Build a new resource bundle</p>
        </div>
        <Badge variant="outline" className="border-white/15">
          <Sparkles className="mr-1 h-3 w-3 text-[var(--neon-purple)]" /> AI assisted
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
              i <= 1 ? "bg-cta-gradient text-white shadow-glow" : "border border-white/15 text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-xs ${i <= 1 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* STEP 1 - Setup */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1 · Setup</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { l: "Level", v: "HSC · 2nd Year" },
              { l: "Subject", v: "Physics" },
              { l: "Chapter", v: "Electromagnetism" },
              { l: "Resource Type", v: "Important Questions" },
            ].map((f) => (
              <div key={f.l} className="rounded-lg border border-white/10 bg-background/40 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.l}</p>
                <p className="mt-1 truncate font-medium">{f.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 2 - Content Upload */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2 · Content</p>
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-background/40 p-6 text-center">
            <CloudUpload className="mb-2 h-8 w-8 text-[var(--neon-purple)]" />
            <p className="text-sm font-medium">Drag & drop PDF / DOC / TXT</p>
            <p className="text-[11px] text-muted-foreground">or click to browse · max 50 MB</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="border-white/15">
                <FileText className="mr-2 h-3.5 w-3.5" /> PDF
              </Button>
              <Button size="sm" variant="outline" className="border-white/15">
                <FileType className="mr-2 h-3.5 w-3.5" /> DOC/Text
              </Button>
              <Button size="sm" variant="outline" className="border-white/15">
                <ImageIcon className="mr-2 h-3.5 w-3.5" /> Diagram
              </Button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground">physics-em-imp.pdf</span> · 4.2 MB · validated
            </span>
          </div>
        </div>

        {/* STEP 3 - Preview */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 3 · Preview</p>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7"><ZoomIn className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><FileSearch className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7"><Sun className="h-3.5 w-3.5 dark:hidden" /><Moon className="hidden h-3.5 w-3.5 dark:block" /></Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-background/80 to-background/40 p-4">
            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/10 bg-background/50 px-3 py-1.5 backdrop-blur">
              <span className="text-[10px] font-mono text-muted-foreground">physics-em-imp.pdf · page 1 / 24</span>
              <span className="text-[10px] text-muted-foreground">100%</span>
            </div>
            <div className="mt-6 space-y-1.5">
              <div className="h-2.5 w-2/3 rounded bg-white/10" />
              <div className="h-1.5 w-full rounded bg-white/5" />
              <div className="h-1.5 w-11/12 rounded bg-white/5" />
              <div className="h-1.5 w-3/4 rounded bg-white/5" />
              <div className="mt-3 h-1.5 w-1/2 rounded bg-white/10" />
              <div className="h-1.5 w-5/6 rounded bg-white/5" />
              <div className="h-1.5 w-4/5 rounded bg-white/5" />
              <div className="mt-4 h-16 rounded-lg border border-white/10 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10" />
            </div>
          </div>
        </div>

        {/* STEP 4 - Publish */}
        <div className="rounded-xl border border-white/10 bg-background/40 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 4 · Publish</p>
          <div className="space-y-3 text-sm">
            {[
              { l: "Hide from Students", d: "Keep this resource private until ready" },
              { l: "Featured Resource", d: "Pin to top of subject library" },
              { l: "Allow Downloads", d: "Students can download offline" },
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
            <Button variant="outline" className="border-white/15">
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button variant="outline" className="border-white/15">
              <CalendarPlus className="mr-2 h-4 w-4" /> Schedule
            </Button>
            <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong">
              <Rocket className="mr-2 h-4 w-4" /> Publish Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BulkImport() {
  const files = [
    { n: "hsc-bio-prev-2020.pdf", s: "3.1 MB", p: 100, ok: true },
    { n: "ssc-chem-model-04.pdf", s: "2.6 MB", p: 100, ok: true },
    { n: "admission-math-pack.docx", s: "1.4 MB", p: 64, ok: true },
    { n: "english-comprehension-corrupt.pdf", s: "—", p: 42, ok: false },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Bulk Import</p>
          <p className="font-display text-lg font-bold">Mass upload PDF, DOC & Text resources</p>
        </div>
        <Button className="bg-cta-gradient text-white shadow-glow">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Import
        </Button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-background/30 p-8 text-center">
          <CloudUpload className="mb-3 h-10 w-10 text-[var(--neon-blue)]" />
          <p className="text-sm font-medium">Drop multiple files here</p>
          <p className="text-xs text-muted-foreground">PDF · DOCX · TXT · up to 200 files</p>
          <Button size="sm" variant="outline" className="mt-3 border-white/15">
            <Upload className="mr-2 h-3.5 w-3.5" /> Browse files
          </Button>
        </div>
        <div className="space-y-2.5">
          {files.map((f) => (
            <div key={f.n} className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {f.ok ? (
                    <FileCheck2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{f.n}</p>
                    <p className="text-[10px] text-muted-foreground">{f.s}</p>
                  </div>
                </div>
                <Badge variant="outline" className={f.ok ? "border-emerald-400/40 text-emerald-400" : "border-rose-400/40 text-rose-400"}>
                  {f.ok ? "Validated" : "Error"}
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
  const bars = [42, 58, 71, 48, 88, 96, 74];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold">Daily Downloads</p>
        <BarChart3 className="h-4 w-4 text-[var(--neon-purple)]" />
      </div>
      <p className="mt-1 font-display text-2xl font-bold">
        18.4K <span className="text-xs font-normal text-emerald-400">▲ 12.4%</span>
      </p>
      <div className="mt-3 flex h-24 items-end gap-1.5">
        {bars.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/80 transition-all hover:from-[var(--neon-purple)]/60 hover:to-[var(--neon-blue)]"
            style={{ height: `${b}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Most Viewed</p>
        {[
          { t: "HSC Physics Imp Qns 2025", v: "38.2K" },
          { t: "SSC Chem Prev Papers", v: "24.1K" },
          { t: "Math Model Test #18", v: "14.9K" },
        ].map((r) => (
          <div key={r.t} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 px-2.5 py-1.5">
            <span className="truncate text-xs">{r.t}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{r.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg reading completion</p>
        <div className="mt-1 flex items-center gap-2">
          <Progress value={74} className="h-1.5 flex-1" />
          <span className="font-mono text-xs">74%</span>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { i: Upload, c: "var(--neon-purple)", t: "New PDF uploaded", s: "Physics · Mechanics Imp Qns · 2m" },
    { i: Edit3, c: "var(--neon-blue)", t: "Resource edited", s: "Chem · Last 10 Yrs Papers · 14m" },
    { i: Send, c: "#10b981", t: "Published to library", s: "Math · Model Test #18 · 28m" },
    { i: Eye, c: "#f59e0b", t: "Student access surge", s: "Biology · Genetics · +1.2K views · 1h" },
    { i: EyeOff, c: "#ef4444", t: "Resource hidden", s: "English · Comprehension Pack · 2h" },
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
            <div
              className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${a.c}22`, color: a.c, boxShadow: `0 0 12px ${a.c}33` }}
            >
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

function PopularCollections() {
  const cols = [
    { t: "HSC Physics Mastery Pack", q: 142, d: "62K", v: "184K", sub: "Physics", c: "var(--neon-purple)" },
    { t: "SSC Chemistry Vault", q: 98, d: "48K", v: "121K", sub: "Chemistry", c: "var(--neon-blue)" },
    { t: "Admission Math Drill", q: 76, d: "39K", v: "94K", sub: "Mathematics", c: "#10b981" },
    { t: "Biology Diagram Atlas", q: 64, d: "28K", v: "72K", sub: "Biology", c: "#ef4444" },
  ];
  return (
    <section className="glass shadow-card-soft rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Popular collections</p>
          <p className="font-display text-lg font-bold">Top performing resource bundles</p>
        </div>
        <Button variant="outline" size="sm" className="border-white/15">
          <BookOpen className="mr-2 h-3.5 w-3.5" /> Browse All
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div
            key={c.t}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-background/40 p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl"
              style={{ background: `${c.c}33` }}
            />
            <div className="relative flex items-start justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${c.c}22`, color: c.c, boxShadow: `0 0 14px ${c.c}33` }}
              >
                <Layers className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="border-white/15 text-[10px]">{c.sub}</Badge>
            </div>
            <p className="relative mt-3 line-clamp-2 text-sm font-semibold">{c.t}</p>
            <div className="relative mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Qty</p>
                <p className="font-mono text-xs font-bold">{c.q}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Dl</p>
                <p className="font-mono text-xs font-bold">{c.d}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Vw</p>
                <p className="font-mono text-xs font-bold">{c.v}</p>
              </div>
            </div>
            <div className="relative mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 2.4K active</span>
              <span className="inline-flex items-center gap-1 text-emerald-400"><TrendingUp className="h-3 w-3" /> +12%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function QuestionBankManagerFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <StatGrid />
      <FilterPanel />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <ResourceTable />
          <ResourceCreator />
          <BulkImport />
        </div>
        <aside className="space-y-4">
          <AnalyticsWidget />
          <ActivityFeed />
        </aside>
      </div>
      <PopularCollections />
    </div>
  );
}
