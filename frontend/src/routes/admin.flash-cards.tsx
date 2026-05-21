import { createFileRoute } from "@tanstack/react-router";
import { FlashCardManagerFlow } from "@/components/admin/FlashCardManagerFlow";

export const Route = createFileRoute("/admin/flash-cards")({
  component: AdminFlashCardsPage,
  head: () => ({
    meta: [
      { title: "Flash Card Manager · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Create, organize and manage smart revision flash cards from the premium EduMaster Pro admin control center.",
      },
      { property: "og:title", content: "Flash Card Manager · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "Flash card builder, bulk import, analytics and publishing controls for administrators.",
      },
    ],
  }),
});

function AdminFlashCardsPage() {
  return <FlashCardManagerFlow />;
}
