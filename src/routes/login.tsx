import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  NeoInput,
  PasswordInput,
  NeonButton,
  Divider,
  FieldLabel,
} from "@/components/auth/AuthPrimitives";
import { useAppStore } from "@/stores/app-store";
import { signInWithEmail } from "@/lib/auth-client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  component: StudentLogin,
  head: () => ({
    meta: [
      { title: "Sign In · EduMaster Pro" },
      { name: "description", content: "Sign in to continue your smart learning journey on EduMaster Pro." },
      { property: "og:title", content: "Sign In · EduMaster Pro" },
      { property: "og:description", content: "Secure access to your AI-personalized study dashboard." },
    ],
  }),
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.9 6.4 29.2 4.5 24 4.5 16.4 4.5 9.9 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5.2 0 9.8-1.9 13.4-5l-6.2-5.1c-2 1.4-4.5 2.2-7.2 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.7 39 16.3 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.5l6.2 5.1c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.4-.3-3.5z" />
    </svg>
  );
}

function StudentLogin() {
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const refreshAuth = useAppStore((s) => s.refreshAuth);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), pw);
      const user = await refreshAuth();
      if (!user) throw new Error("Session not found");
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ to: user.role === "admin" ? "/admin" : "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (result.error) throw new Error(result.error.message ?? "Google sign-in failed");
      if (result.redirected) return;
      const user = await refreshAuth();
      navigate({ to: user?.role === "admin" ? "/admin" : "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message ?? "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell variant="student">
      <h2 className="font-display text-3xl font-bold tracking-tight">Welcome back</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Continue your smart learning journey.
      </p>

      <form className="mt-7 space-y-4" onSubmit={onSubmit}>
        <div>
          <FieldLabel>Email</FieldLabel>
          <NeoInput
            type="email"
            placeholder="you@university.edu"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <FieldLabel>Password</FieldLabel>
            <Link to="/forgot-password" className="text-[11px] font-medium text-[var(--neon-purple)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput value={pw} onChange={setPw} />
        </div>

        <NeonButton type="submit" disabled={loading}>
          {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </NeonButton>

        <Divider>Or</Divider>

        <NeonButton type="button" variant="ghost" disabled={loading} onClick={onGoogle}>
          <GoogleIcon /> Continue with Google
        </NeonButton>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-[var(--neon-blue)] hover:underline">
          Sign up
        </Link>
      </p>

      <Link
        to="/admin-login"
        className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-[var(--neon-purple)]"
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Admin login
      </Link>
    </AuthShell>
  );
}
