import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { NotificationManagerFlow } from "@/components/admin/NotificationManagerFlow";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
  head: () => ({
    meta: [
      { title: "Notification Manager · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Create, schedule and manage announcements, alerts and system notifications across push, email and in-app channels.",
      },
      { property: "og:title", content: "Notification Manager · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "Premium glass admin UI for crafting notifications, scheduling broadcasts and tracking delivery analytics.",
      },
    ],
  }),
});

function AdminNotificationsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-hero-glow opacity-60" />
      <div className="pointer-events-none fixed left-10 top-20 -z-10 h-72 w-72 rounded-full bg-[var(--neon-purple)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-[var(--neon-blue)]/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none fixed left-1/2 top-1/3 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse-glow" />

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-6">
        <AdminSidebar active="Notification Manager" />
        <div className="min-w-0 flex-1 space-y-4">
          <NotificationManagerFlow />
        </div>
      </div>
    </div>
  );
}
