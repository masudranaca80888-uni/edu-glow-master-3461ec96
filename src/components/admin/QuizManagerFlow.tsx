import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Search, Plus, Sparkles, Send, EyeOff, Eye, Trash2, Copy, Filter,
  ListChecks, Timer, CheckCircle2, Activity, Trophy, Loader2, X, Save,
  Clock, Shuffle, Edit3, ArrowUp, ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListQuizzes, adminQuizStats, adminCreateQuiz, adminUpdateQuiz,
  adminDeleteQuiz, adminSetQuizStatus, adminDuplicateQuiz,
  adminGetQuizQuestions, adminSetQuizQuestions,
} from "@/lib/admin-quiz.functions";
import { adminListLevels, adminListSubjects, adminListMcqs } from "@/lib/admin-mcq.functions";
import { adminListChapters } from "@/lib/admin-mcq.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Quiz = {
  id: string; title: string; description: string | null;
  level: string; subject_id: string | null; chapter_id: string | null;
  kind: "quiz" | "mock";
  status: "draft" | "published" | "archived";
  difficulty: "easy" | "medium" | "hard";
  total_questions: number; duration_seconds: number;
  starts_at: string | null; ends_at: string | null;
  is_public: boolean; created_at: string; updated_at: string;
};

const STATUS_TONE: Record<string, string> = {
  published: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  draft: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  archived: "border-rose-400/30 bg-rose-400/10 text-rose-400",
};

