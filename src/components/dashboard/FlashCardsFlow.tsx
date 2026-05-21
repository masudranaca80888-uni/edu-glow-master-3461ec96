import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getFlashCardVisibility, listPublicFlashCards } from "@/lib/admin-flash-cards.functions";

import {
  Sparkles,
  Award,
  Crown,
  Atom,
  FlaskConical,
  Dna,
  Sigma,
  Languages,
  Cpu,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Bookmark,
  CheckCircle2,
  Layers,
  Flame,
  Target,
  Clock,
  Star,
  BookOpen,
  Brain,
  TrendingUp,
  ChevronDown,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3;

const levels = [
  { t: "Certificate", d: "Foundational concepts", i: Sparkles, c: "from-sky-500 to-indigo-500" },
  { t: "Professional", d: "Exam-grade revision", i: Award, c: "from-[var(--neon-purple)] to-fuchsia-500" },
  { t: "Advanced", d: "Mastery & olympiad", i: Crown, c: "from-amber-400 to-rose-500" },
];

const subjects = [
  { t: "Physics", cards: 482, i: Atom, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
  { t: "Chemistry", cards: 410, i: FlaskConical, c: "from-fuchsia-500 to-purple-600" },
  { t: "Biology", cards: 528, i: Dna, c: "from-emerald-500 to-cyan-500" },
  { t: "Mathematics", cards: 612, i: Sigma, c: "from-amber-500 to-pink-500" },
  { t: "English", cards: 240, i: Languages, c: "from-sky-500 to-indigo-500" },
  { t: "ICT", cards: 198, i: Cpu, c: "from-violet-500 to-blue-600" },
];

const chapters = [
  { t: "Kinematics", cards: 38, progress: 72, last: "2h ago" },
  { t: "Newton's Laws of Motion", cards: 42, progress: 55, last: "Yesterday" },
  { t: "Work, Energy & Power", cards: 36, progress: 90, last: "3d ago" },
  { t: "Rotational Dynamics", cards: 30, progress: 25, last: "1w ago" },
  { t: "Gravitation", cards: 28, progress: 0, last: "—" },
];

const cardsDeck = [
  {
    front: "Newton's Second Law of Motion",
    back: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
    formula: "F = m · a",
    tag: "Mechanics",
  },
  {
    front: "Work–Energy Theorem",
    back: "The work done by the net force on a particle equals the change in its kinetic energy.",
    formula: "W_net = ΔKE = ½mv² − ½mu²",
    tag: "Energy",
  },
  {
    front: "Law of Conservation of Momentum",
    back: "In an isolated system, the total momentum before and after a collision remains constant.",
    formula: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
    tag: "Dynamics",
  },
  {
    front: "Universal Law of Gravitation",
    back: "Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of distance.",
    formula: "F = G · (m₁m₂)/r²",
    tag: "Gravitation",
  },
  {
    front: "Hooke's Law",
    back: "Within the elastic limit, the restoring force of a spring is directly proportional to its displacement.",
    formula: "F = −k · x",
    tag: "Elasticity",
  },
];

export function FlashCardsFlow() {
  const [step, setStep] = useState<Step>(0);
  const [level, setLevel] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [chapter, setChapter] = useState<string>("");

  return (
    <div className="space-y-6">
      <Header />
      <Stepper step={step} level={level} subject={subject} chapter={chapter} setStep={setStep} />

      {step === 0 && (
        <Grid>
          {levels.map((l, i) => (
            <SelectCard
              key={l.t}
              title={l.t}
              desc={l.d}
              Icon={l.i}
              gradient={l.c}
              delay={i * 70}
              onClick={() => { setLevel(l.t); setStep(1); }}
            />
          ))}
        </Grid>
      )}

      {step === 1 && (
        <Grid cols={3}>
          {subjects.map((s, i) => (
            <SelectCard
              key={s.t}
              title={s.t}
              desc={`${s.cards} flash cards`}
              Icon={s.i}
              gradient={s.c}
              delay={i * 60}
              onClick={() => { setSubject(s.t); setStep(2); }}
            />
          ))}
        </Grid>
      )}

      {step === 2 && (
        <ChapterList onPick={(c) => { setChapter(c); setStep(3); }} />
      )}

      {step === 3 && (
        <Viewer subject={subject || "Physics"} chapter={chapter || "Kinematics"} />
      )}

      {step === 3 && <Recommendations />}
    </div>
  );
}

/* ------------------------------ pieces ------------------------------ */

function Header() {
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
            Smart Flash Cards
          </div>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Smart <span className="text-gradient">Flash Cards</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick revision cards for faster learning and memorization.
          </p>
        </div>
        <div className="flex gap-2">
          <Pill icon={Flame} label="Streak" value="12d" />
          <Pill icon={Brain} label="Learned" value="284" />
        </div>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

function Stepper({
  step,
  level,
  subject,
  chapter,
  setStep,
}: {
  step: Step;
  level: string;
  subject: string;
  chapter: string;
  setStep: (s: Step) => void;
}) {
  const items = [
    { i: 0, l: "Level", v: level || "—" },
    { i: 1, l: "Subject", v: subject || "—" },
    { i: 2, l: "Chapter", v: chapter || "—" },
    { i: 3, l: "Study", v: chapter ? "In progress" : "—" },
  ];
  return (
    <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-3 shadow-card-soft">
      {items.map((it, idx) => {
        const active = step === it.i;
        const done = step > it.i;
        return (
          <div key={it.l} className="flex items-center gap-2">
            <button
              onClick={() => (done || active) && setStep(it.i as Step)}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                active
                  ? "bg-cta-gradient text-white shadow-glow"
                  : done
                  ? "bg-muted/60 text-foreground hover:bg-muted"
                  : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  active ? "bg-white/20" : done ? "bg-emerald-500/20 text-emerald-400" : "bg-muted"
                }`}
              >
                {done ? "✓" : it.i + 1}
              </span>
              <span>{it.l}:</span>
              <span className="opacity-80">{it.v}</span>
            </button>
            {idx < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        );
      })}
    </div>
  );
}

function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""}`}>
      {children}
    </div>
  );
}

function SelectCard({
  title,
  desc,
  Icon,
  gradient,
  onClick,
  delay,
}: {
  title: string;
  desc: string;
  Icon: any;
  gradient: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative animate-fade-in text-left"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${gradient} opacity-0 blur transition-opacity duration-300 group-hover:opacity-60`}
      />
      <div className="glass relative h-full overflow-hidden rounded-3xl p-6 shadow-card-soft transition-transform duration-300 group-hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-glow`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display mt-4 text-lg font-bold tracking-tight">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
          Continue <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}

function ChapterList({ onPick }: { onPick: (c: string) => void }) {
  const [open, setOpen] = useState<string | null>(chapters[0].t);
  return (
    <div className="space-y-3">
      {chapters.map((ch, i) => {
        const isOpen = open === ch.t;
        return (
          <div
            key={ch.t}
            className="glass overflow-hidden rounded-3xl shadow-card-soft animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : ch.t)}
              className="flex w-full items-center justify-between gap-3 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta-gradient text-white shadow-glow">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-display text-base font-bold">{ch.t}</div>
                  <div className="text-xs text-muted-foreground">
                    {ch.cards} cards · last studied {ch.last}
                  </div>
                </div>
              </div>
              <div className="hidden flex-1 sm:block">
                <div className="ml-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted/60">
                  <div className="h-full rounded-full bg-cta-gradient" style={{ width: `${ch.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{ch.progress}%</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-border/40 bg-muted/20 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 font-semibold text-emerald-400">
                      Mastered {Math.round(ch.cards * ch.progress / 100)}
                    </span>
                    <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">
                      Pending {ch.cards - Math.round(ch.cards * ch.progress / 100)}
                    </span>
                  </div>
                  <button
                    onClick={() => onPick(ch.t)}
                    className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-5 py-2 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
                  >
                    Study Cards <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ viewer ------------------------------ */

function Viewer({ subject, chapter }: { subject: string; chapter: string }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set([0, 2]));
  const [learned, setLearned] = useState<Set<number>>(new Set([2]));

  const qc = useQueryClient();
  const fetchPublic = useServerFn(listPublicFlashCards);
  const live = useQuery({
    queryKey: ["public-flash-cards", { subject, chapter }],
    queryFn: () => fetchPublic({ data: { limit: 60 } }),
  });

  useEffect(() => {
    const ch = supabase
      .channel("public-flash-cards-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "flash_cards" }, () => {
        qc.invalidateQueries({ queryKey: ["public-flash-cards"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const liveDeck = (live.data ?? []).map((c) => ({
    front: c.front, back: c.back, formula: c.formula ?? "", tag: c.card_type,
  }));
  const deck = liveDeck.length > 0 ? liveDeck : cardsDeck;
  const card = deck[Math.min(idx, deck.length - 1)] ?? deck[0];

  const next = () => { setFlipped(false); setIdx((i) => Math.min(deck.length - 1, i + 1)); };
  const prev = () => { setFlipped(false); setIdx((i) => Math.max(0, i - 1)); };


  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {/* meta */}
        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 shadow-card-soft">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-muted/60 px-2 py-0.5 font-semibold">{subject}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="rounded-full bg-[var(--neon-blue)]/10 px-2 py-0.5 font-semibold text-[var(--neon-blue)]">
              {chapter}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Card <span className="font-display font-bold text-foreground">{String(idx + 1).padStart(2, "0")}</span> / {deck.length}
          </div>
        </div>

        {/* 3D flip card */}
        <div className="[perspective:1500px]">
          <div
            className={`relative h-[420px] w-full transition-transform duration-700 [transform-style:preserve-3d] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* FRONT */}
            <Face>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-purple)]">
                  <Sparkles className="h-3 w-3" /> Concept
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Front</span>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Brain className="h-10 w-10 text-[var(--neon-blue)] drop-shadow-[0_0_18px_var(--neon-blue)]" />
                <h2 className="font-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {card.front}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Tap flip to reveal the answer</p>
              </div>
              <FlipBtn onClick={() => setFlipped(true)} />
            </Face>

            {/* BACK */}
            <Face back>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Explanation
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Back · {card.tag}</span>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <p className="text-sm leading-relaxed text-foreground/90">{card.back}</p>
                <div className="mt-4 rounded-2xl border border-[var(--neon-purple)]/30 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Formula</div>
                  <div className="font-display mt-1 text-xl font-bold text-gradient">{card.formula}</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <FileText className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> PDF Snippet
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-3">
                      Refer NCERT Ch. 5, pg. 86 — derivation of the relation between force, mass and acceleration.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <ImageIcon className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> Diagram
                    </div>
                    <div className="mt-1 flex h-12 items-center justify-center rounded-md bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 text-[10px] text-muted-foreground">
                      Figure 5.2
                    </div>
                  </div>
                </div>
              </div>
              <FlipBtn back onClick={() => setFlipped(false)} />
            </Face>
          </div>
        </div>

        {/* controls */}
        <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3 shadow-card-soft">
          <button
            onClick={prev}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <div className="flex items-center gap-2">
            <CtrlBtn
              active={bookmarks.has(idx)}
              onClick={() => setBookmarks((b) => {
                const n = new Set(b); n.has(idx) ? n.delete(idx) : n.add(idx); return n;
              })}
              Icon={Bookmark}
              label="Bookmark"
            />
            <CtrlBtn
              active={learned.has(idx)}
              onClick={() => setLearned((b) => {
                const n = new Set(b); n.has(idx) ? n.delete(idx) : n.add(idx); return n;
              })}
              Icon={CheckCircle2}
              label="Learned"
              variant="success"
            />
            <button
              onClick={() => setFlipped((f) => !f)}
              className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition-transform"
            >
              <RotateCw className="h-4 w-4" /> Flip
            </button>
          </div>
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-cta-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* right column */}
      <div className="space-y-4">
        <div className="glass rounded-3xl p-5 shadow-card-soft">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Study Progress
          </span>
          <div className="mt-4 space-y-3">
            <ProgRing pct={Math.round((learned.size / cardsDeck.length) * 100)} />
            <Row label="Completed" value={`${learned.size}`} icon={CheckCircle2} />
            <Row label="Remaining" value={`${cardsDeck.length - learned.size}`} icon={Layers} />
            <Row label="Accuracy" value="86%" icon={Target} />
            <Row label="Streak" value="12 days" icon={Flame} />
          </div>
        </div>

        <div className="glass rounded-3xl p-5 shadow-card-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Bookmarks
            </span>
            <Bookmark className="h-4 w-4 text-amber-400" />
          </div>
          <ul className="mt-3 space-y-2">
            {[...bookmarks].slice(0, 4).map((i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-xl bg-muted/40 px-3 py-2 hover:bg-muted/60 cursor-pointer"
                onClick={() => { setIdx(i); setFlipped(false); }}
              >
                <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold">{cardsDeck[i].front}</div>
                  <div className="text-[10px] text-muted-foreground">{cardsDeck[i].tag}</div>
                </div>
              </li>
            ))}
            {bookmarks.size === 0 && (
              <li className="rounded-xl border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
                No bookmarks yet
              </li>
            )}
          </ul>
          <div className="mt-3 border-t border-border/40 pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Recently Viewed
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-center gap-2"><Clock className="h-3 w-3 text-[var(--neon-blue)]" /> Friction & Tension</li>
              <li className="flex items-center gap-2"><Clock className="h-3 w-3 text-[var(--neon-blue)]" /> Projectile Motion</li>
              <li className="flex items-center gap-2"><Clock className="h-3 w-3 text-[var(--neon-blue)]" /> Circular Dynamics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Face({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className={`absolute inset-0 rounded-3xl ${back ? "[transform:rotateY(180deg)]" : ""} [backface-visibility:hidden]`}
    >
      <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 shadow-card-soft sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--neon-blue)]/25 blur-3xl" />
        <div className="absolute inset-0 rounded-3xl border border-[var(--neon-purple)]/20" />
        <div className="relative flex h-full flex-col">{children}</div>
      </div>
    </div>
  );
}

function FlipBtn({ onClick, back }: { onClick: () => void; back?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="mt-auto inline-flex items-center justify-center gap-2 self-center rounded-full border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 px-5 py-2 text-xs font-semibold text-[var(--neon-purple)] hover:bg-[var(--neon-purple)]/20"
    >
      <RotateCw className="h-3.5 w-3.5" /> {back ? "Back to question" : "Flip card"}
    </button>
  );
}

function CtrlBtn({
  active,
  onClick,
  Icon,
  label,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  Icon: any;
  label: string;
  variant?: "default" | "success";
}) {
  const activeStyle =
    variant === "success"
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
      : "bg-amber-400/20 text-amber-400 border-amber-400/40";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
        active ? activeStyle : "border-border/60 bg-muted/40 text-foreground/80 hover:bg-muted"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active && variant === "default" ? "fill-amber-400" : ""}`} />
      {label}
    </button>
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

function ProgRing({ pct }: { pct: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const d = (pct / 100) * c;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/40 bg-muted/30 p-3">
      <div className="relative h-[88px] w-[88px]">
        <svg viewBox="0 0 88 88" className="-rotate-90">
          <defs>
            <linearGradient id="ringSmall" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--neon-purple)" />
              <stop offset="100%" stopColor="var(--neon-blue)" />
            </linearGradient>
          </defs>
          <circle cx="44" cy="44" r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
          <circle cx="44" cy="44" r={r} stroke="url(#ringSmall)" strokeWidth="8" strokeLinecap="round" fill="none"
            strokeDasharray={`${d} ${c}`} className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-lg font-bold text-gradient">{pct}%</div>
        </div>
      </div>
      <div>
        <div className="text-xs font-semibold">Mastery</div>
        <div className="text-[11px] text-muted-foreground">Keep going — small daily wins compound.</div>
      </div>
    </div>
  );
}

/* ------------------------------ recommendations ------------------------------ */

function Recommendations() {
  const items = [
    { t: "Rotational Dynamics", reason: "Weak topic · 25% mastery", Icon: TrendingUp, c: "from-rose-500 to-amber-500" },
    { t: "Thermodynamics Laws", reason: "Continue studying", Icon: BookOpen, c: "from-[var(--neon-purple)] to-[var(--neon-blue)]" },
    { t: "Electromagnetic Induction", reason: "AI recommended", Icon: Sparkles, c: "from-fuchsia-500 to-purple-600" },
  ];
  return (
    <div className="glass rounded-3xl p-6 shadow-card-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-lg font-bold">Recommended Revision</div>
          <div className="text-xs text-muted-foreground">Smart picks based on your performance and study history.</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-purple)]">
          <Brain className="h-3 w-3" /> AI
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <button
            key={it.t}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-4 text-left transition hover:-translate-y-0.5"
          >
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${it.c} text-white shadow-glow`}>
              <it.Icon className="h-4 w-4" />
            </div>
            <div className="font-display mt-3 text-sm font-bold">{it.t}</div>
            <div className="text-[11px] text-muted-foreground">{it.reason}</div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gradient">
              Study now <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
