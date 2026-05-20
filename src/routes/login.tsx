import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowRight, Facebook } from "lucide-react";
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
import { fakeLogin } from "@/lib/mock-backend";

export const Route = createFileRoute("/login")({
  component: StudentLogin,
  head: () => ({
    meta: [
      { title: "Student Login · EduMaster Pro" },
      { name: "description", content: "Sign in to continue your smart learning journey on EduMaster Pro." },
      { property: "og:title", content: "Student Login · EduMaster Pro" },
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
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await fakeLogin({ email: email || "demo@edumaster.pro", password: pw || "demo123", role: "student" });
      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
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
          <FieldLabel>Email or username</FieldLabel>
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

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-border accent-[var(--neon-purple)]" defaultChecked />
          Remember this device for 30 days
        </label>

        <NeonButton type="submit" disabled={loading}>
          {loading ? "Signing in…" : <>Sign in <ArrowRight className="h-4 w-4" /></>}
        </NeonButton>

        <Divider>Or continue with</Divider>

        <div className="grid grid-cols-2 gap-3">
          <NeonButton type="button" variant="ghost" onClick={() => toast.info("Google sign-in coming soon")}>
            <GoogleIcon /> Google
          </NeonButton>
          <NeonButton type="button" variant="ghost" onClick={() => toast.info("Facebook sign-in coming soon")}>
            <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
          </NeonButton>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-[var(--neon-blue)] hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
        {[
          { v: "120k+", l: "Learners" },
          { v: "98%", l: "Pass rate" },
          { v: "24/7", l: "AI tutor" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl bg-muted/40 p-2">
            <p className="font-display text-sm font-semibold">{s.v}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </AuthShell>
  );
}
