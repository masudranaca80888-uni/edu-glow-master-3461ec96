import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Single source of truth for student performance across all 4 session types
 * (mcq_practice / quiz / mock / custom_exam). Powers the dashboard
 * Performance Center.
 */

const kindEnum = z.enum(["mcq_practice", "quiz", "mock", "custom_exam"]);

const saveSchema = z.object({
  kind: kindEnum,
  quizId: z.string().uuid().nullable().optional(),
  subjectId: z.string().uuid().nullable().optional(),
  chapterId: z.string().uuid().nullable().optional(),
  level: z.string().trim().max(40).nullable().optional(),
  title: z.string().trim().max(200).nullable().optional(),
  durationSeconds: z.number().int().min(0).max(60 * 60 * 6),
  answers: z
    .array(
      z.object({
        mcqId: z.string().uuid(),
        chosen: z.enum(["A", "B", "C", "D"]).nullable(),
        timeMs: z.number().int().min(0).max(60 * 60 * 1000),
      }),
    )
    .max(500),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const saveSessionAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof saveSchema>) => saveSchema.parse(i))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    const ids = data.answers.map((a) => a.mcqId);
    let correctMap = new Map<string, string>();
    if (ids.length) {
      const { data: mcqs, error } = await supabase
        .from("mcqs")
        .select("id,correct_option")
        .in("id", ids);
      if (error) throw error;
      correctMap = new Map((mcqs ?? []).map((m) => [m.id, m.correct_option]));
    }

    let correct = 0;
    const rows = data.answers.map((a) => {
      const isCorrect = a.chosen !== null && correctMap.get(a.mcqId) === a.chosen;
      if (isCorrect) correct++;
      return {
        mcq_id: a.mcqId,
        chosen_option: a.chosen,
        is_correct: isCorrect,
        time_spent_ms: a.timeMs,
      };
    });

    const total = data.answers.length;
    const score = total === 0 ? 0 : Math.round((correct / total) * 100);

    // Compute attempt_number for this user + (quiz | subject+chapter) bucket
    let attemptNumber = 1;
    if (data.quizId) {
      const { count } = await supabase
        .from("exam_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("quiz_id", data.quizId)
        .eq("status", "completed");
      attemptNumber = (count ?? 0) + 1;
    } else if (data.chapterId) {
      const { count } = await supabase
        .from("exam_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("kind", data.kind)
        .eq("chapter_id", data.chapterId)
        .eq("status", "completed");
      attemptNumber = (count ?? 0) + 1;
    }

    const { data: attempt, error: ae } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: userId,
        quiz_id: data.quizId ?? null,
        subject_id: data.subjectId ?? null,
        chapter_id: data.chapterId ?? null,
        level: data.level ?? null,
        kind: data.kind,
        title: data.title ?? null,
        attempt_number: attemptNumber,
        status: "completed",
        completed_at: new Date().toISOString(),
        duration_seconds: data.durationSeconds,
        correct_count: correct,
        total_count: total,
        score,
        meta: (data.meta ?? {}) as never,
      })
      .select("id")
      .single();
    if (ae) throw ae;

    if (rows.length) {
      const { error: ie } = await supabase
        .from("attempt_answers")
        .insert(rows.map((r) => ({ ...r, attempt_id: attempt.id })));
      if (ie) throw ie;
    }

    return { attemptId: attempt.id, correct, total, score, attemptNumber };
  });

/* ------------------------------------------------------------------ */
/*  Performance Center snapshot                                        */
/* ------------------------------------------------------------------ */

type AttemptRow = {
  id: string;
  kind: string;
  status: string;
  quiz_id: string | null;
  subject_id: string | null;
  chapter_id: string | null;
  level: string | null;
  title: string | null;
  score: number;
  correct_count: number;
  total_count: number;
  duration_seconds: number;
  attempt_number: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
};

