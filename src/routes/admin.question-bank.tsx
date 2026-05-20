import { createFileRoute } from "@tanstack/react-router";
import { QuestionBankManagerFlow } from "@/components/admin/QuestionBankManagerFlow";

export const Route = createFileRoute("/admin/question-bank")({
  component: AdminQuestionBankPage,
  head: () => ({
    meta: [
      { title: "Question Bank Manager · EduMaster Pro Admin" },
      {
        name: "description",
        content:
          "Manage important questions, previous year papers, PDFs and model test resources from the EduMaster Pro admin question bank center.",
      },
      { property: "og:title", content: "Question Bank Manager · EduMaster Pro Admin" },
      {
        property: "og:description",
        content:
          "Resource creator, bulk PDF/DOC import, analytics and publishing controls for the question bank library.",
      },
    ],
  }),
});

function AdminQuestionBankPage() {
  return <QuestionBankManagerFlow />;
}
