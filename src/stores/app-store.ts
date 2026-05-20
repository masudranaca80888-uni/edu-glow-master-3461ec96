import { create } from "zustand";
import type { AppRole } from "@/lib/app-data";
import { supabase } from "@/integrations/supabase/client";
import { fetchSessionUser, signOut } from "@/lib/mock-backend";

type UserSession = { name: string; email: string; role: AppRole } | null;

type AppState = {
  user: UserSession;
  theme: "dark" | "light";
  sidebarOpen: boolean;
  notificationsUnread: number;
  quizRuntime: { active: boolean; score: number; answered: number };
  hydrated: boolean;
  hydrate: () => void;
  login: (user: NonNullable<UserSession>) => void;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  setQuizRuntime: (quizRuntime: AppState["quizRuntime"]) => void;
};

const THEME_KEY = "edumaster.theme";
let authSubscribed = false;

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  theme: "dark",
  sidebarOpen: false,
  notificationsUnread: 7,
  quizRuntime: { active: false, score: 0, answered: 0 },
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const rawTheme = window.localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const theme = rawTheme ?? get().theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });

    // Resolve current Supabase session (if any)
    fetchSessionUser()
      .then((user) => set({ user, hydrated: true }))
      .catch(() => set({ hydrated: true }));

    if (!authSubscribed) {
      authSubscribed = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          set({ user: null });
          return;
        }
        // Defer Supabase calls to avoid deadlocks inside the callback
        setTimeout(() => {
          fetchSessionUser().then((u) => set({ user: u })).catch(() => {});
        }, 0);
      });
    }
  },
  login: (user) => set({ user }),
  logout: async () => {
    await signOut();
    set({ user: null });
  },
  toggleTheme: () => {
    const theme = get().theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    set({ theme });
  },
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  markNotificationsRead: () => set({ notificationsUnread: 0 }),
  setQuizRuntime: (quizRuntime) => set({ quizRuntime }),
}));
