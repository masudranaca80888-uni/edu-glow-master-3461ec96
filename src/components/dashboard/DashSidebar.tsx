import { Link, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { studentNavItems } from "@/lib/app-data";
import { useAppStore } from "@/stores/app-store";

export function DashSidebar({ active = "Dashboard" }: { active?: string }) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const logout = useAppStore((s) => s.logout);
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
          {studentNavItems.slice(0, 9).map((m) => {
            const isActive = currentPath === m.to || m.title === active;
            return (
              <li key={m.title}>
                <Link
                  to={m.to as never}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-cta-gradient text-white shadow-glow"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <m.icon className="h-4 w-4" />
                  {m.title}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Account
        </p>
        <ul className="mt-2 space-y-1">
          {studentNavItems.slice(9).map((s) => (
            <li key={s.title}>
              <Link to={s.to as never} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                <s.icon className="h-4 w-4" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button onClick={() => { logout(); toast.success("Logged out"); }} className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
