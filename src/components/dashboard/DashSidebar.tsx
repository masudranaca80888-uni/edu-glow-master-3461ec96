import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Timer,
  SlidersHorizontal,
  Trophy,
  Layers,
  FileText,
  Database,
  PlayCircle,
  Bell,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

const main = [
  { t: "Dashboard", to: "/dashboard", i: LayoutDashboard },
  { t: "MCQ Practice", to: "/dashboard", i: ListChecks },
  { t: "Quiz", to: "/dashboard", i: Timer },
  { t: "Custom Exam", to: "/dashboard", i: SlidersHorizontal },
  { t: "Mock Test", to: "/dashboard", i: Trophy },
  { t: "Flash Cards", to: "/dashboard", i: Layers },
  { t: "Short Notes", to: "/dashboard", i: FileText },
  { t: "Qns Bank", to: "/dashboard", i: Database },
  { t: "Video Classes", to: "/dashboard", i: PlayCircle },
];

const secondary = [
  { t: "Notifications", i: Bell },
  { t: "Profile", i: User },
  { t: "Settings", i: Settings },
];

export function DashSidebar({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="glass shadow-card-soft sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
      <Link to="/" className="flex items-center gap-2 px-2 py-2">
        <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">
          EduMaster<span className="text-gradient"> Pro</span>
        </span>
      </Link>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Learning
        </p>
        <ul className="mt-2 space-y-1">
          {main.map((m) => {
            const isActive = m.t === active;
            return (
              <li key={m.t}>
                <a
                  href="#"
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-cta-gradient text-white shadow-glow"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <m.i className="h-4 w-4" />
                  {m.t}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </p>
        <ul className="mt-2 space-y-1">
          {secondary.map((s) => (
            <li key={s.t}>
              <a
                href="#"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <s.i className="h-4 w-4" />
                {s.t}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