export function QuizManagerFlow() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListQuizzes);
  const statsFn = useServerFn(adminQuizStats);
  const levelsFn = useServerFn(adminListLevels);
  const subjectsFn = useServerFn(adminListSubjects);
  const delFn = useServerFn(adminDeleteQuiz);
  const statusFn = useServerFn(adminSetQuizStatus);
  const dupFn = useServerFn(adminDuplicateQuiz);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [creating, setCreating] = useState(false);
  const [builderFor, setBuilderFor] = useState<Quiz | null>(null);

  // realtime: invalidate on any quiz change
  useEffect(() => {
    const ch = supabase
      .channel("quiz-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "quizzes" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-quizzes"] });
        qc.invalidateQueries({ queryKey: ["admin-quiz-stats"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const stats = useQuery({ queryKey: ["admin-quiz-stats"], queryFn: () => statsFn() });
  const levels = useQuery({ queryKey: ["admin-levels"], queryFn: () => levelsFn() });
  const subjects = useQuery({ queryKey: ["admin-subjects"], queryFn: () => subjectsFn() });

  const filteredSubjects = useMemo(() => {
    const all = (subjects.data ?? []) as Array<{ id: string; name: string; level: string }>;
    return level === "all" ? all : all.filter((s) => s.level === level);
  }, [subjects.data, level]);

  const list = useQuery({
    queryKey: ["admin-quizzes", { search, level, subjectId, status, page }],
    queryFn: () =>
      listFn({
        data: {
          search: search || undefined,
          level: level === "all" ? undefined : level,
          subjectId: subjectId === "all" ? undefined : subjectId,
          status: status === "all" ? undefined : (status as Quiz["status"]),
          kind: "quiz",
          page, pageSize: 20,
        },
      }),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-quizzes"] });
    qc.invalidateQueries({ queryKey: ["admin-quiz-stats"] });
  };

  const delM = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Quiz deleted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const statusM = useMutation({
    mutationFn: (v: { id: string; status: Quiz["status"] }) => statusFn({ data: v }),
    onSuccess: (_d, v) => { toast.success(`Quiz ${v.status}`); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const dupM = useMutation({
    mutationFn: (id: string) => dupFn({ data: { id } }),
    onSuccess: () => { toast.success("Quiz duplicated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (list.data?.rows ?? []) as Quiz[];
  const total = list.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 20));

  const subjectName = (id: string | null) =>
    (subjects.data as Array<{ id: string; name: string }> | undefined)?.find((s) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* Header */}
      <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Sparkles className="mr-1 h-3 w-3" /> Quiz Engine
            </Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Quiz <span className="text-gradient">Manager</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Build, publish and schedule chapter-wise timed quizzes. Realtime sync — no refresh needed.
            </p>
          </div>
          <Button className="bg-cta-gradient text-white shadow-glow" onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Quiz
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { l: "Total Quizzes", v: stats.data?.total ?? 0, i: ListChecks, c: "#a855f7" },
          { l: "Published", v: stats.data?.published ?? 0, i: Send, c: "#22d3ee" },
          { l: "Drafts", v: stats.data?.draft ?? 0, i: Edit3, c: "#fbbf24" },
          { l: "Archived", v: stats.data?.archived ?? 0, i: EyeOff, c: "#f472b6" },
          { l: "Total Attempts", v: stats.data?.attempts ?? 0, i: Trophy, c: "#34d399" },
        ].map(({ l, v, i: Icon, c }) => (
          <div key={l} className="glass shadow-card-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${c}22`, color: c }}>
                <Icon className="h-4 w-4" />
              </div>
              <Activity className="h-3 w-3 animate-pulse text-emerald-400" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">{v.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{l}</p>
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="glass shadow-card-soft rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search quizzes by title…"
              className="h-9 rounded-xl pl-9"
            />
          </div>
          <Select value={level} onValueChange={(v) => { setLevel(v); setSubjectId("all"); setPage(1); }}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {((levels.data as Array<{ code: string; name: string }> | undefined) ?? []).map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {filteredSubjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-auto text-[10px]"><Filter className="mr-1 h-3 w-3" />{total} total</Badge>
        </div>
      </section>

      {/* Table */}
      <section className="glass shadow-card-soft overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight">All Quizzes</h3>
            <p className="text-[11px] text-muted-foreground">Page {page} of {totalPages} · live sync</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow" /> Realtime
          </div>
        </div>
        <div className="overflow-x-auto">
          {list.isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : rows.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              No quizzes match the current filters.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-background/30 text-muted-foreground">
                <tr className="text-left">
                  {["Title", "Level", "Subject", "Qns", "Duration", "Status", "Updated", "Actions"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/30 hover:bg-background/40">
                    <td className="px-3 py-3">
                      <p className="font-medium">{r.title}</p>
                      {r.description && <p className="line-clamp-1 text-[10px] text-muted-foreground">{r.description}</p>}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{r.level}</td>
                    <td className="px-3 py-3 text-muted-foreground">{subjectName(r.subject_id)}</td>
                    <td className="px-3 py-3 font-mono">{r.total_questions}</td>
                    <td className="px-3 py-3 text-muted-foreground">{Math.round(r.duration_seconds / 60)}m</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] capitalize ${STATUS_TONE[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <IconBtn title="Edit" onClick={() => setEditing(r)}><Edit3 className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Manage MCQs" onClick={() => setBuilderFor(r)}><ListChecks className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Duplicate" onClick={() => dupM.mutate(r.id)}><Copy className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn
                          title={r.status === "published" ? "Unpublish" : "Publish"}
                          onClick={() => statusM.mutate({ id: r.id, status: r.status === "published" ? "draft" : "published" })}
                        >
                          {r.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
                        </IconBtn>
                        <IconBtn title="Delete" onClick={() => { if (confirm("Delete this quiz?")) delM.mutate(r.id); }}>
                          <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </section>

      {(creating || editing) && (
        <QuizEditorDialog
          quiz={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={invalidate}
          levels={(levels.data as Array<{ code: string; name: string }>) ?? []}
          subjects={(subjects.data as Array<{ id: string; name: string; level: string }>) ?? []}
        />
      )}

      {builderFor && (
        <QuestionPickerDialog
          quiz={builderFor}
          onClose={() => setBuilderFor(null)}
          onSaved={invalidate}
        />
      )}
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-border/40 bg-background/40 p-1.5 hover:border-[var(--neon-purple)]/60 hover:text-[var(--neon-purple)]"
    >
      {children}
    </button>
  );
}

// ============================================================
// Editor dialog
// ============================================================
function QuizEditorDialog({
  quiz, onClose, onSaved, levels, subjects,
}: {
  quiz: Quiz | null;
  onClose: () => void;
  onSaved: () => void;
  levels: Array<{ code: string; name: string }>;
  subjects: Array<{ id: string; name: string; level: string }>;
}) {
  const createFn = useServerFn(adminCreateQuiz);
  const updateFn = useServerFn(adminUpdateQuiz);
  const chaptersFn = useServerFn(adminListChapters);

  const [form, setForm] = useState({
    title: quiz?.title ?? "",
    description: quiz?.description ?? "",
    level: quiz?.level ?? (levels[0]?.code ?? "professional"),
    subject_id: quiz?.subject_id ?? "",
    chapter_id: quiz?.chapter_id ?? "",
    difficulty: quiz?.difficulty ?? "medium",
    total_questions: quiz?.total_questions ?? 10,
    duration_minutes: Math.round((quiz?.duration_seconds ?? 900) / 60),
    is_public: quiz?.is_public ?? true,
    randomize_questions: true,
    status: quiz?.status ?? "draft",
  });

  const filteredSubjects = useMemo(
    () => subjects.filter((s) => s.level === form.level),
    [subjects, form.level],
  );

  const chaptersQ = useQuery({
    queryKey: ["chapters-for", form.subject_id],
    queryFn: () => chaptersFn({ data: { subjectId: form.subject_id } }),
    enabled: !!form.subject_id,
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        level: form.level,
        subject_id: form.subject_id || null,
        chapter_id: form.chapter_id || null,
        kind: "quiz" as const,
        status: form.status as Quiz["status"],
        difficulty: form.difficulty as Quiz["difficulty"],
        total_questions: form.total_questions,
        duration_seconds: form.duration_minutes * 60,
        is_public: form.is_public,
        randomize_questions: form.randomize_questions,
        randomize_options: false,
        passing_marks: 0,
        negative_marking: 0,
      };
      if (quiz) await updateFn({ data: { id: quiz.id, ...payload } });
      else await createFn({ data: payload });
    },
    onSuccess: () => { toast.success(quiz ? "Quiz updated" : "Quiz created"); onSaved(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
          <DialogDescription>Set scope, settings and publish status.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v, subject_id: "", chapter_id: "" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v, chapter_id: "" })}>
              <SelectTrigger><SelectValue placeholder="Choose subject" /></SelectTrigger>
              <SelectContent>
                {filteredSubjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Chapter</Label>
            <Select value={form.chapter_id} onValueChange={(v) => setForm({ ...form, chapter_id: v })} disabled={!form.subject_id}>
              <SelectTrigger><SelectValue placeholder="Choose chapter" /></SelectTrigger>
              <SelectContent>
                {(chaptersQ.data ?? []).map((c: { id: string; name: string }) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as typeof form.difficulty })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label><Timer className="mr-1 inline h-3 w-3" />Total questions</Label>
            <Input type="number" value={form.total_questions} onChange={(e) => setForm({ ...form, total_questions: Math.max(1, Number(e.target.value) || 0) })} />
          </div>
          <div>
            <Label><Clock className="mr-1 inline h-3 w-3" />Duration (minutes)</Label>
            <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: Math.max(1, Number(e.target.value) || 0) })} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Quiz["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2">
            <div className="flex items-center gap-2 text-xs"><Shuffle className="h-3.5 w-3.5" /> Randomize question order</div>
            <Switch checked={form.randomize_questions} onCheckedChange={(v) => setForm({ ...form, randomize_questions: v })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2">
            <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Public to students</div>
            <Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}><X className="mr-1 h-4 w-4" />Cancel</Button>
          <Button className="bg-cta-gradient text-white" disabled={!form.title.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            {quiz ? "Save changes" : "Create quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Question picker dialog
// ============================================================
function QuestionPickerDialog({
  quiz, onClose, onSaved,
}: { quiz: Quiz; onClose: () => void; onSaved: () => void }) {
  const getQ = useServerFn(adminGetQuizQuestions);
  const setQ = useServerFn(adminSetQuizQuestions);
  const mcqList = useServerFn(adminListMcqs);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const initial = useQuery({
    queryKey: ["quiz-questions", quiz.id],
    queryFn: () => getQ({ data: { quizId: quiz.id } }),
  });
  useEffect(() => {
    if (initial.data) setSelected(initial.data.map((q: { mcq_id: string }) => q.mcq_id));
  }, [initial.data]);

  const pool = useQuery({
    queryKey: ["quiz-mcq-pool", quiz.chapter_id, quiz.subject_id, search],
    queryFn: () => mcqList({
      data: {
        chapterId: quiz.chapter_id ?? undefined,
        subjectId: !quiz.chapter_id ? (quiz.subject_id ?? undefined) : undefined,
        search: search || undefined,
        status: "published",
        page: 1, pageSize: 100,
      },
    }),
  });

  const save = useMutation({
    mutationFn: () => setQ({ data: { quizId: quiz.id, mcqIds: selected } }),
    onSuccess: () => { toast.success(`${selected.length} questions saved`); onSaved(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const rows = (pool.data?.rows ?? []) as Array<{ id: string; question: string; difficulty: string; correct_option: string }>;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Questions · {quiz.title}</DialogTitle>
          <DialogDescription>
            Pick MCQs from the published pool. Currently selected: <b>{selected.length}</b>
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search MCQs by text…" className="pl-9" />
        </div>
        <div className="max-h-[55vh] overflow-auto rounded-xl border border-border/60">
          {pool.isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading MCQs…</div>
          ) : rows.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No published MCQs match this scope.</div>
          ) : rows.map((m) => {
            const on = selected.includes(m.id);
            return (
              <label key={m.id} className={`flex cursor-pointer items-start gap-3 border-b border-border/40 p-3 text-xs ${on ? "bg-[var(--neon-purple)]/10" : "hover:bg-background/40"}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(m.id)} className="mt-1 h-4 w-4 accent-[var(--neon-purple)]" />
                <div className="flex-1">
                  <p className="font-medium">{m.question}</p>
                  <div className="mt-1 flex gap-2 text-[10px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{m.difficulty}</span>
                    <span>Answer: <b className="text-primary">{m.correct_option}</b></span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}><X className="mr-1 h-4 w-4" />Cancel</Button>
          <Button className="bg-cta-gradient text-white" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save {selected.length} questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
