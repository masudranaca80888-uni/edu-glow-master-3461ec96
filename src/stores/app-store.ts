import { create } from "zustand";
import type { AppRole } from "@/lib/app-data";

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
  logout: () => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  markNotificationsRead: () => void;
  setQuizRuntime: (quizRuntime: AppState["quizRuntime"]) => void;
};

const SESSION_KEY = "edumaster.session";
const THEME_KEY = "edumaster.theme";

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  theme: "dark",
  sidebarOpen: false,
  notificationsUnread: 7,
  quizRuntime: { active: false, score: 0, answered: 0 },
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    const rawTheme = window.localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const user = rawSession ? (JSON.parse(rawSession) as UserSession) : null;
    const theme = rawTheme ?? get().theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ user, theme, hydrated: true });
  },
  login: (user) => {
    if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
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