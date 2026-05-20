import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smartphone, RefreshCw, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { NeonButton, OtpInput } from "@/components/auth/AuthPrimitives";

export const Route = createFileRoute("/verify-otp")({
  component: VerifyOtp,
  head: () => ({
    meta: [
      { title: "Verify OTP · EduMaster Pro" },
      { name: "description", content: "Enter the 6-digit code to verify your identity." },
      { property: "og:title", content: "Verify OTP · EduMaster Pro" },
      { property: "og:description", content: "Two-step verification keeps your account secure." },
    ],
  }),
});

function VerifyOtp() {
  const [code, setCode] = useState("");
  const [t, setT] = useState(45);
  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT(t - 1), 1000);
    return () => clearTimeout(id);
  }, [t]);
  const complete = code.length === 6;
  return (
    <AuthShell>
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-[0_0_30px_var(--neon-purple)] animate-pulse-glow">
        <Smartphone className="h-6 w-6" />
      </div>
      <h2 className="text-center font-display text-3xl font-bold tracking-tight">Verify OTP</h2>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Enter the 6-digit verification code sent to <span className="font-semibold text-foreground">+91 ••• ••• 4210</span>
      </p>

      <div className="mt-7">
        <OtpInput value={code} onChange={setCode} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> End-to-end encrypted
        </span>
        <span className={t > 0 ? "font-mono text-muted-foreground" : "font-mono text-rose-400"}>
          {t > 0 ? `00:${t.toString().padStart(2, "0")}` : "expired"}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <NeonButton type="submit" className={complete ? "" : "opacity-60"}>
          {complete ? "Verify & continue" : "Awaiting code…"}
        </NeonButton>
        <button
          type="button"
          onClick={() => setT(45)}
          disabled={t > 0}
          className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-[var(--neon-blue)] disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Resend code
        </button>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        Wrong number?{" "}
        <Link to="/signup" className="font-semibold text-[var(--neon-blue)] hover:underline">
          Update profile
        </Link>
      </p>
    </AuthShell>
  );
}
