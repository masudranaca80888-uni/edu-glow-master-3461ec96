import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DashboardPreview } from "./DashboardPreview";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* Background glow */}
      <div className="bg-hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-72 w-72 rounded-full bg-[var(--neon-purple)]/30 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-[var(--neon-blue)]/25 blur-3xl animate-pulse-glow" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8">
        {/* Left */}
        <div className="animate-fade-up">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
            <span>AI-powered smart learning · v3.0</span>
          </div>

          <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Practice.{" "}
            <span className="text-gradient">Learn.</span>{" "}
            Achieve.
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            MCQ Practice, Quiz, Mock Test, Flash Cards, Short Notes & Smart Learning Platform — engineered for students who want to win.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="bg-cta-gradient shadow-glow group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              className="glass inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02]"
            >
              Explore Features
            </Link>
          </div>

          {/* Inline metrics */}
          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { v: "50K+", l: "Students" },
              { v: "1M+", l: "MCQs" },
              { v: "98%", l: "Success" },
            ].map((m) => (
              <div key={m.l}>
                <p className="font-display text-2xl font-bold text-gradient">{m.v}</p>
                <p className="text-xs text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="animate-fade-up [animation-delay:150ms]">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
