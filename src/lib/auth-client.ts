import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/app-data";
import { getDemoSession, clearDemoSession, demoSignIn } from "@/lib/demo-auth";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};

export async function signInWithEmail(email: string, password: string) {
  // Try demo auth first
  try {
    const user = demoSignIn(email, password);
    return { user, session: null };
  } catch {
    // not a demo user — fall through to Supabase
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(input: { email: string; password: string; displayName?: string; phone?: string; level?: string }) {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        ...(input.displayName ? { display_name: input.displayName } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.level ? { level: input.level } : {}),
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function resetPasswordForEmail(email: string) {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function signOut() {
  clearDemoSession();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchSessionUser(session?: Session | null): Promise<AuthUser | null> {
  // Check demo session first
  const demoUser = getDemoSession();
  if (demoUser) return demoUser;

  const resolvedSession = session ?? (await supabase.auth.getSession()).data.session;
  if (!resolvedSession?.user) return null;

  const userId = resolvedSession.user.id;
  const email = resolvedSession.user.email ?? "";
  const [{ data: profile }, { data: roles, error: rolesError }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  if (rolesError) throw rolesError;
  const isAdmin = (roles ?? []).some((r) => r.role === "admin");

  return {
    id: userId,
    name: profile?.display_name ?? email.split("@")[0] ?? "Learner",
    email,
    role: isAdmin ? "admin" : "student",
  };
}
