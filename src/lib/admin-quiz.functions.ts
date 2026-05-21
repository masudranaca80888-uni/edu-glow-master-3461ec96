import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const statusEnum = z.enum(["draft", "published", "archived"]);
const difficultyEnum = z.enum(["easy", "medium", "hard"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

// ---------- List quizzes ----------
const listInput = z.object({
  search: z.string().trim().max(200).optional(),
  status: statusEnum.optional(),
  level: z.string().trim().max(40).optional(),
  subjectId: z.string().uuid().optional(),
  chapterId: z.string().uuid().optional(),
  kind: z.enum(["quiz", "mock", "all"]).default("quiz"),
  page: z.number().int().min(1).max(2000).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const adminListQuizzes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof listInput>) => listInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = context.supabase
      .from("quizzes")
      .select(
        "id,title,description,level,subject_id,chapter_id,kind,status,difficulty,total_questions,duration_seconds,starts_at,ends_at,is_public,created_at,updated_at",
        { count: "exact" },
      )
      .order("updated_at", { ascending: false })
      .range(from, to);
    if (data.kind !== "all") q = q.eq("kind", data.kind);
    if (data.status) q = q.eq("status", data.status);
    if (data.level) q = q.eq("level", data.level);
    if (data.subjectId) q = q.eq("subject_id", data.subjectId);
    if (data.chapterId) q = q.eq("chapter_id", data.chapterId);
    if (data.search) q = q.ilike("title", `%${data.search}%`);
    const { data: rows, error, count } = await q;
    if (error) throw error;
    return { rows: rows ?? [], count: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

// ---------- Stats ----------
export const adminQuizStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const [total, pub, draft, archived, attempts] = await Promise.all([
      sb.from("quizzes").select("id", { count: "exact", head: true }).eq("kind", "quiz"),
      sb.from("quizzes").select("id", { count: "exact", head: true }).eq("kind", "quiz").eq("status", "published"),
      sb.from("quizzes").select("id", { count: "exact", head: true }).eq("kind", "quiz").eq("status", "draft"),
      sb.from("quizzes").select("id", { count: "exact", head: true }).eq("kind", "quiz").eq("status", "archived"),
      sb.from("exam_attempts").select("id", { count: "exact", head: true }),
    ]);
    return {
      total: total.count ?? 0,
      published: pub.count ?? 0,
      draft: draft.count ?? 0,
      archived: archived.count ?? 0,
      attempts: attempts.count ?? 0,
    };
  });

// ---------- Create / Update / Delete ----------
const quizInput = z.object({
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().max(500).nullable().optional(),
  level: z.string().trim().min(1).max(40),
  subject_id: z.string().uuid().nullable().optional(),
  chapter_id: z.string().uuid().nullable().optional(),
  kind: z.enum(["quiz", "mock"]).default("quiz"),
  status: statusEnum.default("draft"),
  difficulty: difficultyEnum.default("medium"),
  total_questions: z.number().int().min(1).max(200).default(10),
  duration_seconds: z.number().int().min(30).max(60 * 60 * 6).default(900),
  starts_at: z.string().datetime().nullable().optional(),
  ends_at: z.string().datetime().nullable().optional(),
  is_public: z.boolean().default(true),
  randomize_options: z.boolean().default(false),
  randomize_questions: z.boolean().default(true),
  passing_marks: z.number().int().min(0).max(1000).default(0),
  negative_marking: z.number().min(0).max(10).default(0),
});

export const adminCreateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof quizInput>) => quizInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("quizzes")
      .insert({ ...data, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return row;
  });

const updateQuizInput = quizInput.partial().extend({ id: z.string().uuid() });
export const adminUpdateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof updateQuizInput>) => updateQuizInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("quizzes").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("quizzes").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetQuizStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: z.infer<typeof statusEnum> }) =>
    z.object({ id: z.string().uuid(), status: statusEnum }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("quizzes").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDuplicateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const { data: src, error } = await sb.from("quizzes").select("*").eq("id", data.id).single();
    if (error) throw error;
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = src;
    void _id; void _c; void _u;
    const { data: row, error: ie } = await sb
      .from("quizzes")
      .insert({ ...rest, title: `${rest.title} (Copy)`, status: "draft", created_by: context.userId })
      .select("id")
      .single();
    if (ie) throw ie;
    // copy quiz_questions
    const { data: qqs } = await sb.from("quiz_questions").select("mcq_id,position").eq("quiz_id", data.id);
    if (qqs?.length) {
      await sb.from("quiz_questions").insert(qqs.map((q: { mcq_id: string; position: number }) => ({ ...q, quiz_id: row.id })));
    }
    return row;
  });

// ---------- Quiz questions ----------
export const adminGetQuizQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { quizId: string }) => z.object({ quizId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("quiz_questions")
      .select("id,mcq_id,position")
      .eq("quiz_id", data.quizId)
      .order("position", { ascending: true });
    if (error) throw error;
    return rows ?? [];
  });

export const adminSetQuizQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { quizId: string; mcqIds: string[] }) =>
    z.object({
      quizId: z.string().uuid(),
      mcqIds: z.array(z.string().uuid()).max(500),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    await sb.from("quiz_questions").delete().eq("quiz_id", data.quizId);
    if (data.mcqIds.length) {
      const rows = data.mcqIds.map((mcq_id, i) => ({ quiz_id: data.quizId, mcq_id, position: i }));
      const { error } = await sb.from("quiz_questions").insert(rows);
      if (error) throw error;
    }
    await sb.from("quizzes").update({ total_questions: data.mcqIds.length }).eq("id", data.quizId);
    return { ok: true, count: data.mcqIds.length };
  });
