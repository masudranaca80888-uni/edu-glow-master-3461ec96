import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock, Send, ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { NeoInput, NeonButton, FieldLabel } from "@/components/auth/AuthPrimitives";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
  head: () => ({
    meta: [
      { title: "Forgot Password · EduMaster Pro" },
      { name: "description", content: "Recover your EduMaster Pro account securely." },
      { property: "og:title", content: "Forgot Password · EduMaster Pro" },
      { property: "og:description", content: "Send a recovery link to your inbox in seconds." },
    ],
  }),
});

function ForgotPassword() {
  return (
    <AuthShell>
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white shadow-[0_0_30px_var(--neon-purple)]">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="text-center font-display text-3xl font-bold tracking-tight">Forgot password?</h2>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Recover your account securely — we'll email you a one-time link.
      </p>

      <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <FieldLabel>Account email</FieldLabel>
          <NeoInput type="email" placeholder="you@school.edu" icon={<Mail className="h-4 w-4" />} />
        </div>
        <NeonButton type="submit">
          <Send className="h-4 w-4" /> Send recovery link
        </NeonButton>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-background">
            <Mail className="h-5 w-5 text-[var(--neon-purple)]" />
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              1
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Inbox preview</p>
            <p className="truncate text-[11px] text-muted-foreground">
              EduMaster Pro · Reset your password (expires in 15 min)
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground">now</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
        </div>
      </div>

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--neon-blue)] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>
    </AuthShell>
  );
}
