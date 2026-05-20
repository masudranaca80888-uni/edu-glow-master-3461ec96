import { createFileRoute } from "@tanstack/react-router";
import { VideoClassesManagerFlow } from "@/components/admin/VideoClassesManagerFlow";

export const Route = createFileRoute("/admin/classes")({
  component: AdminClassesPage,
  head: () => ({
    meta: [
      { title: "Video Classes Manager · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Upload, organize and manage premium chapter-wise video lessons from the EduMaster Pro admin streaming studio.",
      },
      { property: "og:title", content: "Video Classes Manager · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "Class creator, playlist manager, cinematic player preview and streaming analytics for administrators.",
      },
    ],
  }),
});

function AdminClassesPage() {
  return <VideoClassesManagerFlow />;
}
