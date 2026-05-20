import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Edit3,
  Camera,
  Lock,
  Shield,
  Smartphone,
  History,
  Bell,
  Mail as MailIcon,
  BellRing,
  GraduationCap,
  Globe,
  Target,
  Palette,
  Type,
  Moon,
  Sun,
  Trophy,
  Flame,
  Medal,
  Star,
  Sparkles,
  Activity,
  PlayCircle,
  Download,
  Layers,
  AlertTriangle,
  LogOut,
  Trash2,
  RotateCcw,
  Save,
  KeyRound,
  Check,
} from "lucide-react";

const TABS = [
  { t: "Personal", i: User },
  { t: "Appearance", i: Palette },
  { t: "Notifications", i: Bell },
  { t: "Privacy", i: Shield },
] as const;

type Tab = (typeof TABS)[number]["t"];

export function ProfileSettingsFlow() {
  const [tab, setTab] = useState<Tab>("Personal");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [accent, setAccent] = useState("#a855f7");
  const [fontSize, setFontSize] = useState(16);
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    mock: true,
    quiz: false,
    class: true,
  });
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[var(--neon-blue)]/20 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--neon-blue)]">
            Account · Preferences
          </div>
          <h1 className="font-display mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Profile &amp; <span className="text-gradient">Settings</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage your account, appearance, privacy and learning preferences.
          </p>
        </div>
      </div>

      {/* Profile card */}
      <ProfileCard />

      {/* Stats */}
      <StatsRow />

      {/* Settings layout */}
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Tab pills */}
          <div className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-2">
            {TABS.map((t) => {
              const active = tab === t.t;
              return (
                <button
                  key={t.t}
                  onClick={() => setTab(t.t)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    active
                      ? "bg-cta-gradient text-white shadow-glow"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <t.i className="h-3.5 w-3.5" />
                  {t.t}
                </button>
              );
            })}
            <div className="ml-auto flex gap-2">
              <button className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
              <button className="bg-cta-gradient flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-glow">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
            </div>
          </div>

          {tab === "Personal" && <PersonalPanel />}
          {tab === "Appearance" && (
            <AppearancePanel
              theme={theme}
              setTheme={setTheme}
              accent={accent}
              setAccent={setAccent}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          )}
          {tab === "Notifications" && (
            <NotificationsPanel prefs={prefs} setPrefs={setPrefs} />
          )}
          {tab === "Privacy" && (
            <PrivacyPanel twoFA={twoFA} setTwoFA={setTwoFA} />
          )}
        </div>

        <aside className="space-y-4">
          <LearningPrefsWidget />
          <AchievementsWidget />
          <RecentActivityWidget />
        </aside>
      </div>

      <DangerZone />
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] opacity-70 blur-md" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-fuchsia-500/30 via-purple-500/20 to-sky-500/30 text-2xl font-bold text-white">
            AR
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-cta-gradient shadow-glow">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold">Aarav Reddy</h2>
            <span className="rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300">
              Pro Student
            </span>
            <span className="rounded-full border border-[var(--neon-blue)]/40 bg-[var(--neon-blue)]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
              Level 24
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <InfoRow i={Mail} v="aarav.reddy@edumaster.pro" />
            <InfoRow i={Phone} v="+91 98765 43210" />
            <InfoRow i={Building2} v="Delhi Public School" />
            <InfoRow i={CalendarDays} v="Joined March 14, 2024" />
          </div>
          {/* XP */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                XP Progress · <span className="text-foreground">2,480 / 3,200</span>
              </span>
              <span className="text-fuchsia-300">77%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]"
                style={{ width: "77%" }}
              />
            </div>
          </div>
          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { i: Flame, t: "12-day streak", tint: "from-orange-500/30 to-rose-500/10 text-orange-300 border-orange-400/40" },
              { i: Trophy, t: "Top 5%", tint: "from-amber-500/30 to-yellow-500/10 text-amber-300 border-amber-400/40" },
              { i: Star, t: "Quiz Master", tint: "from-sky-500/30 to-blue-500/10 text-sky-300 border-sky-400/40" },
              { i: Medal, t: "100 Mocks", tint: "from-fuchsia-500/30 to-purple-500/10 text-fuchsia-300 border-fuchsia-400/40" },
            ].map((b) => (
              <span
                key={b.t}
                className={`flex items-center gap-1.5 rounded-full border bg-gradient-to-br px-2.5 py-1 text-[11px] ${b.tint}`}
              >
                <b.i className="h-3 w-3" /> {b.t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button className="bg-cta-gradient flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-glow">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground">
            <KeyRound className="h-4 w-4" /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ i: Icon, v }: { i: typeof Mail; v: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-foreground/60" />
      <span>{v}</span>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { l: "MCQ Practiced", v: "5,842", s: "+128 this week", i: GraduationCap, tint: "text-sky-300" },
    { l: "Mock Tests", v: "112", s: "Avg score 82%", i: Trophy, tint: "text-amber-300" },
    { l: "Study Hours", v: "348 h", s: "12 h this week", i: Activity, tint: "text-fuchsia-300" },
    { l: "Accuracy", v: "87.4%", s: "+2.1% vs last", i: Target, tint: "text-emerald-300" },
    { l: "Rank", v: "#142", s: "Top 5% nationally", i: Sparkles, tint: "text-violet-300" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <div
          key={s.l}
          className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10 blur-2xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
              <p className="font-display mt-1 text-2xl font-bold">{s.v}</p>
              <p className="text-[10px] text-muted-foreground">{s.s}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted/40 ${s.tint}`}>
              <s.i className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="glass shadow-card-soft rounded-2xl p-5">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, type = "text", icon: Icon }: { label: string; value?: string; type?: string; icon?: typeof Mail }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type={type}
          defaultValue={value}
          className={`h-10 w-full rounded-xl border border-border/60 bg-background/40 pr-3 text-sm outline-none transition-colors focus:border-[var(--neon-blue)]/60 ${
            Icon ? "pl-9" : "pl-3"
          }`}
        />
      </div>
    </label>
  );
}

function PersonalPanel() {
  return (
    <>
      <Panel title="Personal Information" desc="Update your basic profile details.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value="Aarav Reddy" icon={User} />
          <Field label="Email" value="aarav.reddy@edumaster.pro" icon={Mail} />
          <Field label="Phone" value="+91 98765 43210" icon={Phone} />
          <Field label="Institution" value="Delhi Public School" icon={Building2} />
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-background/30 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cta-gradient text-white shadow-glow">
            <Camera className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-[11px] text-muted-foreground">PNG, JPG up to 4MB. Square images work best.</p>
          </div>
          <button className="rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs">Upload</button>
        </div>
      </Panel>

      <Panel title="Update Password" desc="Use a strong, unique password.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Current" type="password" icon={Lock} />
          <Field label="New" type="password" icon={Lock} />
          <Field label="Confirm" type="password" icon={Lock} />
        </div>
      </Panel>
    </>
  );
}

function AppearancePanel({
  theme,
  setTheme,
  accent,
  setAccent,
  fontSize,
  setFontSize,
}: {
  theme: "dark" | "light";
  setTheme: (v: "dark" | "light") => void;
  accent: string;
  setAccent: (v: string) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
}) {
  const colors = ["#a855f7", "#3b82f6", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
  return (
    <Panel title="Appearance" desc="Customize how EduMaster Pro looks for you.">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setTheme("dark")}
          className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
            theme === "dark"
              ? "border-[var(--neon-purple)]/60 bg-[var(--neon-purple)]/10 shadow-glow"
              : "border-border/60 bg-background/40"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-black text-white">
            <Moon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Dark Mode</p>
            <p className="text-[11px] text-muted-foreground">Deep black + neon glow</p>
          </div>
          {theme === "dark" && <Check className="h-4 w-4 text-fuchsia-300" />}
        </button>
        <button
          onClick={() => setTheme("light")}
          className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
            theme === "light"
              ? "border-[var(--neon-blue)]/60 bg-[var(--neon-blue)]/10 shadow-glow"
              : "border-border/60 bg-background/40"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-white text-amber-500">
            <Sun className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Light Mode</p>
            <p className="text-[11px] text-muted-foreground">Soft lavender + sky</p>
          </div>
          {theme === "light" && <Check className="h-4 w-4 text-sky-300" />}
        </button>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Palette className="h-3.5 w-3.5" /> Theme accent
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={`relative h-9 w-9 rounded-full border transition-transform hover:scale-110 ${
                accent === c ? "border-white/80 ring-2 ring-white/40" : "border-white/10"
              }`}
              style={{ background: c, boxShadow: `0 0 16px ${c}55` }}
            >
              {accent === c && <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5" /> Font size
          </span>
          <span className="text-foreground">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={22}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-[var(--neon-purple)]"
        />
      </div>
    </Panel>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        on ? "bg-cta-gradient shadow-glow" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

function PrefRow({
  i: Icon,
  title,
  desc,
  on,
  onClick,
}: {
  i: typeof Bell;
  title: string;
  desc: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <Toggle on={on} onClick={onClick} />
    </div>
  );
}

function NotificationsPanel({
  prefs,
  setPrefs,
}: {
  prefs: { email: boolean; push: boolean; mock: boolean; quiz: boolean; class: boolean };
  setPrefs: (p: typeof prefs) => void;
}) {
  const toggle = (k: keyof typeof prefs) => setPrefs({ ...prefs, [k]: !prefs[k] });
  return (
    <Panel title="Notification Preferences" desc="Choose what you'd like to hear about.">
      <PrefRow i={MailIcon} title="Email notifications" desc="Weekly digest + important alerts" on={prefs.email} onClick={() => toggle("email")} />
      <PrefRow i={BellRing} title="Push notifications" desc="Realtime alerts in browser & app" on={prefs.push} onClick={() => toggle("push")} />
      <PrefRow i={Trophy} title="Mock test reminders" desc="Get notified before scheduled mocks" on={prefs.mock} onClick={() => toggle("mock")} />
      <PrefRow i={Sparkles} title="Quiz alerts" desc="New quizzes and results readiness" on={prefs.quiz} onClick={() => toggle("quiz")} />
      <PrefRow i={PlayCircle} title="Class updates" desc="New videos & instructor notes" on={prefs.class} onClick={() => toggle("class")} />
    </Panel>
  );
}

function PrivacyPanel({ twoFA, setTwoFA }: { twoFA: boolean; setTwoFA: (v: boolean) => void }) {
  const devices = [
    { d: "MacBook Pro · Safari", loc: "Mumbai, IN", time: "Active now", current: true },
    { d: "iPhone 15 · iOS App", loc: "Mumbai, IN", time: "2h ago" },
    { d: "Windows · Chrome", loc: "Delhi, IN", time: "Yesterday" },
  ];
  return (
    <>
      <Panel title="Security" desc="Protect your account with extra verification.">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-[11px] text-muted-foreground">Use an authenticator app for sign-in codes</p>
          </div>
          <Toggle on={twoFA} onClick={() => setTwoFA(!twoFA)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Current password" type="password" icon={Lock} />
          <Field label="New password" type="password" icon={Lock} />
        </div>
      </Panel>

      <Panel title="Device & Login Activity" desc="Recent sign-ins to your account.">
        <ul className="space-y-2">
          {devices.map((d) => (
            <li
              key={d.d}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40">
                <Smartphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.d}</p>
                <p className="text-[11px] text-muted-foreground">
                  {d.loc} · {d.time}
                </p>
              </div>
              {d.current ? (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
                  This device
                </span>
              ) : (
                <button className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-foreground/80">
                  <History className="h-3 w-3" /> Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

function LearningPrefsWidget() {
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
  const [sel, setSel] = useState<string[]>(["Mathematics", "Physics"]);
  const toggle = (s: string) =>
    setSel((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-[var(--neon-blue)]" />
        <h3 className="text-sm font-semibold">Learning Preferences</h3>
      </div>
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Preferred subjects
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {subjects.map((s) => {
            const on = sel.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${
                  on
                    ? "bg-cta-gradient text-white shadow-glow"
                    : "border border-border/60 bg-background/40 text-foreground/70"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="h-3 w-3" /> Daily study goal
          </span>
          <span className="text-foreground">3h / 4h</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/40">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/60 bg-background/40 p-2.5">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Bell className="h-3 w-3" /> Reminder
          </p>
          <p className="mt-1 text-xs font-semibold">8:00 PM</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/40 p-2.5">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Globe className="h-3 w-3" /> Language
          </p>
          <p className="mt-1 text-xs font-semibold">English (IN)</p>
        </div>
      </div>
    </div>
  );
}

function AchievementsWidget() {
  const items = [
    { i: Trophy, t: "Rank #142", s: "Top 5%", c: "from-amber-500/30 to-yellow-500/10 text-amber-300" },
    { i: Flame, t: "12-Day Streak", s: "Keep going!", c: "from-orange-500/30 to-rose-500/10 text-orange-300" },
    { i: Medal, t: "100 Mocks", s: "Milestone", c: "from-fuchsia-500/30 to-purple-500/10 text-fuchsia-300" },
    { i: Star, t: "Quiz Master", s: "92% acc.", c: "from-sky-500/30 to-blue-500/10 text-sky-300" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-semibold">Achievements</h3>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map((b) => (
          <div
            key={b.t}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${b.c} p-3`}
          >
            <b.i className="h-5 w-5" />
            <p className="mt-1.5 text-xs font-semibold text-foreground">{b.t}</p>
            <p className="text-[10px] text-muted-foreground">{b.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivityWidget() {
  const acts = [
    { i: Trophy, t: "Mock Test · JEE #13", time: "Yesterday" },
    { i: Download, t: "Downloaded Calculus Notes", time: "2d ago" },
    { i: PlayCircle, t: "Watched · Thermodynamics", time: "3d ago" },
    { i: Layers, t: "Reviewed 40 flash cards", time: "4d ago" },
  ];
  return (
    <div className="glass shadow-card-soft rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--neon-purple)]" />
        <h3 className="text-sm font-semibold">Recent Activity</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {acts.map((a) => (
          <li
            key={a.t}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-2.5"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/40">
              <a.i className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{a.t}</p>
              <p className="text-[10px] text-muted-foreground">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DangerZone() {
  return (
    <div className="glass relative overflow-hidden rounded-3xl border border-destructive/30 p-5 shadow-card-soft">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/15 blur-3xl" />
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="font-display text-lg font-semibold text-destructive">Danger Zone</h3>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        These actions are permanent. Proceed with caution.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <DangerCard i={LogOut} title="Logout all devices" desc="Sign out of every active session." cta="Logout all" />
        <DangerCard i={RotateCcw} title="Reset progress" desc="Erase XP, streaks and history." cta="Reset" />
        <DangerCard i={Trash2} title="Delete account" desc="Permanently remove your account." cta="Delete" destructive />
      </div>
    </div>
  );
}

function DangerCard({
  i: Icon,
  title,
  desc,
  cta,
  destructive,
}: {
  i: typeof Trash2;
  title: string;
  desc: string;
  cta: string;
  destructive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="text-[11px] text-muted-foreground">{desc}</p>
      <button
        className={`mt-auto rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
          destructive
            ? "bg-destructive text-destructive-foreground hover:opacity-90"
            : "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
