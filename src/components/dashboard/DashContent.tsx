import { Link } from "@tanstack/react-router";
import {
  ListChecks,
  Timer,
  Trophy,
  Target,
  Flame,
  PlayCircle,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Bell,
  TrendingUp,
  Clock,
} from "lucide-react";

const stats = [
  { i: ListChecks, l: "MCQs Practiced", v: "12,480", d: "+248 this week", tone: "var(--neon-purple)" },
  { i: Timer, l: "Quiz Completed", v: "186", d: "+12 this week", tone: "var(--neon-blue)" },
  { i: Trophy, l: "Mock Tests", v: "42", d: "+3 this week", tone: "var(--neon-pink)" },
  { i: Target, l: "Accuracy", v: "92.4%", d: "+1.8% vs last", tone: "var(--neon-purple)" },
  { i: Flame, l: "Streak", v: "24 days", d: "Personal best", tone: "var(--neon-blue)" },
];

const bars = [42, 65, 38, 78, 55, 88, 72];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const subjects = [
  { n: "Physics", p: 78, c: "var(--neon-purple)" },
  { n: "Mathematics", p: 64, c: "var(--neon-blue)" },
  { n: "Chemistry", p: 88, c: "var(--neon-pink)" },
  { n: "Biology", p: 52, c: "oklch(0.75 0.15 200)" },
];

const learning = [
  { s: "Physics", c: "Chapter 7 — Optics", p: 62 },
  { s: "Mathematics", c: "Chapter 4 — Calculus", p: 38 },
  { s: "Chemistry", c: "Chapter 9 — Organic", p: 81 },
];

const notifications = [
  { t: "New Mock Test #42 available", s: "Admin · 5m ago", c: "var(--neon-purple)" },
  { t: "Your Physics quiz was graded — 94%", s: "Auto · 1h ago", c: "var(--neon-blue)" },
  { t: "Weekly leaderboard updated", s: "System · 3h ago", c: "var(--neon-pink)" },
];

const actions: { t: string; i: typeof ListChecks; to: "/mcq-practice" | "/quiz" | "/custom-exam" | "/flash-cards" }[] = [
  { t: "Start MCQ Practice", i: ListChecks, to: "/mcq-practice" },
  { t: "Start Quiz", i: Timer, to: "/quiz" },
  { t: "Create Custom Exam", i: SlidersHorizontal, to: "/custom-exam" },
  { t: "Open Flash Cards", i: Layers, to: "/flash-cards" },
];

