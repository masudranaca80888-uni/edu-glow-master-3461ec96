import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Upload,
  FileText,
  FileType,
  Send,
  EyeOff,
  Download,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Layers,
  CheckCircle2,
  Eye,
  Flame,
  Activity,
  BarChart3,
  Edit3,
  Trash2,
  Copy,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Highlighter,
  Smartphone,
  Monitor,
  Save,
  Rocket,
  CalendarPlus,
  CloudUpload,
  Sparkles,
  CircleDot,
  Bookmark,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

function Spark({ data, color = "var(--neon-purple)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 26}`).join(" ");
  const id = color.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full">
      <defs>
        <linearGradient id={`fc-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
      <polygon points={`0,30 ${pts} 100,30`} fill={`url(#fc-${id})`} />
    </svg>
  );
}

function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search flash cards, topics, subjects…"
          className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> System healthy · 99.99%
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
          <div className="bg-cta-gradient flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-glow">AR</div>
        </div>
      </div>
    </header>
  );
}

function HeaderBlock() {
  return (
    <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Layers className="mr-1 h-3 w-3" /> Flash Cards
            </Badge>
            <span className="text-xs text-muted-foreground">/ Admin / Flash Card Manager</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Flash Card <span className="text-gradient">Management Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create, organize and manage smart revision flash cards with rich media and instant publishing.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient rounded-xl text-white shadow-glow hover:opacity-95">
            <Plus className="h-4 w-4" /> Create Flash Card
          </Button>
          <Button variant="outline" className="rounded-xl border-white/15 bg-background/40">
            <CloudUpload className="h-4 w-4" /> Bulk Upload
          </Button>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {[
          { l: "Import PDF", i: FileText },
          { l: "Import DOC/Text", i: FileType },
          { l: "Publish Cards", i: Send },
          { l: "Hide Cards", i: EyeOff },
          { l: "Export Collection", i: Download },
        ].map((a) => (
          <button key={a.l} className="group flex items-center gap-2 rounded-xl border border-white/10 bg-background/50 px-3.5 py-2 text-xs font-medium backdrop-blur transition-all hover:border-[var(--neon-purple)]/40 hover:shadow-glow">
            <a.i className="h-3.5 w-3.5 text-[var(--neon-purple)] group-hover:text-[var(--neon-blue)]" />
            {a.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterPanel() {
  const pills = ["Level", "Subject", "Chapter", "Status"];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search flash cards by topic or ID…" className="h-9 rounded-xl border-white/10 bg-background/60 pl-9" />
        </div>
        {pills.map((p) => (
          <button key={p} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs hover:border-[var(--neon-blue)]/40">
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

function StatGrid() {
  const stats = [
    { l: "Total Flash Cards", v: "8,412", d: "+128 this week", i: Layers, c: "var(--neon-purple)", s: [4, 6, 5, 8, 7, 10, 12] },
    { l: "Published Cards", v: "7,204", d: "85.6% live", i: Send, c: "#22c55e", s: [50, 55, 60, 62, 70, 75, 82] },
    { l: "Hidden Cards", v: "1,208", d: "Under review", i: EyeOff, c: "#f59e0b", s: [12, 14, 10, 11, 9, 8, 7] },
    { l: "Most Viewed Set", v: "12.4k", d: "Organic Chemistry · Reactions", i: Flame, c: "var(--neon-blue)", s: [2, 4, 6, 9, 11, 13, 14] },
    { l: "Completion Rate", v: "78.3%", d: "+3.4% vs last", i: CheckCircle2, c: "#06b6d4", s: [60, 64, 68, 70, 72, 75, 78] },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((s) => (
        <div key={s.l} className="glass group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60" style={{ background: s.c }} />
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10" style={{ background: `color-mix(in oklab, ${s.c} 15%, transparent)` }}>
              <s.i className="h-4 w-4" style={{ color: s.c }} />
            </div>
            <span className="text-[10px] text-muted-foreground">7d</span>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">{s.l}</p>
          <p className="font-display text-2xl font-bold tracking-tight">{s.v}</p>
          <Spark data={s.s} color={s.c} />
          <p className="truncate text-[10px] text-muted-foreground">{s.d}</p>
        </div>
      ))}
    </div>
  );
}

const CARDS = [
  { id: "FC-9120", t: "Newton's Laws of Motion", sub: "Physics", ch: "Mechanics", ty: "Concept", v: 4_812, st: "Published", date: "May 18, 2026" },
  { id: "FC-9119", t: "SN1 vs SN2 Reactions", sub: "Chemistry", ch: "Organic", ty: "Formula", v: 3_104, st: "Published", date: "May 17, 2026" },
  { id: "FC-9118", t: "DNA Replication Steps", sub: "Biology", ch: "Genetics", ty: "Diagram", v: 2_274, st: "Scheduled", date: "May 22, 2026" },
  { id: "FC-9117", t: "Integration by Parts", sub: "Math", ch: "Calculus", ty: "Formula", v: 1_976, st: "Draft", date: "—" },
  { id: "FC-9116", t: "French Revolution Timeline", sub: "History", ch: "Modern Era", ty: "Timeline", v: 982, st: "Hidden", date: "May 14, 2026" },
  { id: "FC-9115", t: "Supply & Demand Curve", sub: "Economics", ch: "Microecon.", ty: "Diagram", v: 3_021, st: "Published", date: "May 12, 2026" },
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

function CardTable() {
  return (
    <div className="glass shadow-card-soft overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <h3 className="font-display text-lg font-bold">All Flash Cards</h3>
          <p className="text-xs text-muted-foreground">Showing 6 of 8,412 — live sync enabled</p>
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
              <TableHead className="pl-4">Card ID</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Upload</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CARDS.map((c) => (
              <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.03]">
                <TableCell className="pl-4 font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                <TableCell className="font-medium">{c.t}</TableCell>
                <TableCell className="text-muted-foreground">{c.sub}</TableCell>
                <TableCell className="text-muted-foreground">{c.ch}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] text-[var(--neon-purple)]">{c.ty}</span>
                </TableCell>
                <TableCell>{c.v.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusTone(c.st)} border text-[10px]`}>{c.st}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-0.5">
                    {[Edit3, Eye, Copy, Send, EyeOff, Trash2].map((I, i) => (
                      <button key={i} className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground">
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
        <span>Page 1 of 1,403</span>
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

function FlashCardCreator() {
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Flash Card Creator</h3>
          <p className="text-xs text-muted-foreground">Design beautiful revision cards in four guided steps.</p>
        </div>
        <Badge className="bg-cta-gradient border-0 text-white shadow-glow">Step 2 of 4 in progress</Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Step n={1} title="Setup">
          <div className="grid grid-cols-3 gap-2">
            {["Certificate", "Professional", "Advanced"].map((l, i) => (
              <button key={l} className={`rounded-xl border px-3 py-2 text-xs font-medium ${i === 1 ? "border-[var(--neon-blue)]/50 bg-[var(--neon-blue)]/10 text-[var(--neon-blue)]" : "border-white/10 bg-background/40"}`}>{l}</button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Physics", "Chemistry", "Biology", "Math", "History"].map((s, i) => (
              <span key={s} className={`rounded-md border px-2 py-1 text-[11px] ${i === 1 ? "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "border-white/10"}`}>{s}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Ch.1 Atomic Structure", "Ch.2 Bonding", "Ch.3 Reactions"].map((c, i) => (
              <span key={c} className={`rounded-md border px-2 py-1 text-[11px] ${i === 2 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-muted-foreground"}`}>{c}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Concept", "Formula", "Diagram"].map((c, i) => (
              <button key={c} className={`rounded-xl border px-3 py-1.5 text-[11px] ${i === 1 ? "border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]" : "border-white/10 bg-background/40"}`}>{c}</button>
            ))}
          </div>
        </Step>

        <Step n={2} title="Card Builder" active>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Front side</p>
              <Input placeholder="Topic / question…" className="h-8 rounded-lg border-white/10 bg-background/40 text-xs" />
              <Input placeholder="Formula (LaTeX)…" className="mt-2 h-8 rounded-lg border-white/10 bg-background/40 text-xs" />
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-background/30 py-3 text-[11px] text-muted-foreground hover:border-[var(--neon-blue)]/40">
                <ImageIcon className="h-3.5 w-3.5" /> Upload diagram
              </button>
            </div>
            <div className="rounded-xl border border-white/10 bg-background/40 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Back side</p>
              <div className="mb-2 flex gap-1">
                {[Bold, Italic, List, Highlighter].map((I, i) => (
                  <button key={i} className="rounded-md border border-white/10 bg-background/40 p-1.5 text-muted-foreground hover:text-foreground">
                    <I className="h-3 w-3" />
                  </button>
                ))}
              </div>
              <div className="min-h-[80px] rounded-lg border border-white/10 bg-background/40 p-2 text-[11px] text-muted-foreground">
                Detailed explanation with <span className="rounded bg-[var(--neon-purple)]/20 px-1 text-foreground">highlighted</span> key points…
              </div>
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-background/30 py-2 text-[11px] text-muted-foreground hover:border-[var(--neon-purple)]/40">
                <FileText className="h-3.5 w-3.5" /> Attach PDF snippet
              </button>
            </div>
          </div>
        </Step>

        <Step n={3} title="Preview">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex gap-1">
              <button className="flex items-center gap-1 rounded-lg border border-[var(--neon-blue)]/40 bg-[var(--neon-blue)]/10 px-2 py-1 text-[var(--neon-blue)]">
                <Monitor className="h-3 w-3" /> Desktop
              </button>
              <button className="flex items-center gap-1 rounded-lg border border-white/10 bg-background/40 px-2 py-1">
                <Smartphone className="h-3 w-3" /> Mobile
              </button>
            </div>
            <div className="flex gap-1">
              <button className="rounded-lg border border-white/10 bg-background/40 px-2 py-1">Dark</button>
              <button className="rounded-lg border border-white/10 bg-background/40 px-2 py-1">Light</button>
            </div>
          </div>
          <div className="mt-3 [perspective:1000px]">
            <div className="group relative h-40 rounded-2xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/15 to-[var(--neon-blue)]/15 p-4 shadow-glow transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden]">
                <span className="self-end rounded-md bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">FRONT</span>
                <div>
                  <p className="font-display text-base font-bold">SN1 vs SN2 Reactions</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">Hover to flip → reveal explanation</p>
                </div>
                <RotateCw className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="self-end rounded-md bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">BACK</span>
                <p className="text-[11px] leading-relaxed">
                  SN1: two-step, carbocation intermediate. SN2: one-step, backside attack, inversion of stereochemistry.
                </p>
              </div>
            </div>
          </div>
        </Step>

        <Step n={4} title="Publish">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-xs">
              <span>Hide from students</span>
              <Switch />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                <p className="text-[10px] text-muted-foreground">Schedule date</p>
                <p className="font-display text-sm font-semibold">May 28, 2026</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                <p className="text-[10px] text-muted-foreground">Schedule time</p>
                <p className="font-display text-sm font-semibold">09:30 AM</p>
              </div>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><Save className="h-3.5 w-3.5" /> Save Draft</Button>
              <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><CalendarPlus className="h-3.5 w-3.5" /> Schedule</Button>
              <Button variant="outline" className="rounded-xl border-white/10 bg-background/40"><Eye className="h-3.5 w-3.5" /> Preview</Button>
              <Button className="bg-cta-gradient rounded-xl text-white shadow-glow"><Rocket className="h-3.5 w-3.5" /> Publish</Button>
            </div>
          </div>
        </Step>
      </div>
    </div>
  );
}

function BulkImport() {
  const files = [
    { n: "Organic_Chemistry_Reactions.pdf", s: "PDF · 4.2 MB", p: 100, ok: true, cards: 84 },
    { n: "Calculus_Formulas_Set.docx", s: "DOCX · 1.6 MB", p: 72, ok: true, cards: 42 },
    { n: "Physics_Mechanics_Notes.txt", s: "TXT · 312 KB", p: 38, ok: false, cards: 0 },
  ];
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Bulk Import</h3>
          <p className="text-xs text-muted-foreground">Parse PDFs, DOC and TXT into ready-to-publish flash cards.</p>
        </div>
        <Button size="sm" className="bg-cta-gradient rounded-xl text-white shadow-glow">
          <Sparkles className="h-3.5 w-3.5" /> Approve Import
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_1.4fr]">
        <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-background/30 p-8 text-center transition-all hover:border-[var(--neon-purple)]/50 hover:bg-[var(--neon-purple)]/5">
          <div className="bg-cta-gradient mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-glow">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <p className="font-display text-sm font-semibold">Drag & drop files here</p>
          <p className="mt-1 text-[11px] text-muted-foreground">PDF, DOCX, TXT up to 50 MB</p>
          <Button size="sm" variant="outline" className="mt-3 rounded-xl border-white/15 bg-background/40">Browse files</Button>
        </div>

        <div className="space-y-2">
          {files.map((f) => (
            <div key={f.n} className="rounded-xl border border-white/10 bg-background/40 p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--neon-blue)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{f.n}</p>
                  <p className="text-[10px] text-muted-foreground">{f.s} · {f.cards} cards detected</p>
                </div>
                {f.ok ? (
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400">Valid</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400">Parsing…</Badge>
                )}
              </div>
              <Progress value={f.p} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsWidget() {
  const bars = [30, 55, 48, 70, 62, 88, 95];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-sm font-bold">Flash Card Analytics</h4>
        <BarChart3 className="h-4 w-4 text-[var(--neon-blue)]" />
      </div>
      <p className="text-[10px] text-muted-foreground">Daily usage · last 7d</p>
      <div className="mt-2 flex h-24 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-90" style={{ height: `${b}%` }} />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-[11px]">
        {[
          { l: "Organic Chemistry · Reactions", v: "12.4k" },
          { l: "Calculus · Integration", v: "9.8k" },
          { l: "Physics · Mechanics", v: "8.1k" },
        ].map((m) => (
          <li key={m.l} className="flex items-center justify-between rounded-lg border border-white/10 bg-background/40 px-2 py-1.5">
            <span className="truncate text-muted-foreground">{m.l}</span>
            <span className="font-semibold">{m.v}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Avg completion</p>
          <p className="font-semibold">78.3%</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-background/40 p-2">
          <p className="text-muted-foreground">Bookmark trend</p>
          <p className="font-semibold text-emerald-400">▲ 14%</p>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { i: Plus, c: "var(--neon-purple)", t: "New cards uploaded", s: "Organic Chemistry · 84 cards", a: "3m ago" },
    { i: Edit3, c: "var(--neon-blue)", t: "Flash card edited", s: "Integration by Parts · formula fix", a: "21m ago" },
    { i: Send, c: "#22c55e", t: "Collection published", s: "DNA Replication Set", a: "1h ago" },
    { i: Bookmark, c: "#f59e0b", t: "Bookmark spike", s: "Newton's Laws · +482 today", a: "2h ago" },
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

function PopularCollections() {
  const cols = [
    { t: "Organic Chemistry · Reactions", cards: 184, v: "12.4k", c: 82, sub: "Chemistry", g: "from-fuchsia-500/30 to-purple-500/20" },
    { t: "Calculus · Integration Mastery", cards: 142, v: "9.8k", c: 76, sub: "Math", g: "from-sky-500/30 to-blue-500/20" },
    { t: "DNA & Genetics Essentials", cards: 96, v: "8.1k", c: 69, sub: "Biology", g: "from-emerald-500/30 to-teal-500/20" },
    { t: "Modern History Timeline", cards: 120, v: "5.4k", c: 64, sub: "History", g: "from-amber-500/30 to-orange-500/20" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold">Popular Flash Card Collections</h3>
          <p className="text-xs text-muted-foreground">Top performing sets across the platform</p>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl border-white/10">
          <Eye className="h-3.5 w-3.5" /> View all
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((c) => (
          <div key={c.t} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${c.g} p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow`}>
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <Badge variant="outline" className="border-white/20 bg-background/40 text-[10px]">{c.sub}</Badge>
            <p className="mt-3 font-display text-sm font-bold leading-snug">{c.t}</p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{c.cards} cards</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {c.v}</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Completion</span>
                <span className="font-semibold text-foreground">{c.c}%</span>
              </div>
              <Progress value={c.c} className="mt-1 h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlashCardManagerFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <HeaderBlock />
      <FilterPanel />
      <StatGrid />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <CardTable />
          <FlashCardCreator />
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
