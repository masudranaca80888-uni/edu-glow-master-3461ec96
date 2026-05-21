import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Send,
  EyeOff,
  Filter,
  ArrowUpDown,
  Layers,
  CheckCircle2,
  Eye,
  Flame,
  Edit3,
  Trash2,
  Copy,
  CircleDot,
  CloudUpload,
  Sparkles,
  RotateCw,
  FileText,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { adminGetAcademicTree } from "@/lib/admin-academic.functions";
import {
  adminBulkImportFlashCards,
  adminCreateFlashCard,
  adminDeleteFlashCard,
  adminDuplicateFlashCard,
  adminListFlashCards,
  adminSetFlashCardHidden,
  adminSetFlashCardStatus,
  adminSetFlashCardVisibility,
  adminUpdateFlashCard,
  getFlashCardVisibility,
} from "@/lib/admin-flash-cards.functions";

type FlashCard = {
  id: string;
  subject_id: string | null;
  chapter_id: string | null;
  level: string;
  front: string;
  back: string;
  formula: string | null;
  image_url: string | null;
  card_type: "concept" | "formula" | "diagram" | "timeline" | "definition" | "other";
  tags: string[];
  status: "draft" | "published" | "archived";
  is_hidden: boolean;
  scheduled_at: string | null;
  view_count: number;
  updated_at: string;
};

type EditState = { open: boolean; card?: FlashCard | null };

function statusTone(s: string, hidden: boolean) {
  if (hidden) return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  switch (s) {
    case "published": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "draft": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "archived": return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    default: return "bg-muted text-foreground";
  }
}

