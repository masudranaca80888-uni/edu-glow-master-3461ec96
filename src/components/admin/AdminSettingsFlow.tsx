import {
  Search, Bell, Sun, Moon, Save, DatabaseBackup, Upload, Trash2, Power,
  Download, Sparkles, CircleDot, Settings as SettingsIcon, Palette,
  ShieldCheck, Eye, CreditCard, Mail, HardDrive, Plug, Image as ImageIcon,
  Globe, Clock, Phone, Languages, Type, Sliders, Layout, Zap, Lock,
  Smartphone, Key, Fingerprint, AlertTriangle, RefreshCw, Webhook,
  Server, Cpu, Database, Wifi, Activity, LogIn, ChevronRight, Plus,
  Youtube, BarChart3, Flame, Crown, Calendar, FileText, Cloud, CheckCircle2,
  XCircle, RotateCw, Copy, Edit3, Send, Wrench, ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useModuleVisibility } from "@/hooks/use-module-visibility";
import { adminSetModuleHidden } from "@/lib/module-visibility.functions";

/* -------------------- top bar -------------------- */
function Topbar() {
  return (
    <header className="glass shadow-card-soft flex items-center gap-3 rounded-2xl p-3">
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search settings, integrations, keys…" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9 backdrop-blur" />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400 md:flex">
          <CircleDot className="h-3 w-3 animate-pulse" /> Platform · stable · 99.99%
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
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow"><Sparkles className="mr-1 h-3 w-3" /> Control Core</Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">v3.2 · live</Badge>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Platform <span className="text-gradient">Settings & Control Center</span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage platform appearance, permissions, integrations, modules and system controls from a single command surface.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-cta-gradient text-white shadow-glow hover:shadow-glow-strong"><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
          <Button variant="outline" className="border-white/15 backdrop-blur"><DatabaseBackup className="mr-2 h-4 w-4" /> Backup System</Button>
          <Button variant="outline" className="border-white/15 backdrop-blur"><Upload className="mr-2 h-4 w-4" /> Restore Backup</Button>
          <Button variant="outline" className="border-white/15 backdrop-blur"><Trash2 className="mr-2 h-4 w-4" /> Clear Cache</Button>
          <Button variant="outline" className="border-amber-400/30 text-amber-400 hover:bg-amber-500/10"><Power className="mr-2 h-4 w-4" /> Maintenance</Button>
          <Button variant="outline" className="border-white/15 backdrop-blur"><Download className="mr-2 h-4 w-4" /> Export Config</Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------- categories -------------------- */
const categories = [
  { t: "General", d: "Brand, contact, locale", i: SettingsIcon, c: "var(--neon-purple)", status: "ok" },
  { t: "Appearance", d: "Theme, fonts, radius", i: Palette, c: "var(--neon-blue)", status: "ok" },
  { t: "Auth & Security", d: "JWT · 2FA · sessions", i: ShieldCheck, c: "#10b981", status: "ok" },
  { t: "Module Visibility", d: "Toggle student modules", i: Eye, c: "#a78bfa", status: "warn" },
  { t: "Payments", d: "Plans · gateways · trials", i: CreditCard, c: "#f59e0b", status: "ok" },
  { t: "Email & Notify", d: "SMTP · push · templates", i: Mail, c: "#06b6d4", status: "ok" },
  { t: "Storage & Uploads", d: "Limits · CDN · backups", i: HardDrive, c: "#ef4444", status: "warn" },
  { t: "API & Integrations", d: "Keys · webhooks · 3rd-party", i: Plug, c: "#22d3ee", status: "ok" },
];

function CategoryGrid() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => (
        <button key={c.t} className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition-opacity group-hover:opacity-80" style={{ background: `${c.c}33` }} />
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/40" style={{ boxShadow: `0 0 16px ${c.c}55` }}>
              <c.i className="h-4 w-4" style={{ color: c.c }} />
            </div>
            <span className={`flex items-center gap-1 text-[10px] ${c.status === "ok" ? "text-emerald-400" : "text-amber-400"}`}>
              <CircleDot className="h-2.5 w-2.5 animate-pulse" />
              {c.status === "ok" ? "healthy" : "review"}
            </span>
          </div>
          <p className="mt-3 font-display text-sm font-semibold">{c.t}</p>
          <p className="text-[11px] text-muted-foreground">{c.d}</p>
        </button>
      ))}
    </section>
  );
}

