import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---- Subjects ----
export const listSubjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("subjects")
      .select("id,name,slug,description,icon,color,sort_order")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

// ---- Chapters ----
const chaptersSchema = z.object({ subjectId: z.string().uuid() });

export const listChapters = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof chaptersSchema>) => chaptersSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("chapters")
      .select("id,name,slug,description,sort_order,subject_id")
      .eq("subject_id", data.subjectId)
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return rows ?? [];
  });

// ---- MCQs by chapter ----
const mcqsSchema = z.object({
  chapterId: z.string().uuid(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const listMcqs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof mcqsSchema>) => mcqsSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("mcqs")
      .select(
        "id,question,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty,tags",
      )
      .eq("chapter_id", data.chapterId)
      .eq("status", "published")
      .limit(data.limit ?? 25);
    if (error) throw error;
    return rows ?? [];
  });

// ---- Quizzes ----
const listQuizzesSchema = z
  .object({
    level: z.string().trim().max(40).optional(),
    subjectId: z.string().uuid().nullable().optional(),
    chapterId: z.string().uuid().nullable().optional(),
    kind: z.enum(["quiz", "mock"]).default("quiz"),
  })
  .partial();

export const listQuizzes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof listQuizzesSchema> | undefined) =>
    listQuizzesSchema.parse(i ?? {}),
  )
  .handler(async ({ data, context }) => {
    const kind = data.kind ?? "quiz";
    let q = context.supabase
      .from("quizzes")
      .select(
        "id,title,description,difficulty,total_questions,duration_seconds,subject_id,chapter_id,level,kind,created_at",
      )
      .eq("status", "published")
      .eq("kind", kind)
      .order("created_at", { ascending: false });
    if (data.level) q = q.eq("level", data.level);
    if (data.subjectId) q = q.eq("subject_id", data.subjectId);
    if (data.chapterId) q = q.eq("chapter_id", data.chapterId);
    const { data: rows, error } = await q;
    if (error) throw error;
    const quizIds = (rows ?? []).map((r) => r.id);
    if (!quizIds.length) return [];
    // Only surface quizzes that have at least one assigned question
    const { data: qq, error: qqErr } = await context.supabase
      .from("quiz_questions")
      .select("quiz_id")
      .in("quiz_id", quizIds);
    if (qqErr) throw qqErr;
    const counts = new Map<string, number>();
    for (const r of qq ?? []) {
      counts.set(r.quiz_id, (counts.get(r.quiz_id) ?? 0) + 1);
    }
    return (rows ?? [])
      .filter((r) => (counts.get(r.id) ?? 0) > 0)
      .map((r) => ({ ...r, mcq_count: counts.get(r.id) ?? 0 }));
  });

const quizSchema = z.object({ quizId: z.string().uuid() });

export const getQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof quizSchema>) => quizSchema.parse(i))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const [quizRes, qqRes] = await Promise.all([
      supabase
        .from("quizzes")
        .select(
          "id,title,description,difficulty,total_questions,duration_seconds,subject_id,chapter_id",
        )
        .eq("id", data.quizId)
        .single(),
      supabase
        .from("quiz_questions")
        .select(
          "position,mcq:mcqs(id,question,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty)",
        )
        .eq("quiz_id", data.quizId)
        .order("position", { ascending: true }),
    ]);
    if (quizRes.error) throw quizRes.error;
    if (qqRes.error) throw qqRes.error;

    const questions = (qqRes.data ?? [])
      .map((r) => {
        const mcq = (r as { mcq: Record<string, unknown> | null }).mcq;
        return mcq ? { position: r.position, ...mcq } : null;
      })
      .filter(Boolean);
    return { quiz: quizRes.data, questions };
  });

// ---- Attempts ----
const submitSchema = z.object({
  quizId: z.string().uuid(),
  durationSeconds: z.number().int().min(0).max(60 * 60 * 4),
  answers: z
    .array(
      z.object({
        mcqId: z.string().uuid(),
        chosen: z.enum(["A", "B", "C", "D"]).nullable(),
        timeMs: z.number().int().min(0).max(60 * 60 * 1000),
      }),
    )
    .max(200),
});

export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof submitSchema>) => submitSchema.parse(i))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const userId = context.userId;

    // Resolve correct answers server-side; never trust client.
    const ids = data.answers.map((a) => a.mcqId);
    let correctMap = new Map<string, string>();
    if (ids.length) {
      const { data: mcqs, error: me } = await supabase
        .from("mcqs")
        .select("id,correct_option")
        .in("id", ids);
      if (me) throw me;
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

    const { data: attempt, error: ae } = await supabase
      .from("exam_attempts")
      .insert({
        user_id: userId,
        quiz_id: data.quizId,
        status: "completed",
        completed_at: new Date().toISOString(),
        duration_seconds: data.durationSeconds,
        correct_count: correct,
        total_count: total,
        score,
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

    return { attemptId: attempt.id, correct, total, score };
  });

export const listMyAttempts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("exam_attempts")
      .select(
        "id,quiz_id,status,score,correct_count,total_count,duration_seconds,started_at,completed_at",
      )
      .order("started_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data ?? [];
  });
