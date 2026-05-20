import { createFileRoute } from "@tanstack/react-router";
import { MockTestFlow } from "@/components/dashboard/MockTestFlow";

export const Route = createFileRoute("/_student/mock-test")({
  component: MockTestPage,
  head: () => ({
    meta: [
      { title: "Mock Test Arena · EduMaster Pro" },
      {
        name: "description",
        content:
          "Attempt full-length mock exams created by admins. Compete on the global leaderboard with real-time analytics.",
      },
      { property: "og:title", content: "Mock Test Arena · EduMaster Pro" },
      {
        property: "og:description",
        content: "Premium CBT mock test platform with leaderboards and detailed analytics.",
      },
    ],
  }),
});

function MockTestPage() {
  return <MockTestFlow />;
}
