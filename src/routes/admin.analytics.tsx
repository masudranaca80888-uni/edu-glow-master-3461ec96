import { createFileRoute } from "@tanstack/react-router";
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
  return <AnalyticsReportsFlow />;
}
