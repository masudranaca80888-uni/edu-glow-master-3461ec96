import { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, Sparkles, Menu } from "lucide-react";

export function DashTopbar({ onMenu }: { onMenu?: () => void }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="glass shadow-card-soft sticky top-4 z-30 flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
      <button
        onClick={onMenu}
        className="glass flex h-9 w-9 items-center justify-center rounded-xl lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search subjects, MCQs, notes…"
          className="h-10 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
        />
      </div>

      <button
        onClick={() => setDark((d) => !d)}
        className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button className="glass relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform hover:scale-105">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink)]" />
      </button>

      {/* XP badge */}
      <div className="glass hidden items-center gap-2 rounded-xl px-3 py-1.5 sm:flex">
        <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
        <div className="leading-tight">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Level 12</p>
          <p className="font-display text-xs font-bold text-gradient">8,420 XP</p>
        </div>
      </div>

      <div className="bg-cta-gradient flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-glow">
        M
      </div>
    </header>
  );
}
