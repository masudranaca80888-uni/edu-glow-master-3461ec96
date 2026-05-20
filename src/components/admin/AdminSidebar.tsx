import {
  LayoutDashboard,
  ListChecks,
  Timer,
  Trophy,
  Layers,
  FileText,
  Database,
  PlayCircle,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const items = [
  { t: "Dashboard", i: LayoutDashboard },
  { t: "MCQ Manager", i: ListChecks },
  { t: "Quiz Manager", i: Timer },
  { t: "Mock Test Manager", i: Trophy },
  { t: "Flash Card Manager", i: Layers },
  { t: "Short Notes Manager", i: FileText },
  { t: "Qns Bank Manager", i: Database },
  { t: "Classes Manager", i: PlayCircle },
  { t: "User Management", i: Users },
  { t: "Notification Manager", i: Bell },
  { t: "Analytics", i: BarChart3 },
  { t: "Settings", i: Settings },
];

export function AdminSidebar({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="glass shadow-card-soft sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="bg-cta-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-tight">
            EduMaster<span className="text-gradient"> Admin</span>
          </p>
          <p className="text-[10px] text-muted-foreground">Control Center · v3.2</p>
        </div>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Manage
        </p>
        <ul className="mt-2 space-y-1">
          {items.map((m) => {
            const isActive = m.t === active;
            return (
              <li key={m.t}>
                <a
                  href="#"
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
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
      </nav>

      <button className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
