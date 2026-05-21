import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, User, Phone, Sparkles, GraduationCap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  NeoInput,
  PasswordInput,
  NeonButton,
  Divider,
  FieldLabel,
  StrengthMeter,
} from "@/components/auth/AuthPrimitives";
import { useAppStore } from "@/stores/app-store";
import { signUpWithEmail } from "@/lib/auth-client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/signup")({
  component: StudentSignup,
  head: () => ({
    meta: [
      { title: "Sign Up · EduMaster Pro" },
      { name: "description", content: "Create your EduMaster Pro account and start learning smarter today." },
      { property: "og:title", content: "Sign Up · EduMaster Pro" },
      { property: "og:description", content: "AI-personalized study paths, mock tests and adaptive practice." },
    ],
  }),
});

const LEVELS = [
  { key: "certificate", label: "Certificate", desc: "Foundation track" },
  { key: "professional", label: "Professional", desc: "Career-ready" },
  { key: "advanced", label: "Advanced", desc: "Mastery tier" },
];

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

function StudentSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("professional");
  const refreshAuth = useAppStore((s) => s.refreshAuth);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your full name");
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== pw2) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await signUpWithEmail({ email: email.trim(), password: pw, displayName: name.trim(), phone: phone.trim() || undefined, level });
      const user = await refreshAuth();
      if (user) {
        toast.success("Account created. Welcome aboard!");
        navigate({ to: "/dashboard" });
      } else {
        toast.success("Account created. Please sign in to continue.");
        navigate({ to: "/login" });
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Sign-up failed");
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
      <h2 className="font-display text-3xl font-bold tracking-tight">Create your account</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join the future of smart education.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <FieldLabel>Full name</FieldLabel>
          <NeoInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" icon={<User className="h-4 w-4" />} />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <NeoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" icon={<Mail className="h-4 w-4" />} />
        </div>
        <div>
          <FieldLabel>Phone (optional)</FieldLabel>
          <NeoInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" icon={<Phone className="h-4 w-4" />} />
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <PasswordInput value={pw} onChange={setPw} />
          <StrengthMeter value={pw} />
        </div>
        <div>
          <FieldLabel>Confirm password</FieldLabel>
          <PasswordInput value={pw2} onChange={setPw2} />
          {pw2.length > 0 && pw !== pw2 && (
            <p className="mt-1 text-[11px] text-rose-400">Passwords do not match.</p>
          )}
        </div>

        <div>
          <FieldLabel>Select level</FieldLabel>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => {
              const active = level === l.key;
              return (
                <button
                  type="button"
                  key={l.key}
                  onClick={() => setLevel(l.key)}
                  className={`rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-[var(--neon-purple)] bg-gradient-to-br from-[var(--neon-purple)]/15 to-[var(--neon-blue)]/10 shadow-[0_0_24px_-6px_var(--neon-purple)]"
                      : "border-border bg-background/40 hover:border-[var(--neon-blue)]"
                  }`}
                >
                  <p className="text-xs font-semibold">{l.label}</p>
                  <p className="text-[10px] text-muted-foreground">{l.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <NeonButton type="submit" disabled={loading}>
          <Sparkles className="h-4 w-4" /> {loading ? "Creating account…" : "Create account"}
        </NeonButton>

        <Divider>Or</Divider>
        <NeonButton type="button" variant="ghost" disabled={loading} onClick={onGoogle}>
          <GoogleIcon /> Continue with Google
        </NeonButton>
      </form>

      <div className="mt-5 flex gap-2">
        {[
          { icon: GraduationCap, t: "+12 courses unlocked" },
          { icon: Trophy, t: "Welcome XP bonus" },
        ].map((b, i) => (
          <div key={i} className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
            <b.icon className="h-4 w-4 text-[var(--neon-purple)]" />
            <span className="text-[11px] font-medium">{b.t}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[var(--neon-blue)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