export function FlashCardManagerFlow() {
  const qc = useQueryClient();

  const treeFn = useServerFn(adminGetAcademicTree);
  const listFn = useServerFn(adminListFlashCards);

  // ----- Filter state (URL-free, local but stable) -----
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [chapterId, setChapterId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived" | "hidden">("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [editor, setEditor] = useState<EditState>({ open: false });
  const [importer, setImporter] = useState(false);

  // ----- Academic tree -----
  const tree = useQuery({
    queryKey: ["admin-academic-tree"],
    queryFn: () => treeFn(),
    staleTime: 60_000,
  });

  const subjects = useMemo(() => {
    const all = (tree.data?.subjects ?? []) as { id: string; name: string; level: string }[];
    return level === "all" ? all : all.filter((s) => s.level === level);
  }, [tree.data, level]);
  const chapters = useMemo(() => {
    const all = (tree.data?.chapters ?? []) as { id: string; name: string; subject_id: string }[];
    return subjectId === "all" ? all : all.filter((c) => c.subject_id === subjectId);
  }, [tree.data, subjectId]);

  // Reset deeper selectors when a parent changes
  useEffect(() => { setSubjectId("all"); setChapterId("all"); setPage(1); }, [level]);
  useEffect(() => { setChapterId("all"); setPage(1); }, [subjectId]);

  // ----- Card list -----
  const cardsQuery = useQuery({
    queryKey: ["flash-cards", { search, level, subjectId, chapterId, statusFilter, page }],
    queryFn: () =>
      listFn({
        data: {
          search: search.trim() || undefined,
          level: level === "all" ? undefined : level,
          subjectId: subjectId === "all" ? undefined : subjectId,
          chapterId: chapterId === "all" ? undefined : chapterId,
          status: statusFilter,
          page,
          pageSize,
        },
      }),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["flash-cards"] });
    qc.invalidateQueries({ queryKey: ["public-flash-cards"] });
  };

  // Realtime — admin table + student deck both refresh instantly
  useEffect(() => {
    const ch = supabase
      .channel("flash-cards-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "flash_cards" }, invalidate)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Mutations -----
  const delFn = useServerFn(adminDeleteFlashCard);
  const dupFn = useServerFn(adminDuplicateFlashCard);
  const statusFn = useServerFn(adminSetFlashCardStatus);
  const hideFn = useServerFn(adminSetFlashCardHidden);

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const duplicate = useMutation({
    mutationFn: (id: string) => dupFn({ data: { id } }),
    onSuccess: () => { toast.success("Duplicated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setStatus = useMutation({
    mutationFn: (p: { id: string; status: "draft" | "published" | "archived" }) => statusFn({ data: p }),
    onSuccess: (_d, p) => { toast.success(`Marked ${p.status}`); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setHidden = useMutation({
    mutationFn: (p: { id: string; is_hidden: boolean }) => hideFn({ data: p }),
    onSuccess: (_d, p) => { toast.success(p.is_hidden ? "Hidden from students" : "Visible again"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows: FlashCard[] = (cardsQuery.data?.rows ?? []) as FlashCard[];
  const total = cardsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const levels = (tree.data?.levels ?? []) as { code: string; name: string }[];
  const allSubjects = (tree.data?.subjects ?? []) as { id: string; name: string }[];
  const allChapters = (tree.data?.chapters ?? []) as { id: string; name: string }[];
  const subjectName = (id: string | null) => allSubjects.find((s) => s.id === id)?.name ?? "—";
  const chapterName = (id: string | null) => allChapters.find((c) => c.id === id)?.name ?? "—";

  // ----- Stat cards (live counts via lightweight reads) -----
  const stats = useMemo(() => {
    const published = rows.filter((r) => r.status === "published" && !r.is_hidden).length;
    const hidden = rows.filter((r) => r.is_hidden).length;
    return { total, published, hidden };
  }, [rows, total]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
                <Layers className="mr-1 h-3 w-3" /> Flash Cards
              </Badge>
              <span className="text-xs text-muted-foreground">/ Admin / Flash Card Manager</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Flash Card <span className="text-gradient">Management Center</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Create, organize and manage smart revision flash cards with rich media and instant publishing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => setEditor({ open: true, card: null })}
              className="bg-cta-gradient rounded-xl text-white shadow-glow hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Create Flash Card
            </Button>
            <Button
              type="button"
              onClick={() => setImporter(true)}
              variant="outline"
              className="rounded-xl border-white/15 bg-background/40"
            >
              <CloudUpload className="h-4 w-4" /> Bulk Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Filters connected to Academic Manager */}
      <div className="glass shadow-card-soft rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search flash cards by front or back…"
              className="h-9 rounded-xl border-white/10 bg-background/60 pl-9"
            />
          </div>

          <SelectFilter icon={<Filter className="h-3 w-3" />} label="Level" value={level} onValueChange={setLevel}
            options={[{ value: "all", label: "All levels" }, ...levels.map((l) => ({ value: l.code, label: l.name }))]} />

          <SelectFilter icon={<Filter className="h-3 w-3" />} label="Subject" value={subjectId} onValueChange={setSubjectId}
            options={[{ value: "all", label: "All subjects" }, ...subjects.map((s) => ({ value: s.id, label: s.name }))]} />

          <SelectFilter icon={<Filter className="h-3 w-3" />} label="Chapter" value={chapterId} onValueChange={setChapterId}
            options={[{ value: "all", label: "All chapters" }, ...chapters.map((c) => ({ value: c.id, label: c.name }))]} />

          <SelectFilter icon={<ArrowUpDown className="h-3 w-3" />} label="Status" value={statusFilter}
            onValueChange={(v) => { setStatusFilter(v as typeof statusFilter); setPage(1); }}
            options={[
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "archived", label: "Archived" },
              { value: "hidden", label: "Hidden" },
            ]} />
        </div>
      </div>

      {/* Section-wide visibility controls */}
      <VisibilityPanel
        levels={(tree.data?.levels ?? []) as { code: string; name: string }[]}
        subjects={(tree.data?.subjects ?? []) as { id: string; name: string; level: string }[]}
        chapters={(tree.data?.chapters ?? []) as { id: string; name: string; subject_id: string }[]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Total Flash Cards" value={stats.total} icon={Layers} color="var(--neon-purple)" />
        <StatTile label="Published & Visible" value={stats.published} icon={CheckCircle2} color="#22c55e" />
        <StatTile label="Hidden in current page" value={stats.hidden} icon={EyeOff} color="#f59e0b" />
      </div>

      {/* Table */}
      <div className="glass shadow-card-soft overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h3 className="font-display text-lg font-bold">All Flash Cards</h3>
            <p className="text-xs text-muted-foreground">
              {cardsQuery.isLoading ? "Loading…" : `Showing ${rows.length} of ${total}`}
              {" "}— live sync enabled
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-white/10 bg-background/40">
              <CircleDot className="mr-1 h-2.5 w-2.5 animate-pulse text-emerald-400" /> Live
            </Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="pl-4">Front</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="pr-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.03]">
                  <TableCell className="max-w-[260px] truncate pl-4 font-medium">{c.front}</TableCell>
                  <TableCell className="text-muted-foreground">{subjectName(c.subject_id)}</TableCell>
                  <TableCell className="text-muted-foreground">{chapterName(c.chapter_id)}</TableCell>
                  <TableCell>
                    <span className="rounded-md bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] text-[var(--neon-purple)]">{c.card_type}</span>
                  </TableCell>
                  <TableCell>{c.view_count.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusTone(c.status, c.is_hidden)} border text-[10px]`}>
                      {c.is_hidden ? "Hidden" : c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex items-center justify-end gap-0.5">
                      <RowBtn title="Edit" onClick={() => setEditor({ open: true, card: c })}><Edit3 className="h-3.5 w-3.5" /></RowBtn>
                      <RowBtn title="Duplicate" onClick={() => duplicate.mutate(c.id)}><Copy className="h-3.5 w-3.5" /></RowBtn>
                      <RowBtn
                        title={c.status === "published" ? "Unpublish" : "Publish"}
                        onClick={() => setStatus.mutate({ id: c.id, status: c.status === "published" ? "draft" : "published" })}
                      >
                        <Send className={`h-3.5 w-3.5 ${c.status === "published" ? "text-emerald-400" : ""}`} />
                      </RowBtn>
                      <RowBtn
                        title={c.is_hidden ? "Unhide" : "Hide from students"}
                        onClick={() => setHidden.mutate({ id: c.id, is_hidden: !c.is_hidden })}
                      >
                        {c.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </RowBtn>
                      <RowBtn
                        title="Delete"
                        onClick={() => {
                          if (confirm(`Delete flash card "${c.front}"?`)) remove.mutate(c.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </RowBtn>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!cardsQuery.isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    <Sparkles className="mx-auto mb-2 h-5 w-5" />
                    No flash cards match your filters. Create your first card.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10"
              disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button size="sm" variant="outline" className="h-7 rounded-lg border-white/10"
              disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </div>

      {/* Sample preview card kept (visual only) */}
      <div className="glass shadow-card-soft rounded-3xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Live Preview</h3>
          <span className="text-xs text-muted-foreground">Hover to flip</span>
        </div>
        <div className="[perspective:1000px]">
          <div className="group relative h-40 max-w-md rounded-2xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/15 to-[var(--neon-blue)]/15 p-4 shadow-glow transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden]">
              <span className="self-end rounded-md bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">FRONT</span>
              <div>
                <p className="font-display text-base font-bold">{rows[0]?.front ?? "Create a flash card to preview"}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Hover to flip → reveal explanation</p>
              </div>
              <RotateCw className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="self-end rounded-md bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">BACK</span>
              <p className="text-[11px] leading-relaxed">{rows[0]?.back ?? "Back side of your first card will appear here."}</p>
            </div>
          </div>
        </div>
      </div>

      <EditorDialog
        state={editor}
        onClose={() => setEditor({ open: false })}
        onSaved={invalidate}
        levels={levels}
        allSubjects={allSubjects as never}
        allChapters={allChapters as never}
      />
      <BulkImportDialog open={importer} onClose={() => setImporter(false)} onSaved={invalidate} />
    </div>
  );
}

// ===============================================
// helpers
// ===============================================
function StatTile({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl" style={{ background: color }} />
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10" style={{ background: `color-mix(in oklab, ${color} 15%, transparent)` }}>
          <Icon className="h-4 w-4" />
        </div>
        <Flame className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold tracking-tight">{value.toLocaleString()}</p>
    </div>
  );
}

function RowBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function SelectFilter({
  icon, label, value, onValueChange, options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 px-2 py-1 text-xs">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-7 w-[140px] border-0 bg-transparent px-1 text-xs focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

// ===============================================
// Editor dialog (create + edit)
// ===============================================
function EditorDialog({
  state, onClose, onSaved, levels, allSubjects, allChapters,
}: {
  state: EditState;
  onClose: () => void;
  onSaved: () => void;
  levels: { code: string; name: string }[];
  allSubjects: { id: string; name: string; level: string }[];
  allChapters: { id: string; name: string; subject_id: string }[];
}) {
  const createFn = useServerFn(adminCreateFlashCard);
  const updateFn = useServerFn(adminUpdateFlashCard);
  const isEdit = !!state.card;

  const [form, setForm] = useState<Partial<FlashCard>>({});
  useEffect(() => {
    if (!state.open) return;
    setForm(
      state.card
        ? { ...state.card }
        : {
            level: "professional",
            front: "",
            back: "",
            formula: "",
            card_type: "concept",
            status: "draft",
            is_hidden: false,
            tags: [],
            subject_id: null,
            chapter_id: null,
          },
    );
  }, [state]);

  const subjectsForLevel = useMemo(
    () => (form.level ? allSubjects.filter((s) => s.level === form.level) : allSubjects),
    [allSubjects, form.level],
  );
  const chaptersForSubject = useMemo(
    () => (form.subject_id ? allChapters.filter((c) => c.subject_id === form.subject_id) : []),
    [allChapters, form.subject_id],
  );

  const set = <K extends keyof FlashCard>(k: K, v: FlashCard[K] | null) => setForm((f) => ({ ...f, [k]: v as never }));

  const save = useMutation({
    mutationFn: async () => {
      if (!form.front?.trim() || !form.back?.trim()) throw new Error("Front and back are required");
      const payload = {
        subject_id: form.subject_id ?? null,
        chapter_id: form.chapter_id ?? null,
        level: form.level ?? "professional",
        front: form.front,
        back: form.back,
        formula: form.formula || null,
        image_url: form.image_url || null,
        card_type: (form.card_type ?? "concept"),
        tags: form.tags ?? [],
        status: form.status ?? "draft",
        is_hidden: form.is_hidden ?? false,
        scheduled_at: form.scheduled_at ?? null,
      };
      if (isEdit && state.card) return updateFn({ data: { id: state.card.id, ...payload } });
      return createFn({ data: payload });
    },
    onSuccess: () => { toast.success(isEdit ? "Flash card updated" : "Flash card created"); onSaved(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={state.open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Flash Card" : "Create Flash Card"}</DialogTitle>
          <DialogDescription>Card content syncs instantly to all students once published.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Level">
            <Select value={form.level ?? "professional"} onValueChange={(v) => { set("level", v); set("subject_id", null); set("chapter_id", null); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{levels.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.card_type ?? "concept"} onValueChange={(v) => set("card_type", v as FlashCard["card_type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["concept","formula","diagram","timeline","definition","other"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Subject">
            <Select value={form.subject_id ?? ""} onValueChange={(v) => { set("subject_id", v); set("chapter_id", null); }}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {subjectsForLevel.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Chapter">
            <Select value={form.chapter_id ?? ""} onValueChange={(v) => set("chapter_id", v)} disabled={!form.subject_id}>
              <SelectTrigger><SelectValue placeholder={form.subject_id ? "Select chapter" : "Pick subject first"} /></SelectTrigger>
              <SelectContent>
                {chaptersForSubject.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Front (question / topic) *">
          <Input value={form.front ?? ""} onChange={(e) => set("front", e.target.value)} placeholder="e.g. Newton's Second Law" />
        </Field>
        <Field label="Back (explanation) *">
          <Textarea rows={4} value={form.back ?? ""} onChange={(e) => set("back", e.target.value)} placeholder="Detailed explanation…" />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Formula (optional)">
            <Input value={form.formula ?? ""} onChange={(e) => set("formula", e.target.value)} placeholder="F = m · a" />
          </Field>
          <Field label="Image URL (optional)">
            <Input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Status">
            <Select value={form.status ?? "draft"} onValueChange={(v) => set("status", v as FlashCard["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 px-3 py-2 text-xs">
            <span>Hide from students</span>
            <Switch checked={!!form.is_hidden} onCheckedChange={(v) => set("is_hidden", v)} />
          </div>
          <Field label="Tags (comma-separated)">
            <Input
              value={(form.tags ?? []).join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean) as never)}
              placeholder="mechanics, exam"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

// ===============================================
// Bulk import dialog (paste plain text blocks)
// ===============================================
function BulkImportDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const importFn = useServerFn(adminBulkImportFlashCards);
  const [text, setText] = useState("");
  const [level, setLevel] = useState("professional");

  // Parse format:  Front :: Back   (one card per line)
  const cards = useMemo(() => {
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [front, ...rest] = l.split("::");
        return {
          front: (front ?? "").trim(),
          back: rest.join("::").trim(),
        };
      })
      .filter((c) => c.front && c.back);
  }, [text]);

  const submit = useMutation({
    mutationFn: () =>
      importFn({
        data: {
          cards: cards.map((c) => ({
            front: c.front,
            back: c.back,
            level,
            card_type: "concept",
            status: "draft",
            tags: [],
            is_hidden: false,
          })),
        },
      }),
    onSuccess: (r) => { toast.success(`Imported ${r.count} flash cards`); setText(""); onSaved(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Flash Cards</DialogTitle>
          <DialogDescription>
            Paste one card per line in the format <code className="rounded bg-muted px-1">Front :: Back</code>. Imported as drafts.
          </DialogDescription>
        </DialogHeader>

        <Field label="Default level">
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Cards">
          <Textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Newton's First Law :: An object in motion stays in motion…\nF = ma :: Force equals mass times acceleration"}
            className="font-mono text-xs"
          />
        </Field>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          {cards.length} valid card{cards.length === 1 ? "" : "s"} detected.
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => submit.mutate()} disabled={!cards.length || submit.isPending}>
            {submit.isPending ? "Importing…" : `Import ${cards.length}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
