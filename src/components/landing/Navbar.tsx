import { useEffect, useState } from "react";
import { Moon, Sun, GraduationCap, Menu, X } from "lucide-react";

const links = ["Home", "Features", "Mock Test", "Leaderboard", "Pricing", "Contact"];

export function Navbar() {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <nav className="glass shadow-card-soft flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <a href="#" className="flex items-center gap-2">
          <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            EduMaster<span className="text-gradient"> Pro</span>
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase().replace(/\s/g, "")}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="glass flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-transform hover:scale-105"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#login"
            className="hidden rounded-xl px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
          >
            Login
          </a>
          <a
            href="#signup"
            className="bg-cta-gradient hidden rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            Sign Up
          </a>
          <button
            className="glass flex h-9 w-9 items-center justify-center rounded-xl lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 lg:hidden">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "")}`}
              className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
            >
              {l}
            </a>
          ))}
          <a href="#login" className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted sm:hidden">
            Login
          </a>
          <a href="#signup" className="bg-cta-gradient mt-1 rounded-lg px-3 py-2 text-center text-sm font-semibold text-white sm:hidden">
            Sign Up
          </a>
        </div>
      )}
    </header>
  );
}
