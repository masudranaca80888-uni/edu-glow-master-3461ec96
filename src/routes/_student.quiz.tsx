import { createFileRoute } from "@tanstack/react-router";
import { DashSidebar } from "@/components/dashboard/DashSidebar";
import { DashTopbar } from "@/components/dashboard/DashTopbar";
import { QuizFlow } from "@/components/dashboard/QuizFlow";

export const Route = createFileRoute("/_student/quiz")({
  component: QuizPage,
  head: () => ({
    meta: [
      { title: "Quiz · EduMaster Pro" },
      { name: "description", content: "Timer-based 10 MCQ quizzes with instant scoring, accuracy and review." },
    ],
  }),
});

function QuizPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="pointer-events-none fixed left-10 top-20 -z-10 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-[var(--neon-blue)]/20 blur-3xl animate-pulse-glow" />

      <div className="mx-auto flex max-w-[1500px] gap-4 px-4 py-4 sm:px-6">
        <DashSidebar active="Quiz" />
        <div className="min-w-0 flex-1 space-y-4">
          <DashTopbar />
          <QuizFlow />
        </div>
      </div>
    </div>
  );
}