/* -------------------- panel chrome -------------------- */
function Panel({
  icon: Icon, color, title, subtitle, children, badge,
}: {
  icon: any; color: string; title: string; subtitle: string; children: React.ReactNode; badge?: string;
}) {
  return (
    <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl" style={{ background: `${color}33` }} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-background/40" style={{ boxShadow: `0 0 16px ${color}55` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {badge && <Badge variant="outline" className="border-white/15 text-[10px]">{badge}</Badge>}
      </div>
      <div className="relative mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/70">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

/* -------------------- 1. general -------------------- */
function GeneralPanel() {
  return (
    <Panel icon={SettingsIcon} color="var(--neon-purple)" title="General Settings" subtitle="Brand identity, contact & locale" badge="auto-save">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Platform name"><Input defaultValue="EduMaster Pro" className="h-10 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Support email"><Input defaultValue="support@edumasterpro.com" className="h-10 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Contact number"><Input defaultValue="+91 80 4000 1234" className="h-10 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Default language">
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue="English (IN)" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
              </div>
            </Field>
            <Field label="Timezone">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue="Asia/Kolkata (UTC +05:30)" className="h-10 rounded-xl border-white/10 bg-background/60 pl-9" />
              </div>
            </Field>
            <Field label="Date format"><Input defaultValue="DD MMM YYYY" className="h-10 rounded-xl border-white/10 bg-background/60" /></Field>
          </div>
        </div>
        <div className="space-y-3">
          <Field label="Logo" hint="SVG / PNG · 512px">
            <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-background/40">
              <div className="text-center">
                <div className="bg-cta-gradient mx-auto flex h-10 w-10 items-center justify-center rounded-xl shadow-glow"><Sparkles className="h-5 w-5 text-white" /></div>
                <p className="mt-1 text-[10px] text-muted-foreground">Drop or click to upload</p>
              </div>
            </div>
          </Field>
          <Field label="Favicon" hint="32×32 ICO/PNG">
            <div className="flex h-16 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-background/40">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </Field>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 2. appearance -------------------- */
const accents = ["#a78bfa", "#7c3aed", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
const fonts = ["Inter", "Space Grotesk", "Outfit", "Sora", "JetBrains Mono"];

function Slider({ value }: { value: number }) {
  return (
    <div className="relative h-1.5 rounded-full bg-white/10">
      <div className="absolute inset-y-0 left-0 rounded-full bg-cta-gradient shadow-glow" style={{ width: `${value}%` }} />
      <div className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-white/30 bg-background shadow-glow" style={{ left: `calc(${value}% - 7px)` }} />
    </div>
  );
}

function AppearancePanel() {
  return (
    <Panel icon={Palette} color="var(--neon-blue)" title="Appearance & Themes" subtitle="Theme · color · typography · motion" badge="live preview">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Default mode">
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-background/40 p-1 text-xs">
                <button className="flex-1 rounded-lg px-3 py-1.5 text-muted-foreground">Light</button>
                <button className="flex-1 rounded-lg bg-cta-gradient px-3 py-1.5 text-white shadow-glow">Dark</button>
                <button className="flex-1 rounded-lg px-3 py-1.5 text-muted-foreground">System</button>
              </div>
            </Field>
            <Field label="Dashboard layout">
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-background/40 p-1 text-xs">
                <button className="flex-1 rounded-lg bg-cta-gradient px-3 py-1.5 text-white shadow-glow">Sidebar</button>
                <button className="flex-1 rounded-lg px-3 py-1.5 text-muted-foreground">Topnav</button>
                <button className="flex-1 rounded-lg px-3 py-1.5 text-muted-foreground">Hybrid</button>
              </div>
            </Field>
          </div>

          <Field label="Accent color">
            <div className="flex flex-wrap items-center gap-2">
              {accents.map((c, i) => (
                <button key={c} className={`h-8 w-8 rounded-xl border ${i === 0 ? "border-white/60" : "border-white/10"} transition-transform hover:scale-110`} style={{ background: c, boxShadow: i === 0 ? `0 0 14px ${c}` : undefined }} />
              ))}
              <div className="ml-2 flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-2 py-1">
                <span className="h-4 w-4 rounded-md" style={{ background: accents[0] }} />
                <Input defaultValue="#A78BFA" className="h-7 w-24 border-0 bg-transparent p-0 text-xs" />
              </div>
            </div>
          </Field>

          <Field label="Font family">
            <div className="flex flex-wrap gap-2">
              {fonts.map((f, i) => (
                <button key={f} className={`rounded-xl border px-3 py-1.5 text-xs ${i === 1 ? "border-[var(--neon-purple)]/50 bg-[var(--neon-purple)]/10 text-foreground shadow-glow" : "border-white/10 bg-background/40 text-muted-foreground hover:text-foreground"}`}>
                  <Type className="mr-1.5 inline h-3 w-3" /> {f}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Border radius" hint="14px"><Slider value={56} /></Field>
            <Field label="Animation" hint="balanced"><Slider value={62} /></Field>
            <Field label="Glass blur" hint="strong"><Slider value={78} /></Field>
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-2xl border border-white/10 bg-background/40 p-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Live preview</p>
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-background/40 p-0.5 text-[11px]">
              <button className="rounded-md bg-cta-gradient px-2 py-1 text-white">Desktop</button>
              <button className="px-2 py-1 text-muted-foreground">Mobile</button>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/10 via-transparent to-[var(--neon-blue)]/10 p-3 shadow-glow">
            <div className="flex items-center gap-2">
              <div className="bg-cta-gradient flex h-6 w-6 items-center justify-center rounded-md shadow-glow"><Sparkles className="h-3 w-3 text-white" /></div>
              <span className="font-display text-xs font-bold">EduMaster Pro</span>
              <Badge className="ml-auto bg-cta-gradient border-0 text-[9px] text-white">Preview</Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-white/15" />
              <div className="h-2 w-1/2 rounded-full bg-white/10" />
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[1,2,3].map((i) => <div key={i} className="h-10 rounded-lg border border-white/10 bg-background/60" />)}
              </div>
              <Button size="sm" className="bg-cta-gradient mt-2 h-7 w-full text-[11px] text-white shadow-glow">Primary CTA</Button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">Glassmorphism · 78% · radius 14px</p>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 3. security -------------------- */
function ToggleRow({ icon: Icon, label, hint, on, color = "var(--neon-purple)" }: { icon: any; label: string; hint?: string; on?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-background/60" style={{ boxShadow: `0 0 10px ${color}55` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <Switch defaultChecked={on} />
    </div>
  );
}

function SecurityPanel() {
  return (
    <Panel icon={ShieldCheck} color="#10b981" title="Authentication & Security" subtitle="JWT · social · 2FA · sessions" badge="hardening: A+">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <ToggleRow icon={Key} label="JWT auth" hint="Access 30m · Refresh 7d" on color="#10b981" />
          <ToggleRow icon={LogIn} label="Google login" hint="OAuth 2.0 · production" on color="#3b82f6" />
          <ToggleRow icon={LogIn} label="Facebook login" hint="OAuth · disabled" color="#1877f2" />
          <ToggleRow icon={Fingerprint} label="Two-factor authentication" hint="TOTP + backup codes" on color="var(--neon-purple)" />
        </div>
        <div className="space-y-3">
          <Field label="Session timeout" hint="auto-logout">
            <div className="flex items-center gap-2">
              <Slider value={45} />
              <span className="w-12 text-right text-[11px] tabular-nums text-muted-foreground">45 min</span>
            </div>
          </Field>
          <Field label="Password policy">
            <div className="flex flex-wrap gap-2 text-[11px]">
              {[{l:"Min 10 chars",on:true},{l:"Number",on:true},{l:"Symbol",on:true},{l:"Mixed case",on:true},{l:"HIBP check",on:true},{l:"Expire 90d",on:false}].map((p) => (
                <span key={p.l} className={`flex items-center gap-1 rounded-full border px-2.5 py-1 ${p.on ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/15 text-muted-foreground"}`}>
                  {p.on ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} {p.l}
                </span>
              ))}
            </div>
          </Field>
          <Field label="Device restriction">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue="3" className="h-9 rounded-xl border-white/10 bg-background/60 pl-9" />
              </div>
              <span className="text-[11px] text-muted-foreground">devices / user</span>
            </div>
          </Field>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 4. module visibility -------------------- */
function ModulesPanel() {
  const { rows } = useModuleVisibility();
  const qc = useQueryClient();
  const setFn = useServerFn(adminSetModuleHidden);
  type Row = (typeof rows)[number];
  const mut = useMutation({
    mutationFn: (v: { key: Row["key"]; hidden: boolean }) =>
      setFn({ data: { key: v.key, hidden: v.hidden } }),
    onMutate: async (v: { key: Row["key"]; hidden: boolean }) => {
      await qc.cancelQueries({ queryKey: ["module-visibility"] });
      const prev = qc.getQueryData<Row[]>(["module-visibility"]);
      if (prev) {
        qc.setQueryData<Row[]>(
          ["module-visibility"],
          prev.map((r) => (r.key === v.key ? { ...r, hidden: v.hidden } : r)),
        );
      }
      return { prev };
    },
    onError: (_e: unknown, _v: unknown, ctx: { prev?: Row[] } | undefined) => {
      if (ctx?.prev) qc.setQueryData(["module-visibility"], ctx.prev);
      toast.error("Could not update module");
    },
    onSuccess: (_d: unknown, v: { key: Row["key"]; hidden: boolean }) => {
      toast.success(`${v.hidden ? "Hidden" : "Visible"} for students`);
      qc.invalidateQueries({ queryKey: ["module-visibility"] });
    },
  });
  const liveCount = rows.filter((r) => !r.hidden).length;
  return (
    <Panel icon={Eye} color="#a78bfa" title="Module Visibility" subtitle="Show/hide modules for students globally" badge={`${liveCount}/${rows.length} live`}>
      <div className="grid gap-2 sm:grid-cols-2">
        {rows.map((m) => (
          <div key={m.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${!m.hidden ? "animate-pulse bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-zinc-500"}`} />
              <p className="text-sm font-medium">{m.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">students</Badge>
              <Switch
                checked={!m.hidden}
                disabled={mut.isPending}
                onCheckedChange={(on) => mut.mutate({ key: m.key, hidden: !on })}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* -------------------- 5. payments -------------------- */
const plans = [
  { t: "Free", p: "₹0", users: "94.2K", color: "border-white/15" },
  { t: "Pro", p: "₹399/mo", users: "21.4K", color: "border-[var(--neon-blue)]/40 shadow-glow" },
  { t: "Premium", p: "₹899/mo", users: "7.5K", color: "border-[var(--neon-purple)]/40 shadow-glow" },
];

function PaymentsPanel() {
  return (
    <Panel icon={CreditCard} color="#f59e0b" title="Payment & Subscription" subtitle="Plans · gateways · trials · billing" badge="MRR ₹38.4L">
      <div className="grid gap-3 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.t} className={`relative overflow-hidden rounded-2xl border bg-background/30 p-4 ${p.color}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold">{p.t}</h3>
              {p.t === "Premium" && <Crown className="h-4 w-4 text-amber-400" />}
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-gradient">{p.p}</p>
            <p className="text-[11px] text-muted-foreground">{p.users} active subscribers</p>
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> live</span>
              <Button size="sm" variant="ghost" className="h-7 text-[11px]">Edit <ChevronRight className="ml-1 h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Payment gateways</p>
          <ToggleRow icon={CreditCard} label="Stripe" hint="live · IN · USD" on color="#635bff" />
          <ToggleRow icon={CreditCard} label="Razorpay" hint="live · INR" on color="#0c2540" />
          <ToggleRow icon={CreditCard} label="Paddle" hint="sandbox" color="#fdb52a" />
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Trial settings</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Free trial"><Input defaultValue="14 days" className="h-9 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Auto-renew">
              <div className="flex h-9 items-center justify-between rounded-xl border border-white/10 bg-background/60 px-3">
                <span className="text-xs text-muted-foreground">After trial ends</span>
                <Switch defaultChecked />
              </div>
            </Field>
          </div>
          <Button size="sm" variant="outline" className="w-full border-white/15"><FileText className="mr-2 h-3.5 w-3.5" /> Manage billing portal</Button>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 6. email & notify -------------------- */
function EmailPanel() {
  return (
    <Panel icon={Mail} color="#06b6d4" title="Email & Notifications" subtitle="SMTP · push · templates · broadcasts" badge="health 98.4%">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">SMTP configuration</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Host"><Input defaultValue="smtp.lovable.email" className="h-9 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Port"><Input defaultValue="587" className="h-9 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Username"><Input defaultValue="notify@edumasterpro.com" className="h-9 rounded-xl border-white/10 bg-background/60" /></Field>
            <Field label="Password"><Input type="password" defaultValue="••••••••••" className="h-9 rounded-xl border-white/10 bg-background/60" /></Field>
          </div>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow"><Send className="mr-2 h-3.5 w-3.5" /> Send test email</Button>
        </div>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Channels</p>
          <ToggleRow icon={Smartphone} label="Push notifications" hint="FCM · iOS · Android" on color="var(--neon-purple)" />
          <ToggleRow icon={Mail} label="Email notifications" hint="Auth + transactional" on color="#06b6d4" />
          <ToggleRow icon={Bell} label="In-app notifications" hint="Realtime websocket" on color="#10b981" />
          <ToggleRow icon={Calendar} label="Automated reminders" hint="Exam · streak · billing" on color="#f59e0b" />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted-foreground">12 templates active</span>
            <Button size="sm" variant="outline" className="h-7 border-white/15 text-[11px]"><Edit3 className="mr-1.5 h-3 w-3" />Manage</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 7. storage -------------------- */
function StoragePanel() {
  return (
    <Panel icon={HardDrive} color="#ef4444" title="Storage & Uploads" subtitle="Limits · file types · CDN · auto-backup" badge="71% used">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-background/30 p-4 lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Max upload size" hint="per file">
              <div className="flex items-center gap-2">
                <Slider value={32} />
                <span className="w-14 text-right text-[11px] tabular-nums text-muted-foreground">64 MB</span>
              </div>
            </Field>
            <Field label="Allowed types">
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {["PDF","DOCX","TXT","PNG","JPG","MP4","XLSX"].map((t) => (
                  <span key={t} className="rounded-md border border-white/15 bg-background/60 px-2 py-0.5 text-muted-foreground">{t}</span>
                ))}
                <button className="rounded-md border border-dashed border-white/20 px-2 py-0.5 text-muted-foreground/70 hover:text-foreground"><Plus className="inline h-3 w-3" /></button>
              </div>
            </Field>
          </div>
          <ToggleRow icon={Cloud} label="CDN delivery" hint="Cloudflare edge · 220 PoP" on color="#f48120" />
          <ToggleRow icon={DatabaseBackup} label="Auto backup" hint="Daily · 03:00 IST · 30d retention" on color="#10b981" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-background/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Storage usage</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">712 <span className="text-base text-muted-foreground">/ 1 TB</span></p>
          <Progress value={71} className="mt-3 h-2" />
          <ul className="mt-3 space-y-1.5 text-[11px]">
            <li className="flex justify-between"><span className="text-muted-foreground">PDFs</span><span>284 GB</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Videos</span><span>312 GB</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Images</span><span>78 GB</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Backups</span><span>38 GB</span></li>
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- 8. integrations -------------------- */
const integrations = [
  { t: "YouTube Data API", d: "Video classes import & metadata", i: Youtube, c: "#ef4444", on: true, key: "AIza••••••8fK4" },
  { t: "Google Analytics 4", d: "Visitor & event tracking", i: BarChart3, c: "#f59e0b", on: true, key: "G-••••0942" },
  { t: "Firebase Cloud Messaging", d: "Push notifications", i: Flame, c: "#ffca28", on: true, key: "fcm-••••2c8a" },
  { t: "Webhook · Stripe events", d: "Subscription lifecycle", i: Webhook, c: "#635bff", on: true, key: "whsec_••••71" },
];

function IntegrationsPanel() {
  return (
    <Panel icon={Plug} color="#22d3ee" title="API & Integrations" subtitle="3rd-party services · webhooks · keys" badge="4 connected">
      <div className="grid gap-3 lg:grid-cols-2">
        {integrations.map((it) => (
          <div key={it.t} className="rounded-2xl border border-white/10 bg-background/30 p-3 transition-all hover:border-white/20 hover:shadow-glow">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-background/60" style={{ boxShadow: `0 0 12px ${it.c}55` }}>
                <it.i className="h-4 w-4" style={{ color: it.c }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{it.t}</p>
                  <Switch defaultChecked={it.on} />
                </div>
                <p className="text-[11px] text-muted-foreground">{it.d}</p>
                <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-background/60 px-2 py-1">
                  <Key className="h-3 w-3 text-muted-foreground" />
                  <code className="flex-1 truncate text-[10px] font-mono">{it.key}</code>
                  <Button size="icon" variant="ghost" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6"><RotateCw className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-background/20 p-3">
        <div className="flex items-center gap-2 text-xs">
          <Webhook className="h-4 w-4 text-[var(--neon-blue)]" />
          <span className="text-muted-foreground">Add a new webhook endpoint for incoming events</span>
        </div>
        <Button size="sm" className="bg-cta-gradient text-white shadow-glow"><Plus className="mr-1.5 h-3.5 w-3.5" />New webhook</Button>
      </div>
    </Panel>
  );
}

/* -------------------- side widgets -------------------- */
const health = [
  { l: "CPU", v: 42, i: Cpu, c: "var(--neon-purple)", s: "%" },
  { l: "RAM", v: 58, i: Server, c: "var(--neon-blue)", s: "%" },
  { l: "Database", v: 38, i: Database, c: "#10b981", s: "%" },
  { l: "API latency", v: 22, raw: "28ms", i: Zap, c: "#f59e0b", s: "ms" },
  { l: "Storage", v: 71, i: HardDrive, c: "#ef4444", s: "%" },
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
              <span className="tabular-nums text-muted-foreground">{h.raw ?? `${h.v}${h.s}`}</span>
            </div>
            <Progress value={h.v} className="mt-1.5 h-1.5" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const sec = [
  { t: "Login · Asha Rahman · Chennai", time: "2m ago", i: LogIn, c: "text-emerald-400" },
  { t: "Failed login · 4 attempts · 103.x.x.42", time: "9m ago", i: ShieldAlert, c: "text-red-400" },
  { t: "Admin role changed · Devansh → Moderator", time: "31m ago", i: ShieldCheck, c: "text-fuchsia-400" },
  { t: "2FA enabled · Priya Verma", time: "1h ago", i: Fingerprint, c: "text-sky-400" },
  { t: "API key rotated · Firebase", time: "2h ago", i: RotateCw, c: "text-amber-400" },
];

function SecurityActivity() {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--neon-purple)]" />
        <h3 className="font-display text-sm font-semibold">Security Activity</h3>
      </div>
      <ul className="mt-3 space-y-2.5">
        {sec.map((a, i) => (
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

/* -------------------- backup center -------------------- */
const backups = [
  { n: "Daily snapshot · 2026-05-20", s: "4.2 GB", t: "Auto", st: "ok" },
  { n: "Daily snapshot · 2026-05-19", s: "4.1 GB", t: "Auto", st: "ok" },
  { n: "Manual · pre-migration", s: "4.4 GB", t: "Manual", st: "ok" },
  { n: "Weekly · 2026-05-13", s: "4.0 GB", t: "Auto", st: "ok" },
  { n: "Daily snapshot · 2026-05-12", s: "3.9 GB", t: "Auto", st: "warn" },
];

function BackupCenter() {
  return (
    <section className="glass shadow-card-soft overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <DatabaseBackup className="h-4 w-4 text-[var(--neon-purple)]" />
          <h2 className="font-display text-lg font-semibold">Backup &amp; Restore Center</h2>
          <Badge variant="outline" className="border-white/15 text-[10px] text-muted-foreground">30-day retention</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-background/40 px-3 py-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-[var(--neon-blue)]" />
            <span className="text-muted-foreground">Auto schedule</span>
            <span>Daily · 03:00 IST</span>
            <Switch defaultChecked />
          </div>
          <Button size="sm" className="bg-cta-gradient text-white shadow-glow"><DatabaseBackup className="mr-1.5 h-3.5 w-3.5" />Backup now</Button>
          <Button size="sm" variant="outline" className="border-amber-400/30 text-amber-400"><Wrench className="mr-1.5 h-3.5 w-3.5" />Restore</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-xs">Backup</TableHead>
              <TableHead className="text-xs">Size</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-right text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {backups.map((b) => (
              <TableRow key={b.n} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                <TableCell className="text-sm font-medium">{b.n}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{b.s}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] ${b.t === "Auto" ? "border-sky-500/30 text-sky-400" : "border-fuchsia-500/30 text-fuchsia-400"}`}>{b.t}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`gap-1 text-[10px] ${b.st === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"}`}>
                    {b.st === "ok" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {b.st === "ok" ? "verified" : "checksum review"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/15 text-[11px]"><Download className="mr-1 h-3 w-3" />Download</Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><RefreshCw className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* -------------------- root flow -------------------- */
export function AdminSettingsFlow() {
  return (
    <div className="space-y-4">
      <Topbar />
      <PageHeader />
      <CategoryGrid />
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <GeneralPanel />
          <AppearancePanel />
          <SecurityPanel />
          <ModulesPanel />
          <PaymentsPanel />
          <EmailPanel />
          <StoragePanel />
          <IntegrationsPanel />
        </div>
        <div className="space-y-4 xl:col-span-4">
          <SystemHealth />
          <SecurityActivity />
        </div>
      </div>
      <BackupCenter />
    </div>
  );
}
