import { Link } from "@tanstack/react-router";
import { Search, Bell, Sun, Moon, Sparkles, Menu } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

export function DashTopbar({ onMenu }: { onMenu?: () => void }) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const unread = useAppStore((s) => s.notificationsUnread);
  const user = useAppStore((s) => s.user);
  const initial = (user?.name ?? "Learner").charAt(0).toUpperCase();

  return (
    <header className="glass shadow-card-soft sticky top-4 z-30 flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
      <button
        type="button"
        onClick={onMenu}
        className="glass flex h-9 w-9 items-center justify-center rounded-xl lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search subjects, MCQs, notes…"
          className="h-10 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
        />
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <Link
        to="/notifications"
        className="glass relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cta-gradient px-1 text-[9px] font-bold text-white shadow-glow">
            {unread}
          </span>
        )}
      </Link>

      <div className="glass hidden items-center gap-2 rounded-xl px-3 py-1.5 sm:flex">
        <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Level 12</p>
          <p className="font-display text-xs font-bold text-gradient">8,420 XP</p>
        </div>
      </div>

      <Link
        to="/profile"
        aria-label="Profile"
        className="bg-cta-gradient flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-glow transition-transform hover:scale-105"
      >
        {initial}
      </Link>
    </header>
  );
}
