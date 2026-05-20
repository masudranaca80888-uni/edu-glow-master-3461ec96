import { createFileRoute } from "@tanstack/react-router";
import { UserManagementFlow } from "@/components/admin/UserManagementFlow";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
  head: () => ({
    meta: [
      { title: "User Management · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Manage students, admins, permissions, subscriptions and platform activity from the EduMaster Pro identity control center.",
      },
      { property: "og:title", content: "User Management · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "User table, profile drawer, role permissions, bulk import and engagement analytics for administrators.",
      },
    ],
  }),
});

function AdminUsersPage() {
  return <UserManagementFlow />;
}
