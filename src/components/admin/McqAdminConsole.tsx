import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus, Search, Trash2, Edit3, Eye, EyeOff, Loader2, Upload, X, Check, FolderPlus, BookPlus, AlertCircle,
} from "lucide-react";
import {
  adminListSubjects, adminListChapters, adminListMcqs,
  adminCreateMcq, adminUpdateMcq, adminDeleteMcq, adminSetMcqStatus,
  adminCreateSubject, adminCreateChapter, adminBulkImportMcqs,
} from "@/lib/admin-mcq.functions";

type Mcq = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  tags: string[];
  chapter_id: string;
};

type Draft = {
  id?: string;
  chapter_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  tags: string;
};

function emptyDraft(chapterId: string): Draft {
  return {
    chapter_id: chapterId,
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    explanation: "",
    difficulty: "medium",
    status: "published",
    tags: "",
  };
}

export function McqAdminConsole() {
  const qc = useQueryClient();
  const listSubjectsFn = useServerFn(adminListSubjects);
  const listChaptersFn = useServerFn(adminListChapters);
  const listMcqsFn = useServerFn(adminListMcqs);
  const createMcqFn = useServerFn(adminCreateMcq);
  const updateMcqFn = useServerFn(adminUpdateMcq);
  const deleteMcqFn = useServerFn(adminDeleteMcq);
  const setStatusFn = useServerFn(adminSetMcqStatus);
  const createSubjectFn = useServerFn(adminCreateSubject);
  const createChapterFn = useServerFn(adminCreateChapter);
  const bulkImportFn = useServerFn(adminBulkImportMcqs);

  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "draft" | "published" | "archived">("");
  const [difficulty, setDifficulty] = useState<"" | "easy" | "medium" | "hard">("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const subjectsQ = useQuery({ queryKey: ["admin-subjects"], queryFn: () => listSubjectsFn() });
  const chaptersQ = useQuery({
    queryKey: ["admin-chapters", subjectId],
    queryFn: () => listChaptersFn({ data: { subjectId: subjectId! } }),
    enabled: !!subjectId,
  });

  // Auto-pick first subject/chapter
  useEffect(() => {
    if (!subjectId && subjectsQ.data && subjectsQ.data.length) setSubjectId(subjectsQ.data[0].id);
  }, [subjectsQ.data, subjectId]);
  useEffect(() => {
    if (!chapterId && chaptersQ.data && chaptersQ.data.length) setChapterId(chaptersQ.data[0].id);
    if (chapterId && chaptersQ.data && !chaptersQ.data.find((c) => c.id === chapterId)) {
      setChapterId(chaptersQ.data[0]?.id ?? null);
    }
  }, [chaptersQ.data, chapterId]);

  const mcqsQ = useQuery({
    queryKey: ["admin-mcqs", { chapterId, subjectId, search, status, difficulty, page }],
    queryFn: () =>
      listMcqsFn({
        data: {
          chapterId: chapterId ?? undefined,
          subjectId: !chapterId ? subjectId ?? undefined : undefined,
          search: search || undefined,
          status: status || undefined,
          difficulty: difficulty || undefined,
          page,
          pageSize,
        },
      }),
    enabled: !!(chapterId || subjectId),
  });

  const rows = (mcqsQ.data?.rows ?? []) as Mcq[];
  const total = mcqsQ.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [editing, setEditing] = useState<Draft | null>(null);
  const [showBulk, setShowBulk] = useState(false);

  function invalidateAll() {
    qc.invalidateQueries({ queryKey: ["admin-mcqs"] });
  }

  const saveMut = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        chapter_id: d.chapter_id,
        question: d.question.trim(),
        option_a: d.option_a.trim(),
        option_b: d.option_b.trim(),
        option_c: d.option_c.trim(),
        option_d: d.option_d.trim(),
        correct_option: d.correct_option,
        explanation: d.explanation.trim() || null,
        difficulty: d.difficulty,
        status: d.status,
        tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20),
      };
      if (d.id) await updateMcqFn({ data: { id: d.id, ...payload } });
      else await createMcqFn({ data: payload });
    },
    onSuccess: () => { setEditing(null); invalidateAll(); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteMcqFn({ data: { id } }),
    onSuccess: invalidateAll,
  });

  const statusMut = useMutation({
    mutationFn: (vars: { id: string; status: Mcq["status"] }) =>
      setStatusFn({ data: vars }),
    onSuccess: invalidateAll,
  });

  return (
    <div className="space-y-4">
      <div className="glass shadow-card-soft rounded-3xl p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--neon-blue)]">Admin · Content</p>
            <h1 className="font-display mt-1 text-2xl font-bold md:text-3xl">MCQ Management <span className="text-gradient">Console</span></h1>
            <p className="mt-1 text-sm text-muted-foreground">Real CRUD against your Lovable Cloud database. Changes go live immediately.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBulk(true)} disabled={!chapterId} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold disabled:opacity-50">
              <Upload className="h-4 w-4" /> Bulk Import
            </button>
            <button onClick={() => chapterId && setEditing(emptyDraft(chapterId))} disabled={!chapterId} className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
              <Plus className="h-4 w-4" /> New MCQ
            </button>
          </div>
        </div>
      </div>

      <SubjectChapterBar
        subjects={subjectsQ.data ?? []}
        chapters={chaptersQ.data ?? []}
        subjectId={subjectId}
        chapterId={chapterId}
        onSubject={(id) => { setSubjectId(id); setChapterId(null); setPage(1); }}
        onChapter={(id) => { setChapterId(id); setPage(1); }}
        onSubjectCreated={() => qc.invalidateQueries({ queryKey: ["admin-subjects"] })}
        onChapterCreated={() => qc.invalidateQueries({ queryKey: ["admin-chapters", subjectId] })}
        createSubject={createSubjectFn}
        createChapter={createChapterFn}
      />

      {/* Filters */}
      <div className="glass shadow-card-soft flex flex-wrap items-center gap-2 rounded-2xl p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search question text…"
            className="h-10 w-full rounded-xl border border-border/60 bg-background/40 pl-9 pr-3 text-sm outline-none focus:border-[var(--neon-blue)]/60"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }} className="h-10 rounded-xl border border-border/60 bg-background/40 px-3 text-sm">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value as typeof difficulty); setPage(1); }} className="h-10 rounded-xl border border-border/60 bg-background/40 px-3 text-sm">
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass shadow-card-soft overflow-hidden rounded-3xl">
        {mcqsQ.isLoading ? (
          <Loader />
        ) : rows.length === 0 ? (
          <Empty text={chapterId ? "No MCQs in this chapter. Create one or bulk import." : "Pick a chapter to start."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3 w-20">Answer</th>
                  <th className="px-4 py-3 w-24">Difficulty</th>
                  <th className="px-4 py-3 w-28">Status</th>
                  <th className="px-4 py-3 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} className="border-t border-border/60 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 font-medium">{m.question}</p>
                      {m.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.tags.slice(0, 4).map((t) => (
                            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-display font-bold text-gradient">{m.correct_option}</td>
                    <td className="px-4 py-3 capitalize">{m.difficulty}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconBtn title={m.status === "published" ? "Unpublish" : "Publish"} onClick={() => statusMut.mutate({ id: m.id, status: m.status === "published" ? "draft" : "published" })}>
                          {m.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </IconBtn>
                        <IconBtn title="Edit" onClick={() => setEditing({
                          id: m.id, chapter_id: m.chapter_id, question: m.question,
                          option_a: m.option_a, option_b: m.option_b, option_c: m.option_c, option_d: m.option_d,
                          correct_option: m.correct_option as Draft["correct_option"],
                          explanation: m.explanation ?? "", difficulty: m.difficulty, status: m.status,
                          tags: m.tags.join(", "),
                        })}>
                          <Edit3 className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn title="Delete" danger onClick={() => { if (confirm("Delete this MCQ?")) deleteMut.mutate(m.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            <span>{total} MCQs · page {page}/{totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-border bg-background/40 px-3 py-1.5 disabled:opacity-40">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border border-border bg-background/40 px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <EditDialog
          draft={editing}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={() => saveMut.mutate(editing)}
          saving={saveMut.isPending}
          error={saveMut.error as Error | null}
        />
      )}

      {showBulk && chapterId && (
        <BulkImportDialog
          chapterId={chapterId}
          onClose={() => setShowBulk(false)}
          onDone={() => { setShowBulk(false); invalidateAll(); }}
          run={bulkImportFn}
        />
      )}
    </div>
  );
}

/* ---------------- Subject / Chapter bar ---------------- */
function SubjectChapterBar(props: {
  subjects: Array<{ id: string; name: string; status: string }>;
  chapters: Array<{ id: string; name: string; status: string }>;
  subjectId: string | null;
  chapterId: string | null;
  onSubject: (id: string) => void;
  onChapter: (id: string) => void;
  onSubjectCreated: () => void;
  onChapterCreated: () => void;
  createSubject: ReturnType<typeof useServerFn<typeof adminCreateSubject>>;
  createChapter: ReturnType<typeof useServerFn<typeof adminCreateChapter>>;
}) {
  const [showSub, setShowSub] = useState(false);
  const [showCh, setShowCh] = useState(false);
  return (
    <div className="glass shadow-card-soft rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Subject</span>
          {props.subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => props.onSubject(s.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                props.subjectId === s.id ? "bg-cta-gradient text-white shadow-glow" : "border border-border bg-background/40 text-foreground hover:bg-muted/50"
              }`}
            >
              {s.name}
            </button>
          ))}
          <button onClick={() => setShowSub(true)} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            <FolderPlus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <div className="mx-1 h-6 w-px bg-border/60 hidden md:block" />
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Chapter</span>
          {props.chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => props.onChapter(c.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                props.chapterId === c.id ? "bg-cta-gradient text-white shadow-glow" : "border border-border bg-background/40 text-foreground hover:bg-muted/50"
              }`}
            >
              {c.name}
            </button>
          ))}
          <button onClick={() => setShowCh(true)} disabled={!props.subjectId} className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40">
            <BookPlus className="h-3.5 w-3.5" /> New
          </button>
        </div>
      </div>

      {showSub && (
        <QuickCreateDialog
          title="New subject"
          onClose={() => setShowSub(false)}
          onSubmit={async ({ name, slug }) => {
            await props.createSubject({ data: { name, slug, sort_order: 0, status: "published" } });
            props.onSubjectCreated();
          }}
        />
      )}
      {showCh && props.subjectId && (
        <QuickCreateDialog
          title="New chapter"
          onClose={() => setShowCh(false)}
          onSubmit={async ({ name, slug }) => {
            await props.createChapter({ data: { name, slug, subject_id: props.subjectId!, sort_order: 0, status: "published" } });
            props.onChapterCreated();
          }}
        />
      )}
    </div>
  );
}

function QuickCreateDialog({ title, onClose, onSubmit }: { title: string; onClose: () => void; onSubmit: (v: { name: string; slug: string }) => Promise<void> }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const autoSlug = useMemo(
    () => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    [name],
  );

  return (
    <Modal onClose={onClose} title={title}>
      <div className="space-y-3">
        <Field label="Name">
          <input value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(""); }} className="input" />
        </Field>
        <Field label="Slug (a-z, 0-9, dashes)">
          <input value={slug || autoSlug} onChange={(e) => setSlug(e.target.value)} className="input" />
        </Field>
        {err && <p className="text-xs text-red-400">{err}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm">Cancel</button>
          <button
            disabled={busy || !name}
            onClick={async () => {
              setBusy(true); setErr(null);
              try { await onSubmit({ name: name.trim(), slug: (slug || autoSlug).trim() }); onClose(); }
              catch (e) { setErr(e instanceof Error ? e.message : "Failed to create"); }
              finally { setBusy(false); }
            }}
            className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Create
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Edit dialog ---------------- */
function EditDialog({ draft, onChange, onClose, onSave, saving, error }: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  error: Error | null;
}) {
  return (
    <Modal onClose={onClose} title={draft.id ? "Edit MCQ" : "New MCQ"} wide>
      <div className="grid gap-3">
        <Field label="Question">
          <textarea value={draft.question} onChange={(e) => onChange({ ...draft, question: e.target.value })} className="input min-h-[80px]" />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(["A", "B", "C", "D"] as const).map((k) => (
            <Field key={k} label={`Option ${k}`}>
              <input
                value={(draft as unknown as Record<string, string>)[`option_${k.toLowerCase()}`]}
                onChange={(e) => onChange({ ...draft, [`option_${k.toLowerCase()}`]: e.target.value })}
                className="input"
              />
            </Field>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Correct">
            <select value={draft.correct_option} onChange={(e) => onChange({ ...draft, correct_option: e.target.value as Draft["correct_option"] })} className="input">
              <option>A</option><option>B</option><option>C</option><option>D</option>
            </select>
          </Field>
          <Field label="Difficulty">
            <select value={draft.difficulty} onChange={(e) => onChange({ ...draft, difficulty: e.target.value as Draft["difficulty"] })} className="input">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={draft.status} onChange={(e) => onChange({ ...draft, status: e.target.value as Draft["status"] })} className="input">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
        </div>
        <Field label="Explanation (optional)">
          <textarea value={draft.explanation} onChange={(e) => onChange({ ...draft, explanation: e.target.value })} className="input min-h-[60px]" />
        </Field>
        <Field label="Tags (comma separated)">
          <input value={draft.tags} onChange={(e) => onChange({ ...draft, tags: e.target.value })} className="input" />
        </Field>
        {error && <p className="flex items-center gap-2 text-xs text-red-400"><AlertCircle className="h-3.5 w-3.5" />{error.message}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} disabled={saving} className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Bulk import ---------------- */
function BulkImportDialog({ chapterId, onClose, onDone, run }: {
  chapterId: string;
  onClose: () => void;
  onDone: () => void;
  run: ReturnType<typeof useServerFn<typeof adminBulkImportMcqs>>;
}) {
  const [text, setText] = useState(SAMPLE_JSON);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function go() {
    setBusy(true); setMsg(null);
    try {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : parsed.items;
      if (!Array.isArray(items)) throw new Error("JSON must be an array (or { items: [...] })");
      const res = await run({ data: { chapter_id: chapterId, items } });
      setMsg({ kind: "ok", text: `Inserted ${res.inserted} MCQs` });
      setTimeout(onDone, 600);
    } catch (e) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "Import failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Bulk import MCQs" wide>
      <p className="text-xs text-muted-foreground">
        Paste a JSON array. Each item: <code>question, option_a..d, correct_option (A|B|C|D), explanation?, difficulty?, status?, tags?</code>
      </p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="input mt-3 min-h-[260px] font-mono text-xs" />
      {msg && (
        <p className={`mt-3 text-xs ${msg.kind === "ok" ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm">Cancel</button>
        <button onClick={go} disabled={busy} className="bg-cta-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Import
        </button>
      </div>
    </Modal>
  );
}

const SAMPLE_JSON = JSON.stringify(
  [
    {
      question: "Which gas do plants absorb during photosynthesis?",
      option_a: "Oxygen",
      option_b: "Carbon dioxide",
      option_c: "Nitrogen",
      option_d: "Hydrogen",
      correct_option: "B",
      explanation: "Plants absorb CO₂ and release O₂.",
      difficulty: "easy",
      tags: ["biology", "photosynthesis"],
    },
  ],
  null,
  2,
);

/* ---------------- Atoms ---------------- */
function Modal({ children, onClose, title, wide }: { children: React.ReactNode; onClose: () => void; title: string; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md">
      <div className={`glass shadow-glow animate-fade-up relative w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-3xl p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/40 transition-colors ${danger ? "hover:bg-red-500/10 hover:text-red-400" : "hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: Mcq["status"] }) {
  const map: Record<Mcq["status"], string> = {
    published: "bg-emerald-500/15 text-emerald-400 border-emerald-400/40",
    draft: "bg-amber-500/15 text-amber-400 border-amber-400/40",
    archived: "bg-muted text-muted-foreground border-border",
  };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${map[status]}`}>{status}</span>;
}

function Loader() {
  return <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
}
function Empty({ text }: { text: string }) {
  return <div className="p-10 text-center text-sm text-muted-foreground">{text}</div>;
}