export function DashContent() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl p-px">
        <div className="bg-cta-gradient absolute inset-0 opacity-90" />
        <div className="relative flex flex-col gap-6 rounded-[calc(theme(borderRadius.3xl)-1px)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-black/20 blur-3xl" />
          <div className="relative text-white">
            <p className="text-xs uppercase tracking-widest text-white/70">Tuesday, May 20</p>
            <h1 className="font-display mt-2 text-3xl font-bold sm:text-4xl">
              Welcome back, Mahfuz <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              You're 2 mock tests away from your monthly goal. One focused session changes everything — let's get it.
            </p>
          </div>
          <div className="relative flex gap-3">
            <Link to="/mcq-practice" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-foreground shadow-card-soft transition-transform hover:scale-[1.03]">
              Resume Learning
            </Link>
            <Link to="/profile" className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
              View Goals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.l}
            className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
              style={{ background: s.tone }}
            />
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, ${s.tone}, oklch(0.55 0.2 270))` }}
            >
              <s.i className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{s.l}</p>
            <p className="font-display mt-1 text-2xl font-bold">{s.v}</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {s.d}
            </p>
          </div>
        ))}
      </section>

      {/* Analytics row */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Weekly chart */}
        <div className="glass shadow-card-soft rounded-3xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Weekly Performance</h3>
              <p className="text-xs text-muted-foreground">Avg accuracy over last 7 days</p>
            </div>
            <div className="glass rounded-xl px-3 py-1.5 text-xs">Last 7 days</div>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-[var(--neon-purple)] to-[var(--neon-blue)] transition-all hover:opacity-90"
                    style={{ height: `${h}%`, boxShadow: "0 -8px 30px -8px var(--neon-purple)" }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress rings */}
        <div className="glass shadow-card-soft rounded-3xl p-5">
          <h3 className="font-display text-lg font-bold">Monthly Goal</h3>
          <p className="text-xs text-muted-foreground">Across all subjects</p>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="relative h-44 w-44">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="dgrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.25 295)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.2 235)" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/40" />
                <circle
                  cx="60" cy="60" r="54"
                  stroke="url(#dgrad)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="339"
                  className="animate-ring"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-display text-3xl font-bold">78%</p>
                <p className="text-[10px] text-muted-foreground">of monthly goal</p>
              </div>
            </div>
            <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
              <div>
                <p className="font-display text-sm font-bold">42</p>
                <p className="text-[10px] text-muted-foreground">Tests</p>
              </div>
              <div>
                <p className="font-display text-sm font-bold">186</p>
                <p className="text-[10px] text-muted-foreground">Quizzes</p>
              </div>
              <div>
                <p className="font-display text-sm font-bold">94h</p>
                <p className="text-[10px] text-muted-foreground">Studied</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject performance + mock test + actions */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="glass shadow-card-soft rounded-3xl p-5 lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Subject Performance</h3>
          <p className="text-xs text-muted-foreground">Accuracy by subject</p>
          <div className="mt-5 space-y-4">
            {subjects.map((s) => (
              <div key={s.n}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.n}</span>
                  <span className="text-muted-foreground">{s.p}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${s.p}%`,
                      background: `linear-gradient(90deg, ${s.c}, oklch(0.7 0.2 260))`,
                      boxShadow: `0 0 12px ${s.c}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock test widget */}
        <div className="relative overflow-hidden rounded-3xl p-px">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-purple)] via-[var(--neon-blue)] to-[var(--neon-pink)] opacity-90" />
          <div className="relative flex h-full flex-col rounded-[calc(theme(borderRadius.3xl)-1px)] bg-background/85 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Upcoming Mock</p>
                <h3 className="font-display mt-1 text-lg font-bold">Physics Full-Length</h3>
              </div>
              <Clock className="h-5 w-5 text-[var(--neon-purple)]" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { v: "01", l: "Days" },
                { v: "06", l: "Hrs" },
                { v: "24", l: "Min" },
                { v: "18", l: "Sec" },
              ].map((c) => (
                <div key={c.l} className="glass rounded-xl py-2 text-center">
                  <p className="font-display text-lg font-bold text-gradient">{c.v}</p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{c.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <p>· 100 questions · 90 minutes</p>
              <p>· 4,820 students registered</p>
            </div>

            <Link to="/mock-test" className="bg-cta-gradient mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
              Join Mock Test <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Continue learning + notifications */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Continue Learning</h3>
            <Link to="/classes" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
            {learning.map((l) => (
              <div
                key={l.s}
                className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--neon-purple)]/20 blur-2xl" />
                <div className="flex items-center gap-3">
                  <div className="bg-cta-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{l.s}</p>
                    <p className="font-display text-sm font-bold">{l.c}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Progress</span>
                    <span>{l.p}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]"
                      style={{ width: `${l.p}%` }}
                    />
                  </div>
                </div>
                <Link to="/classes" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background/40 py-2 text-xs font-semibold transition-colors hover:bg-muted">
                  Resume <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass shadow-card-soft rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Recent Notifications</h3>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="mt-4 space-y-3">
            {notifications.map((n) => (
              <li key={n.t} className="flex items-start gap-3 rounded-xl bg-background/40 p-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: n.c, boxShadow: `0 0 10px ${n.c}` }}
                />
                <div>
                  <p className="text-xs font-medium">{n.t}</p>
                  <p className="text-[10px] text-muted-foreground">{n.s}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="mt-3 w-full rounded-xl border border-border bg-background/40 py-2 text-xs font-semibold transition-colors hover:bg-muted">
            View all notifications
          </button>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h3 className="font-display text-lg font-bold">Quick Actions</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
          {actions.map((a) => (
            <button
              key={a.t}
              className="glass shadow-card-soft group relative overflow-hidden rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--neon-blue)]/20 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="bg-cta-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-glow">
                <a.i className="h-5 w-5" />
              </div>
              <p className="font-display mt-3 text-sm font-bold">{a.t}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-foreground">
                Launch <ArrowRight className="h-3 w-3" />
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
