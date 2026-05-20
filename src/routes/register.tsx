import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, User, Phone, Building2, Sparkles, GraduationCap, Trophy } from "lucide-react";
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
import { signUpWithEmail, fetchSessionUser } from "@/lib/mock-backend";

export const Route = createFileRoute("/register")({
  component: StudentRegister,
  head: () => ({
    meta: [
      { title: "Create Student Account · EduMaster Pro" },
      { name: "description", content: "Join the future of smart education with EduMaster Pro." },
      { property: "og:title", content: "Create Student Account · EduMaster Pro" },
      { property: "og:description", content: "AI-personalized study paths, mock tests and adaptive practice." },
    ],
  }),
});

const LEVELS = [
  { key: "certificate", label: "Certificate", desc: "Foundation track" },
  { key: "professional", label: "Professional", desc: "Career-ready" },
  { key: "advanced", label: "Advanced", desc: "Mastery tier" },
];

function StudentRegister() {
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("professional");
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmail({ email, password: pw, displayName: name });
      const user = await fetchSessionUser();
      if (user) {
        login(user);
        toast.success("Account created. Welcome aboard!");
        navigate({ to: "/dashboard" });
      } else {
        toast.success("Check your email to verify your account.");
        navigate({ to: "/login" });
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell variant="student">
      <h2 className="font-display text-3xl font-bold tracking-tight">Create student account</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join the future of smart education.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Full name</FieldLabel>
            <NeoInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" icon={<User className="h-4 w-4" />} />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <NeoInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" icon={<Mail className="h-4 w-4" />} />
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <NeoInput placeholder="+91 98765 43210" icon={<Phone className="h-4 w-4" />} />
          </div>
          <div>
            <FieldLabel>Institution</FieldLabel>
            <NeoInput placeholder="IIT Delhi" icon={<Building2 className="h-4 w-4" />} />
          </div>
        </div>

        <div>
          <FieldLabel>Password</FieldLabel>
          <PasswordInput value={pw} onChange={setPw} />
          <StrengthMeter value={pw} />
        </div>
        <div>
          <FieldLabel>Confirm password</FieldLabel>
          <PasswordInput />
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
        <NeonButton type="button" variant="ghost" onClick={() => toast.info("Google sign-up coming soon")}>Continue with Google</NeonButton>
      </form>

      <div className="mt-5 flex gap-2">
        {[
          { icon: GraduationCap, t: "+12 courses unlocked" },
          { icon: Trophy, t: "Welcome XP bonus" },
        ].map((b, i) => (
          <div
            key={i}
            className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2"
          >
            <b.icon className="h-4 w-4 text-[var(--neon-purple)]" />
            <span className="text-[11px] font-medium">{b.t}</span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Already onboard?{" "}
        <Link to="/login" className="font-semibold text-[var(--neon-blue)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
