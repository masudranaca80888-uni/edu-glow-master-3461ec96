import { create } from "zustand";
import type { AppRole } from "@/lib/app-data";
import { supabase } from "@/integrations/supabase/client";
import { fetchSessionUser, signOut, type AuthUser } from "@/lib/auth-client";

type UserSession = AuthUser | null;

type AppState = {
  user: UserSession;
  sessionReady: boolean;
  authLoading: boolean;
  authError: string | null;
  theme: "dark" | "light";
  sidebarOpen: boolean;
  notificationsUnread: number;
  quizRuntime: { active: boolean; score: number; answered: number };
  hydrated: boolean;
  hydrate: () => void;
  login: (user: NonNullable<UserSession>) => void;
  refreshAuth: () => Promise<UserSession>;
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
  sessionReady: false,
  authLoading: true,
  authError: null,
  theme: "dark",
  sidebarOpen: false,
  notificationsUnread: 7,
  quizRuntime: { active: false, score: 0, answered: 0 },
  hydrated: false,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const rawTheme = window.localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const theme: "dark" | "light" = rawTheme ?? "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    if (!rawTheme) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
    set({ theme });

    set({ hydrated: true });
    void get().refreshAuth();

    if (!authSubscribed) {
      authSubscribed = true;
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          set({ user: null, sessionReady: true, authLoading: false, authError: null });
          return;
        }
        setTimeout(() => {
          void get().refreshAuth();
        }, 0);
      });
    }
  },
  login: (user) => set({ user, sessionReady: true, authLoading: false, authError: null }),
  refreshAuth: async () => {
    set({ authLoading: true, authError: null });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const user = await fetchSessionUser(data.session);
      set({ user, sessionReady: true, authLoading: false, authError: null });
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not restore session";
      set({ user: null, sessionReady: true, authLoading: false, authError: message });
      return null;
    }
  },
  logout: async () => {
    set({ authLoading: true });
    await signOut();
    set({ user: null, sessionReady: true, authLoading: false, authError: null, quizRuntime: { active: false, score: 0, answered: 0 } });
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
