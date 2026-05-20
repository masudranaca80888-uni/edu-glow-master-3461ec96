import { createFileRoute } from "@tanstack/react-router";
import { DashSidebar } from "@/components/dashboard/DashSidebar";
import { DashTopbar } from "@/components/dashboard/DashTopbar";
import { ShortNotesFlow } from "@/components/dashboard/ShortNotesFlow";

export const Route = createFileRoute("/short-notes")({
  component: ShortNotesPage,
  head: () => ({
    meta: [
      { title: "Smart Short Notes · EduMaster Pro" },
      {
        name: "description",
        content:
          "Quick chapter-wise short notes for fast revision. Search, bookmark, zoom and download as PDF.",
      },
      { property: "og:title", content: "Smart Short Notes · EduMaster Pro" },
      {
        property: "og:description",
        content:
          "Premium glassmorphism reading experience with text/PDF modes, highlights and AI-recommended notes.",
      },
    ],
  }),
});

function ShortNotesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="pointer-events-none fixed left-10 top-20 -z-10 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-[var(--neon-blue)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed left-1/2 top-1/3 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse-glow" />

      <div className="mx-auto flex max-w-[1500px] gap-4 px-4 py-4 sm:px-6">
        <DashSidebar active="Short Notes" />
        <div className="min-w-0 flex-1 space-y-4">
          <DashTopbar />
          <ShortNotesFlow />
        </div>
      </div>
    </div>
  );
}
