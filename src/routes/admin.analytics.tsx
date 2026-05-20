import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AnalyticsReportsFlow } from "@/components/admin/AnalyticsReportsFlow";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalyticsPage,
  head: () => ({
    meta: [
      { title: "Analytics & Reports · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Track student performance, engagement and platform growth with advanced analytics, AI insights and exportable reports.",
      },
      { property: "og:title", content: "Analytics & Reports · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "KPI grid, growth charts, subject performance donut, exam heatmaps, live performance feed and report generator.",
      },
    ],
  }),
});

function AdminAnalyticsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="pointer-events-none fixed left-10 top-20 -z-10 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-[var(--neon-blue)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed left-1/2 top-1/3 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse-glow" />

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-6">
        <AdminSidebar active="Analytics" />
        <div className="min-w-0 flex-1 space-y-4">
          <AnalyticsReportsFlow />
        </div>
      </div>
    </div>
  );
}
