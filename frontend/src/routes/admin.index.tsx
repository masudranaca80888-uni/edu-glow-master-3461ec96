import { createFileRoute } from "@tanstack/react-router";
import { AdminFlow } from "@/components/admin/AdminFlow";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard · EduMaster Pro" },
      {
        name: "description",
        content:
          "Open the EduMaster Pro admin dashboard for live metrics, activity, quick actions and platform status.",
      },
      { property: "og:title", content: "Admin Dashboard · EduMaster Pro" },
      {
        property: "og:description",
        content:
          "Live metrics, content operations and platform controls for EduMaster Pro administrators.",
      },
    ],
  }),
});

function AdminDashboardPage() {
  return <AdminFlow />;
}