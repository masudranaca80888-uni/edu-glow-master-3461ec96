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
let inflightRefresh: Promise<UserSession> | null = null;

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
    if (get().hydrated) return;
    const rawTheme = window.localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
    const theme: "dark" | "light" = rawTheme ?? "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    if (!rawTheme) {
      window.localStorage.setItem(THEME_KEY, theme);
    }
    set({ theme, hydrated: true });
    void get().refreshAuth();

    if (!authSubscribed) {
      authSubscribed = true;
      supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
          set({ user: null, sessionReady: true, authLoading: false, authError: null });
          return;
        }
        // Skip refetch for token refreshes / user-updates when we already
        // have the same user loaded — avoids the double session fetch.
        const current = get().user;
        if (
          (event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || event === "INITIAL_SESSION") &&
          current &&
          current.id === session.user.id
        ) {
          set({ sessionReady: true, authLoading: false });
          return;
        }
        void get().refreshAuth();
      });
    }
  },
  login: (user) => set({ user, sessionReady: true, authLoading: false, authError: null }),
  refreshAuth: async () => {
    if (inflightRefresh) return inflightRefresh;
    inflightRefresh = (async () => {
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
      } finally {
        inflightRefresh = null;
      }
    })();
    return inflightRefresh;
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
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    }
    set({ theme });
  },
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  markNotificationsRead: () => set({ notificationsUnread: 0 }),
  setQuizRuntime: (quizRuntime) => set({ quizRuntime }),
}));
