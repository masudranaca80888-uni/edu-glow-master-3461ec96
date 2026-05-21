import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

const filtersInput = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  level: z.string().trim().max(40).optional(),
  subjectId: z.string().uuid().optional(),
}).partial();

function defaultRange(input: z.infer<typeof filtersInput>) {
  const to = input.to ? new Date(input.to) : new Date();
  const from = input.from ? new Date(input.from) : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export const adminAnalyticsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof filtersInput>) => filtersInput.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const { from, to } = defaultRange(data);
    const fromIso = from.toISOString();
    const toIso = to.toISOString();

    // KPIs in parallel
    const [
      profilesTotal,
      profilesActive,
      newProfiles,
      attemptsAll,
      attemptsCompleted,
      mcqsCount,
      notesCount,
      videosCount,
      flashCount,
      qbCount,
      quizCount,
    ] = await Promise.all([
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
      sb.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", fromIso).lte("created_at", toIso),
      sb.from("exam_attempts").select("id", { count: "exact", head: true }).gte("created_at", fromIso).lte("created_at", toIso),
      sb.from("exam_attempts").select("id,correct_count,total_count,duration_seconds,user_id,quiz_id,created_at").eq("status", "completed").gte("created_at", fromIso).lte("created_at", toIso).limit(2000),
      sb.from("mcqs").select("id", { count: "exact", head: true }),
      sb.from("short_notes").select("id,download_count,view_count", { count: "exact" }).limit(2000),
      sb.from("video_classes").select("id,view_count", { count: "exact" }).limit(2000),
      sb.from("flash_cards").select("id,view_count", { count: "exact" }).limit(2000),
      sb.from("question_bank_resources").select("id,download_count,view_count", { count: "exact" }).limit(2000),
      sb.from("quizzes").select("id", { count: "exact", head: true }),
    ]);

    const completed = (attemptsCompleted.data ?? []) as Array<{ correct_count: number; total_count: number; duration_seconds: number; user_id: string; quiz_id: string; created_at: string }>;
    const totalAnswered = completed.reduce((s, a) => s + (a.total_count ?? 0), 0);
    const totalCorrect = completed.reduce((s, a) => s + (a.correct_count ?? 0), 0);
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    const totalDuration = completed.reduce((s, a) => s + (a.duration_seconds ?? 0), 0);
    const uniqueLearners = new Set(completed.map((a) => a.user_id)).size;
    const avgEngagementSec = uniqueLearners > 0 ? totalDuration / uniqueLearners : 0;

    const noteDownloads = (notesCount.data ?? []).reduce((s, n: { download_count?: number }) => s + (n.download_count ?? 0), 0);
    const qbDownloads = (qbCount.data ?? []).reduce((s, n: { download_count?: number }) => s + (n.download_count ?? 0), 0);
    const videoViews = (videosCount.data ?? []).reduce((s, n: { view_count?: number }) => s + (n.view_count ?? 0), 0);
    const flashViews = (flashCount.data ?? []).reduce((s, n: { view_count?: number }) => s + (n.view_count ?? 0), 0);
    const noteViews = (notesCount.data ?? []).reduce((s, n: { view_count?: number }) => s + (n.view_count ?? 0), 0);

    // Growth: registrations over last 12 months
    const months: { label: string; key: string; start: Date; end: Date }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      months.push({
        label: d.toLocaleString("en", { month: "short" }),
        key: `${d.getFullYear()}-${d.getMonth()}`,
        start: d,
        end: next,
      });
    }
    const { data: regs } = await sb.from("profiles").select("created_at").gte("created_at", months[0].start.toISOString());
    const growth = months.map((m) => ({
      label: m.label,
      registrations: (regs ?? []).filter((r: { created_at: string }) => {
        const t = new Date(r.created_at).getTime();
        return t >= m.start.getTime() && t < m.end.getTime();
      }).length,
    }));

    // Attempts per day (last 14 days) for participation
    const days: { label: string; start: Date; end: Date; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      days.push({ label: d.toLocaleDateString("en", { weekday: "short" }), start: d, end: next, count: 0 });
    }
    const { data: attDaily } = await sb.from("exam_attempts").select("created_at").gte("created_at", days[0].start.toISOString());
    for (const a of (attDaily ?? []) as Array<{ created_at: string }>) {
      const t = new Date(a.created_at).getTime();
      const d = days.find((d) => t >= d.start.getTime() && t < d.end.getTime());
      if (d) d.count++;
    }

    // Subject performance: join attempts -> quizzes -> subjects (manual)
    const { data: subjects } = await sb.from("subjects").select("id,name,color").order("sort_order");
    const { data: quizzes } = await sb.from("quizzes").select("id,subject_id");
    const quizSubj = new Map<string, string>();
    for (const q of (quizzes ?? []) as Array<{ id: string; subject_id: string | null }>) {
      if (q.subject_id) quizSubj.set(q.id, q.subject_id);
    }
    const subjStats = new Map<string, { correct: number; total: number; attempts: number }>();
    for (const a of completed as Array<{ correct_count: number; total_count: number; quiz_id: string }>) {
      const sid = quizSubj.get(a.quiz_id);
      if (!sid) continue;
      const s = subjStats.get(sid) ?? { correct: 0, total: 0, attempts: 0 };
      s.correct += a.correct_count ?? 0;
      s.total += a.total_count ?? 0;
      s.attempts += 1;
      subjStats.set(sid, s);
    }
    const subjectPerformance = (subjects ?? []).map((s: { id: string; name: string; color: string | null }) => {
      const st = subjStats.get(s.id);
      const accPct = st && st.total > 0 ? (st.correct / st.total) * 100 : 0;
      return { id: s.id, name: s.name, color: s.color, accuracy: Math.round(accPct), attempts: st?.attempts ?? 0 };
    });

    // Top students (by sum correct in completed attempts in window)
    const studentMap = new Map<string, { correct: number; total: number; attempts: number }>();
    for (const a of completed) {
      const s = studentMap.get(a.user_id) ?? { correct: 0, total: 0, attempts: 0 };
      s.correct += a.correct_count ?? 0;
      s.total += a.total_count ?? 0;
      s.attempts += 1;
      studentMap.set(a.user_id, s);
    }
    const topIds = Array.from(studentMap.entries())
      .sort((a, b) => b[1].correct - a[1].correct)
      .slice(0, 5)
      .map(([id]) => id);
    const { data: topProfiles } = topIds.length
      ? await sb.from("profiles").select("id,display_name,avatar_url,level").in("id", topIds)
      : { data: [] as Array<{ id: string; display_name: string; avatar_url: string | null; level: string }> };
    const topStudents = topIds.map((id) => {
      const p = (topProfiles ?? []).find((x: { id: string }) => x.id === id);
      const s = studentMap.get(id)!;
      return {
        id,
        name: p?.display_name ?? "Unknown",
        level: p?.level ?? "—",
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
        attempts: s.attempts,
        score: s.correct,
      };
    });

    // Live (last 5 min)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const [liveAttempts, recentAttempters] = await Promise.all([
      sb.from("exam_attempts").select("id", { count: "exact", head: true }).gte("created_at", fiveMinAgo),
      sb.from("exam_attempts").select("user_id").gte("created_at", fiveMinAgo).limit(500),
    ]);
    const liveUsers = new Set(((recentAttempters.data ?? []) as Array<{ user_id: string }>).map((a) => a.user_id)).size;

    return {
      range: { from: fromIso, to: toIso },
      kpis: {
        totalUsers: profilesTotal.count ?? 0,
        activeUsers: profilesActive.count ?? 0,
        newUsers: newProfiles.count ?? 0,
        attempts: attemptsAll.count ?? 0,
        accuracy: Math.round(accuracy * 10) / 10,
        avgEngagementSec: Math.round(avgEngagementSec),
        downloads: noteDownloads + qbDownloads,
        contentItems: (mcqsCount.count ?? 0) + (notesCount.count ?? 0) + (videosCount.count ?? 0) + (flashCount.count ?? 0) + (quizCount.count ?? 0),
      },
      growth,
      participation: days.map((d) => ({ label: d.label, value: d.count })),
      subjectPerformance,
      resources: {
        noteDownloads,
        qbDownloads,
        videoViews,
        flashViews,
        noteViews,
      },
      topStudents,
      live: {
        attempts5m: liveAttempts.count ?? 0,
        users5m: liveUsers,
      },
    };
  });
