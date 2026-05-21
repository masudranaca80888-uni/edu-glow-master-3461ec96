import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Trophy,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  Flame,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Crown,
  Medal,
  Target,
  TrendingUp,
  Download,
  RotateCcw,
  Eye,
  Play,
  Calendar,
  Star,
  BookOpen,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";


type Stage = "browse" | "exam" | "result";

const filters = [
  "Certificate",
  "Professional",
  "Advanced",
  "Full Subject Mock",
  "Chapter Wise Mock",
];

type StudentMock = {
  title: string;
  subject: string;
  scope: "Full Subject" | "Chapter Wise" | "Level Wide";
  mcqs: number;
  marks: number;
  duration: number;
  participants: number;
  difficulty: "Easy" | "Medium" | "Hard";
  level: string;
  color: string;
};

const MOCK_COLORS = [
  "from-[var(--neon-purple)] to-[var(--neon-blue)]",
  "from-fuchsia-500 to-purple-600",
  "from-emerald-500 to-cyan-500",
  "from-amber-500 to-pink-500",
  "from-sky-500 to-indigo-500",
  "from-violet-500 to-blue-600",
];

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function useLiveMocks() {
  const qc = useQueryClient();
  useEffect(() => {
    const ch = supabase
      .channel("student-mock-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "quizzes" }, (payload) => {
        const rec = (payload.new || payload.old) as { kind?: string } | null;
        if (!rec || rec.kind === "mock") qc.invalidateQueries({ queryKey: ["student-mocks"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_questions" }, () =>
        qc.invalidateQueries({ queryKey: ["student-mocks"] }))
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [qc]);

  return useQuery({
    queryKey: ["student-mocks"],
    queryFn: async (): Promise<StudentMock[]> => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("quizzes")
        .select("id,title,level,subject_id,chapter_id,total_questions,duration_seconds,passing_marks,difficulty,starts_at,ends_at,status,kind,subjects(name)")
        .eq("kind", "mock")
        .eq("status", "published")
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []).map((r, i) => {
        const subjectName = (r as { subjects?: { name?: string } | null }).subjects?.name ?? "General";
        const scope: StudentMock["scope"] = r.subject_id == null
          ? "Level Wide"
          : r.chapter_id == null
          ? "Full Subject"
          : "Chapter Wise";
        return {
          title: r.title,
          subject: subjectName,
          scope,
          mcqs: r.total_questions ?? 0,
          marks: r.passing_marks || (r.total_questions ?? 0),
          duration: Math.max(1, Math.round((r.duration_seconds ?? 0) / 60)),
          participants: 0,
          difficulty: cap(r.difficulty ?? "medium") as StudentMock["difficulty"],
          level: cap(r.level ?? "professional"),
          color: MOCK_COLORS[i % MOCK_COLORS.length],
        };
      });
    },
  });
}


const leaderboard = [
  { name: "Aarav Khan", score: 98, time: "62m", you: false },
  { name: "Mira Sato", score: 96, time: "65m", you: false },
  { name: "Liam Patel", score: 94, time: "70m", you: false },
  { name: "Sophia Ahmed", score: 92, time: "68m", you: false },
  { name: "You", score: 89, time: "74m", you: true },
  { name: "Noah Reyes", score: 87, time: "81m", you: false },
  { name: "Zara Iqbal", score: 85, time: "79m", you: false },
];

export function MockTestFlow() {
  const [stage, setStage] = useState<Stage>("browse");
  const [filter, setFilter] = useState<string>("Certificate");
  const [selected, setSelected] = useState<StudentMock | null>(null);

  return (
    <div className="space-y-6">
      {stage === "browse" && (
        <BrowseStage
          filter={filter}
          setFilter={setFilter}
          onStart={(m) => {
            setSelected(m);
            setStage("exam");
          }}
        />
      )}
      {stage === "exam" && selected && (
        <ExamStage
          mock={selected}
          onSubmit={() => setStage("result")}
          onExit={() => setStage("browse")}
        />
      )}
      {stage === "result" && selected && (
        <ResultStage
          mock={selected}
          onRetry={() => setStage("exam")}
          onBack={() => setStage("browse")}
        />
      )}
    </div>
  );
}

/* ----------------------------- BROWSE ----------------------------- */

function BrowseStage({
  filter,
  setFilter,
  onStart,
}: {
  filter: string;
  setFilter: (s: string) => void;
  onStart: (m: (typeof mocks)[number]) => void;
}) {
  const filtered = useMemo(() => {
    if (filter === "Full Subject Mock") return mocks.filter((m) => m.scope === "Full Subject");
    if (filter === "Chapter Wise Mock") return mocks.filter((m) => m.scope === "Chapter Wise");
    return mocks.filter((m) => m.level === filter);
  }, [filter]);

  return (
    <>
      {/* Header */}
      <div className="glass rounded-3xl p-6 shadow-card-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
              Mock Test Arena
            </div>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Mock Test <span className="text-gradient">Arena</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Attempt full-length mock exams curated by admins and compete on the global leaderboard.
            </p>
          </div>
          <div className="flex gap-2">
            <Stat label="Live Now" value="14" icon={Flame} />
            <Stat label="Your Rank" value="#128" icon={Medal} />
          </div>
        </div>
      </div>

      {/* Featured banner */}
      <FeaturedBanner />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-transparent bg-cta-gradient text-white shadow-glow"
                  : "border-border/60 bg-muted/30 text-foreground/80 hover:border-[var(--neon-purple)]/40 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m, i) => (
          <MockCard key={m.title} mock={m} delay={i * 60} onStart={() => onStart(m)} />
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card-soft">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-display text-base font-bold">{value}</div>
      </div>
    </div>
  );
}

function FeaturedBanner() {
  const [time, setTime] = useState({ d: 2, h: 14, m: 32, s: 18 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((p) => {
        let { d, h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-card-soft sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--neon-purple)]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[var(--neon-blue)]/30 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-3 py-1 text-[11px] font-medium text-[var(--neon-purple)]">
            <Sparkles className="h-3.5 w-3.5" /> Upcoming Mega Mock
          </div>
          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            National Grand Mock <span className="text-gradient">#42</span>
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            150 MCQs · 120 minutes · Live leaderboard with cash prizes for top 10 rankers.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { l: "Days", v: time.d },
              { l: "Hours", v: time.h },
              { l: "Mins", v: time.m },
              { l: "Secs", v: time.s },
            ].map((t) => (
              <div key={t.l} className="glass rounded-2xl px-4 py-3 text-center shadow-card-soft">
                <div className="font-display text-2xl font-bold text-gradient">
                  {String(t.v).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
              <Calendar className="h-4 w-4" /> Reserve a Seat
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground">
              <Eye className="h-4 w-4" /> View Leaderboard
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 shadow-card-soft">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Weekly Top Rankers
            </span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <ul className="space-y-2">
            {leaderboard.slice(0, 4).map((u, i) => (
              <li
                key={u.name}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  u.you ? "bg-cta-gradient/10 border border-[var(--neon-purple)]/30" : "bg-muted/40"
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                  i === 0 ? "bg-amber-400/20 text-amber-400" : i === 1 ? "bg-zinc-400/20 text-zinc-300" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-muted text-muted-foreground"
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-1 text-sm font-medium">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.time}</div>
                <div className="font-display text-sm font-bold text-gradient">{u.score}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MockCard({
  mock,
  delay,
  onStart,
}: {
  mock: (typeof mocks)[number];
  delay: number;
  onStart: () => void;
}) {
  const diffColor =
    mock.difficulty === "Easy"
      ? "text-emerald-400 bg-emerald-400/10"
      : mock.difficulty === "Medium"
      ? "text-amber-400 bg-amber-400/10"
      : "text-rose-400 bg-rose-400/10";

  return (
    <div
      className="group relative animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${mock.color} opacity-0 blur transition-opacity duration-300 group-hover:opacity-60`}
      />
      <div className="glass relative h-full overflow-hidden rounded-3xl p-5 shadow-card-soft transition-transform duration-300 group-hover:-translate-y-1">
        {/* shine */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        {/* ribbon */}
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-[var(--neon-blue)]/30 bg-[var(--neon-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-blue)]">
          <ShieldCheck className="h-3 w-3" /> Verified
        </div>

        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mock.color} text-white shadow-glow`}>
          <Trophy className="h-5 w-5" />
        </div>

        <h3 className="font-display mt-3 text-lg font-bold tracking-tight">{mock.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted/60 px-2 py-0.5">{mock.subject}</span>
          <span className="rounded-full bg-muted/60 px-2 py-0.5">{mock.scope}</span>
          <span className={`rounded-full px-2 py-0.5 font-semibold ${diffColor}`}>{mock.difficulty}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Mini label="MCQs" value={mock.mcqs} />
          <Mini label="Marks" value={mock.marks} />
          <Mini label="Mins" value={mock.duration} />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {mock.participants.toLocaleString()} joined
          </span>
          <span className="inline-flex items-center gap-1 text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" /> 4.9
          </span>
        </div>

        {/* progress ribbon */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${mock.color}`} />
        </div>

        <button
          onClick={onStart}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
        >
          <Play className="h-4 w-4" /> Start Exam
        </button>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 px-2 py-2">
      <div className="font-display text-base font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

/* ----------------------------- EXAM ----------------------------- */

const sampleQs = Array.from({ length: 20 }).map((_, i) => ({
  q: `Question ${i + 1}: Which of the following best describes the principle behind the phenomenon under study in scenario ${i + 1}?`,
  options: [
    "Conservation of momentum",
    "Newton's second law",
    "Law of universal gravitation",
    "Principle of superposition",
  ],
  correct: i % 4,
}));

function ExamStage({
  mock,
  onSubmit,
  onExit,
}: {
  mock: (typeof mocks)[number];
  onSubmit: () => void;
  onExit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [time, setTime] = useState(mock.duration * 60);

  useEffect(() => {
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const q = sampleQs[idx];
  const attempted = Object.keys(answers).length;
  const total = sampleQs.length;
  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  const select = (i: number) => setAnswers((a) => ({ ...a, [idx]: i }));
  const toggleBookmark = () =>
    setBookmarks((b) => {
      const n = new Set(b);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });

  return (
    <>
      {/* Exam header */}
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold">{mock.title}</div>
            <div className="text-xs text-muted-foreground">
              {mock.subject} · {mock.scope}
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden flex-1 sm:block">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-cta-gradient transition-all"
                style={{ width: `${((idx + 1) / total) * 100}%` }}
              />
            </div>
          </div>
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold">
            <Clock className="h-4 w-4 text-[var(--neon-blue)]" />
            <span className="font-display tabular-nums">{mm}:{ss}</span>
          </div>
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" /> Exit
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Question panel */}
        <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-card-soft sm:p-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--neon-purple)]/20 blur-3xl" />

          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs">
              <span className="font-display font-bold text-gradient">
                Q {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground">/ {total}</span>
              <span className="ml-1 rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-blue)]">
                {mock.subject}
              </span>
            </div>
            <button
              onClick={toggleBookmark}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
                bookmarks.has(idx)
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarks.has(idx) ? "fill-amber-400" : ""}`} />
            </button>
          </div>

          <h2 className="font-display mt-5 text-xl font-bold leading-snug sm:text-2xl">
            {q.q}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {q.options.map((opt, i) => {
              const picked = answers[idx] === i;
              return (
                <button
                  key={i}
                  onClick={() => select(i)}
                  className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                    picked
                      ? "border-transparent bg-cta-gradient text-white shadow-glow"
                      : "border-border/60 bg-muted/30 hover:border-[var(--neon-purple)]/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                        picked ? "bg-white/20 text-white" : "bg-muted text-foreground/80"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={onSubmit}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-5 py-2 text-sm font-semibold text-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/20"
            >
              Submit Mock Test
            </button>
            <button
              onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-3xl p-5 shadow-card-soft">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Question Navigator
              </span>
              <span className="text-xs text-muted-foreground">{total - attempted} left</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sampleQs.map((_, i) => {
                const isActive = i === idx;
                const isDone = answers[i] !== undefined;
                const isBm = bookmarks.has(i);
                return (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`relative h-9 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? "bg-cta-gradient text-white shadow-glow"
                        : isDone
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {i + 1}
                    {isBm && (
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_var(--tw-shadow-color)]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
              <Legend color="bg-cta-gradient" label="Current" />
              <Legend color="bg-emerald-500/40" label="Attempted" />
              <Legend color="bg-muted" label="Pending" />
            </div>
          </div>

          <div className="glass rounded-3xl p-5 shadow-card-soft">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Performance
            </span>
            <div className="mt-3 space-y-3">
              <Row label="Accuracy" value={`${attempted ? Math.round((attempted * 0.78) * 100 / attempted) : 0}%`} icon={Target} />
              <Row label="Est. Score" value={`${Math.round(attempted * 0.78 * (mock.marks / total))} / ${mock.marks}`} icon={TrendingUp} />
              <Row label="Progress" value={`${attempted}/${total}`} icon={CheckCircle2} />
              <Row label="Time Left" value={`${mm}:${ss}`} icon={Clock} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      {label}
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> {label}
      </span>
      <span className="font-display text-sm font-bold">{value}</span>
    </div>
  );
}

/* ----------------------------- RESULT ----------------------------- */

function ResultStage({
  mock,
  onRetry,
  onBack,
}: {
  mock: (typeof mocks)[number];
  onRetry: () => void;
  onBack: () => void;
}) {
  const score = 78;
  const correct = 62;
  const wrong = 14;
  const skipped = 4;
  const accuracy = Math.round((correct / (correct + wrong)) * 100);

  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <>
      <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-card-soft sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[260px_1fr]">
          {/* Ring */}
          <div className="relative mx-auto h-[180px] w-[180px]">
            <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="ringGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--neon-purple)" />
                  <stop offset="100%" stopColor="var(--neon-blue)" />
                </linearGradient>
              </defs>
              <circle cx="90" cy="90" r={radius} stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="url(#ringGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${circ}`}
                className="transition-[stroke-dasharray] duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-4xl font-bold text-gradient">{score}%</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Final Score</div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Mock Submitted Successfully
            </div>
            <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              You ranked <span className="text-gradient">#128</span> globally
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mock.title} · {mock.subject} · Better than 84% of attempts.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon={CheckCircle2} label="Correct" value={correct} color="text-emerald-400" />
              <StatCard icon={XCircle} label="Wrong" value={wrong} color="text-rose-400" />
              <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} color="text-[var(--neon-blue)]" />
              <StatCard icon={Clock} label="Time Spent" value={`${mock.duration - 10}m`} color="text-[var(--neon-purple)]" />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform">
                <Eye className="h-4 w-4" /> Review Answers
              </button>
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" /> Retry Mock
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-5 py-2.5 text-sm font-semibold text-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/20">
                <Download className="h-4 w-4" /> Download PDF
              </button>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Arena
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Subject-wise */}
        <div className="glass rounded-3xl p-6 shadow-card-soft">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold">Subject-wise Performance</span>
            <BookOpen className="h-4 w-4 text-[var(--neon-blue)]" />
          </div>
          <div className="mt-4 space-y-4">
            {[
              { s: "Mechanics", p: 88 },
              { s: "Thermodynamics", p: 72 },
              { s: "Optics", p: 64 },
              { s: "Modern Physics", p: 81 },
              { s: "Electromagnetism", p: 55 },
            ].map((r) => (
              <div key={r.s}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{r.s}</span>
                  <span className="text-muted-foreground">{r.p}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                  <div
                    className="h-full rounded-full bg-cta-gradient transition-all"
                    style={{ width: `${r.p}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <MinusCircle className="h-4 w-4" /> Weak Chapters
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Electromagnetism, Optics — recommended to revise short notes & flash cards.
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass rounded-3xl p-6 shadow-card-soft">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold">Top 10 Rankers</span>
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <ul className="mt-4 space-y-2">
            {leaderboard.map((u, i) => (
              <li
                key={u.name}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  u.you
                    ? "border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 shadow-glow"
                    : "bg-muted/40 hover:bg-muted/60"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                  i === 0 ? "bg-amber-400/20 text-amber-400" : i === 1 ? "bg-zinc-400/20 text-zinc-300" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-muted text-muted-foreground"
                }`}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground">Time {u.time}</div>
                </div>
                <div className="font-display text-sm font-bold text-gradient">{u.score}%</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 shadow-card-soft">
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="font-display mt-2 text-2xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
