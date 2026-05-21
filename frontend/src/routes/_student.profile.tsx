import { createFileRoute } from "@tanstack/react-router";
import { ProfileSettingsFlow } from "@/components/dashboard/ProfileSettingsFlow";

export const Route = createFileRoute("/_student/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile & Settings · EduMaster Pro" },
      {
        name: "description",
        content:
          "Manage your account, appearance, privacy and learning preferences inside the premium EduMaster Pro student portal.",
      },
      { property: "og:title", content: "Profile & Settings · EduMaster Pro" },
      {
        property: "og:description",
        content:
          "Premium glassmorphism profile hub with appearance, notifications, security and learning preference controls.",
      },
    ],
  }),
});

function ProfilePage() {
  return <ProfileSettingsFlow />;
}