export const studentPerformanceCenter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const [attemptsR, subjectsR, chaptersR, quizzesR] = await Promise.all([
      supabase
        .from("exam_attempts")
        .select(
          "id,kind,status,quiz_id,subject_id,chapter_id,level,title,score,correct_count,total_count,duration_seconds,attempt_number,started_at,completed_at,created_at",
        )
        .eq("user_id", userId)
        .gte("created_at", since90)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase.from("subjects").select("id,name,color").eq("status", "published"),
      supabase.from("chapters").select("id,name,subject_id").eq("status", "published"),
      supabase.from("quizzes").select("id,title,kind,subject_id,chapter_id,total_questions"),
    ]);

    const attempts = (attemptsR.data ?? []) as AttemptRow[];
    const subjects = subjectsR.data ?? [];
    const chapters = chaptersR.data ?? [];
    const quizzes = quizzesR.data ?? [];

    const subjectMap = new Map(subjects.map((s) => [s.id, s]));
    const chapterMap = new Map(chapters.map((c) => [c.id, c]));
    const quizMap = new Map(quizzes.map((q) => [q.id, q]));

    // resolve subject/chapter from quiz when missing
    const enrich = (a: AttemptRow) => {
      const q = a.quiz_id ? quizMap.get(a.quiz_id) : null;
      const subjectId = a.subject_id ?? q?.subject_id ?? null;
      const chapterId = a.chapter_id ?? q?.chapter_id ?? null;
      return {
        ...a,
        subjectId,
        chapterId,
        subjectName: subjectId ? subjectMap.get(subjectId)?.name ?? null : null,
        chapterName: chapterId ? chapterMap.get(chapterId)?.name ?? null : null,
        quizTitle: q?.title ?? a.title ?? null,
      };
    };
    const enriched = attempts.map(enrich);

    const completed = enriched.filter((a) => a.status === "completed");
    const inProgress = enriched.filter((a) => a.status === "in_progress");

    const now = Date.now();
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const inRange = (iso: string | null, from: Date) =>
      !!iso && new Date(iso).getTime() >= from.getTime();

    const countByKind = (list: typeof enriched, kind: string, from?: Date) =>
      list.filter((a) => a.kind === kind && (!from || inRange(a.completed_at ?? a.created_at, from))).length;

    const kinds = ["mcq_practice", "quiz", "mock", "custom_exam"] as const;
    const summary = kinds.map((k) => ({
      kind: k,
      total: countByKind(completed, k),
      today: countByKind(completed, k, startOfToday),
      week: countByKind(completed, k, startOfWeek),
      month: countByKind(completed, k, startOfMonth),
    }));

    // Accuracy trend (last 14 days)
    const trend: { label: string; date: string; accuracy: number; attempts: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const day = completed.filter((a) => {
        const t = new Date(a.completed_at ?? a.created_at).getTime();
        return t >= d.getTime() && t < next.getTime();
      });
      const t = day.reduce((s, a) => s + (a.total_count ?? 0), 0);
      const c = day.reduce((s, a) => s + (a.correct_count ?? 0), 0);
      trend.push({
        label: d.toLocaleDateString("en", { weekday: "short" }),
        date: d.toISOString().slice(0, 10),
        accuracy: t ? Math.round((c / t) * 100) : 0,
        attempts: day.length,
      });
    }

    // Subject performance
    const subjAgg = new Map<string, { correct: number; total: number; attempts: number }>();
    for (const a of completed) {
      if (!a.subjectId) continue;
      const s = subjAgg.get(a.subjectId) ?? { correct: 0, total: 0, attempts: 0 };
      s.correct += a.correct_count ?? 0;
      s.total += a.total_count ?? 0;
      s.attempts += 1;
      subjAgg.set(a.subjectId, s);
    }
    const subjectPerformance = Array.from(subjAgg.entries())
      .map(([id, v]) => ({
        id,
        name: subjectMap.get(id)?.name ?? "Unknown",
        color: subjectMap.get(id)?.color ?? null,
        accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
        attempts: v.attempts,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const strongestSubject = subjectPerformance[0] ?? null;
    const weakestSubject = subjectPerformance.length
      ? [...subjectPerformance].reverse()[0]
      : null;

    // Weak chapters (lowest accuracy, min 1 attempt)
    const chapAgg = new Map<string, { correct: number; total: number; attempts: number }>();
    for (const a of completed) {
      if (!a.chapterId) continue;
      const s = chapAgg.get(a.chapterId) ?? { correct: 0, total: 0, attempts: 0 };
      s.correct += a.correct_count ?? 0;
      s.total += a.total_count ?? 0;
      s.attempts += 1;
      chapAgg.set(a.chapterId, s);
    }
    const weakChapters = Array.from(chapAgg.entries())
      .map(([id, v]) => ({
        id,
        name: chapterMap.get(id)?.name ?? "Unknown",
        subjectName: chapterMap.get(id)?.subject_id
          ? subjectMap.get(chapterMap.get(id)!.subject_id)?.name ?? null
          : null,
        accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
        attempts: v.attempts,
      }))
      .filter((c) => c.attempts > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // Recent activity (last 12 completed)
    const recent = completed.slice(0, 12).map((a) => ({
      id: a.id,
      kind: a.kind,
      title: a.quizTitle ?? a.chapterName ?? a.subjectName ?? "Session",
      subjectName: a.subjectName,
      chapterName: a.chapterName,
      score: a.score,
      correct: a.correct_count,
      total: a.total_count,
      duration: a.duration_seconds,
      attemptNumber: a.attempt_number,
      completedAt: a.completed_at ?? a.created_at,
    }));

    // Retry / improvement tracking: group by quiz_id or chapter+kind
    const groupKey = (a: typeof enriched[number]) =>
      a.quiz_id ? `q:${a.quiz_id}` : a.chapterId ? `${a.kind}:c:${a.chapterId}` : null;
    const groups = new Map<
      string,
      { key: string; title: string; kind: string; attempts: typeof enriched }
    >();
    for (const a of completed) {
      const k = groupKey(a);
      if (!k) continue;
      const g = groups.get(k) ?? {
        key: k,
        title: a.quizTitle ?? a.chapterName ?? "Session",
        kind: a.kind,
        attempts: [] as typeof enriched,
      };
      g.attempts.push(a);
      groups.set(k, g);
    }
    const improvements = Array.from(groups.values())
      .filter((g) => g.attempts.length >= 2)
      .map((g) => {
        const sorted = [...g.attempts].sort(
          (a, b) =>
            new Date(a.completed_at ?? a.created_at).getTime() -
            new Date(b.completed_at ?? b.created_at).getTime(),
        );
        const first = sorted[0].score ?? 0;
        const last = sorted[sorted.length - 1].score ?? 0;
        return {
          key: g.key,
          title: g.title,
          kind: g.kind,
          attempts: sorted.length,
          firstScore: first,
          latestScore: last,
          delta: last - first,
        };
      })
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 6);

    // Totals
    const totalAnswered = completed.reduce((s, a) => s + (a.total_count ?? 0), 0);
    const totalCorrect = completed.reduce((s, a) => s + (a.correct_count ?? 0), 0);
    const totalDuration = completed.reduce((s, a) => s + (a.duration_seconds ?? 0), 0);
    const overallAccuracy = totalAnswered
      ? Math.round((totalCorrect / totalAnswered) * 1000) / 10
      : 0;
    const avgCompletionSec = completed.length
      ? Math.round(totalDuration / completed.length)
      : 0;

    // Improvement % = (last7 accuracy − previous7 accuracy)
    const last7 = trend.slice(-7);
    const prev7 = trend.slice(0, 7);
    const avg = (arr: typeof trend) => {
      const valid = arr.filter((d) => d.attempts > 0);
      return valid.length
        ? Math.round(valid.reduce((s, d) => s + d.accuracy, 0) / valid.length)
        : 0;
    };
    const improvementPct = avg(last7) - avg(prev7);

    // Continue learning (in-progress + recent unfinished quizzes)
    const continueLearning = inProgress.slice(0, 4).map((a) => ({
      id: a.id,
      kind: a.kind,
      title: a.quizTitle ?? a.chapterName ?? "Session",
      quizId: a.quiz_id,
      chapterId: a.chapterId,
      startedAt: a.started_at,
    }));

    return {
      summary,
      recent,
      improvements,
      weakChapters,
      subjectPerformance,
      strongestSubject,
      weakestSubject,
      trend,
      continueLearning,
      totals: {
        attempts: completed.length,
        inProgress: inProgress.length,
        accuracy: overallAccuracy,
        avgCompletionSec,
        improvementPct,
      },
    };
  });

/* ------------------------------------------------------------------ */
/*  Full attempt history (paginated) + detail                          */
/* ------------------------------------------------------------------ */

const historySchema = z.object({
  kind: kindEnum.optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const listAttemptHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof historySchema>) => historySchema.parse(i ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let q = supabase
      .from("exam_attempts")
      .select(
        "id,kind,status,quiz_id,subject_id,chapter_id,level,title,score,correct_count,total_count,duration_seconds,attempt_number,started_at,completed_at,created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 50);
    if (data.kind) q = q.eq("kind", data.kind);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });
