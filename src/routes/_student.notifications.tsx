import { createFileRoute } from "@tanstack/react-router";
import { NotificationsFlow } from "@/components/dashboard/NotificationsFlow";

export const Route = createFileRoute("/_student/notifications")({
  component: NotificationsPage,
  head: () => ({
    meta: [
      { title: "Notifications Center · EduMaster Pro" },
      {
        name: "description",
        content:
          "Stay updated with exams, announcements, results and learning activities in your premium glass notifications center.",
      },
      { property: "og:title", content: "Notifications Center · EduMaster Pro" },
      {
        property: "og:description",
        content:
          "Glassmorphism notifications hub with filters, activity timeline, pinned alerts and quick actions.",
      },
    ],
  }),
});

function NotificationsPage() {
  return <NotificationsFlow />;
}
