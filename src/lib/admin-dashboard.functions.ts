import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

export type RecentUpload = {
  id: string;
  title: string;
  kind: "mcq" | "note" | "flash" | "video" | "qbank" | "quiz";
  created_at: string;
  status: string;
};

export type RecentNotification = {
  id: string;
  title: string;
  status: string;
  audience: string;
  created_at: string;
  sent_at: string | null;
};

export type AdminDashboardSnapshot = {
  counters: {
    activeStudents: number;
    totalStudents: number;
    liveExams: number;
    pendingDrafts: number;
    recentUploads24h: number;
    scheduledNotifications: number;
  };
  recentUploads: RecentUpload[];
  recentNotifications: RecentNotification[];
};

export const adminDashboardSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminDashboardSnapshot> => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      profilesActive,
      profilesTotal,
      liveExams,
      mcqDrafts,
      noteDrafts,
      flashDrafts,
      videoDrafts,
      qbankDrafts,
      quizDrafts,
      scheduledNotif,
      recentMcqs,
      recentNotes,
      recentFlash,
      recentVideos,
      recentQbank,
      recentQuiz,
      recentNotifs,
    ] = await Promise.all([
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb.from("exam_attempts").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
      sb.from("mcqs").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("short_notes").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("flash_cards").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("video_classes").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("question_bank_resources").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("quizzes").select("id", { count: "exact", head: true }).eq("status", "draft"),
      sb.from("notifications").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
      sb.from("mcqs").select("id,question,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("short_notes").select("id,title,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("flash_cards").select("id,front,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("video_classes").select("id,title,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("question_bank_resources").select("id,title,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("quizzes").select("id,title,created_at,status").order("created_at", { ascending: false }).limit(5),
      sb.from("notifications").select("id,title,status,audience,created_at,sent_at").order("created_at", { ascending: false }).limit(8),
    ]);

    const pendingDrafts =
      (mcqDrafts.count ?? 0) +
      (noteDrafts.count ?? 0) +
      (flashDrafts.count ?? 0) +
      (videoDrafts.count ?? 0) +
      (qbankDrafts.count ?? 0) +
      (quizDrafts.count ?? 0);

    const ups: RecentUpload[] = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentMcqs.data ?? []).map((r: any) => ({ id: r.id, title: r.question?.slice(0, 80) ?? "MCQ", kind: "mcq" as const, created_at: r.created_at, status: r.status })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentNotes.data ?? []).map((r: any) => ({ id: r.id, title: r.title, kind: "note" as const, created_at: r.created_at, status: r.status })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentFlash.data ?? []).map((r: any) => ({ id: r.id, title: r.front?.slice(0, 80) ?? "Flash card", kind: "flash" as const, created_at: r.created_at, status: r.status })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentVideos.data ?? []).map((r: any) => ({ id: r.id, title: r.title, kind: "video" as const, created_at: r.created_at, status: r.status })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentQbank.data ?? []).map((r: any) => ({ id: r.id, title: r.title, kind: "qbank" as const, created_at: r.created_at, status: r.status })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(recentQuiz.data ?? []).map((r: any) => ({ id: r.id, title: r.title, kind: "quiz" as const, created_at: r.created_at, status: r.status })),
    ]
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      .slice(0, 10);

    const recentUploads24h = ups.filter((u) => u.created_at >= dayAgo).length;

    return {
      counters: {
        activeStudents: profilesActive.count ?? 0,
        totalStudents: profilesTotal.count ?? 0,
        liveExams: liveExams.count ?? 0,
        pendingDrafts,
        recentUploads24h,
        scheduledNotifications: scheduledNotif.count ?? 0,
      },
      recentUploads: ups,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentNotifications: (recentNotifs.data ?? []) as any,
    };
  });
