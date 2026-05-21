import { useEffect, useRef, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to every content + visibility table and invalidates the
 * matching React Query keys so any student/admin view re-fetches instantly
 * when an admin publishes, edits, hides, or deletes content.
 *
 * Also publishes a tiny pub/sub bus (`realtimeBus`) that powers the
 * LiveIndicator, animated counters, and toast feedback throughout the UI.
 */

type RealtimeEvent = {
  table: string;
  type: "INSERT" | "UPDATE" | "DELETE";
  at: number;
};

type Listener = (event: RealtimeEvent) => void;

const listeners = new Set<Listener>();
let lastEvent: RealtimeEvent | null = null;
let totalEvents = 0;

export const realtimeBus = {
  emit(event: RealtimeEvent) {
    lastEvent = event;
    totalEvents += 1;
    listeners.forEach((l) => l(event));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get last() {
    return lastEvent;
  },
  get count() {
    return totalEvents;
  },
};

type TableMap = Record<string, { keys: string[]; label: string }>;

const TABLE_QUERY_KEYS: TableMap = {
  mcqs: { keys: ["mcqs", "mcq", "question-bank"], label: "MCQs" },
  quizzes: { keys: ["quizzes", "quiz", "mock-tests", "mocks"], label: "Quizzes" },
  quiz_questions: { keys: ["quizzes", "quiz", "mock-tests"], label: "Quiz questions" },
  short_notes: { keys: ["short-notes", "shortNotes"], label: "Short notes" },
  short_notes_visibility: { keys: ["short-notes", "shortNotes", "short-notes-visibility"], label: "Notes visibility" },
  flash_cards: { keys: ["flash-cards", "flashCards"], label: "Flash cards" },
  flash_card_visibility: { keys: ["flash-cards", "flashCards", "flash-card-visibility"], label: "Flash cards visibility" },
  video_classes: { keys: ["video-classes", "classes", "videoClasses"], label: "Classes" },
  video_class_visibility: { keys: ["video-classes", "classes", "video-class-visibility"], label: "Classes visibility" },
  question_bank_resources: { keys: ["question-bank", "qns-bank", "questionBank"], label: "Question bank" },
  question_bank_visibility: { keys: ["question-bank", "qns-bank", "question-bank-visibility"], label: "Question bank visibility" },
  notifications: { keys: ["notifications"], label: "Notifications" },
  notification_reads: { keys: ["notifications"], label: "Notifications" },
  levels: { keys: ["levels"], label: "Levels" },
  subjects: { keys: ["subjects"], label: "Subjects" },
  chapters: { keys: ["chapters"], label: "Chapters" },
  profiles: { keys: ["profile", "profiles", "users"], label: "Profiles" },
  user_roles: { keys: ["users", "user-roles"], label: "Roles" },
  exam_attempts: { keys: ["exam-attempts", "analytics", "stats"], label: "Attempts" },
};

export function useRealtimeInvalidator(enabled = true) {
  const qc = useQueryClient();
  const lastToastRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase.channel("global-realtime-invalidator");

    for (const table of Object.keys(TABLE_QUERY_KEYS)) {
      channel.on(
        "postgres_changes" as never,
        { event: "*", schema: "public", table },
        (payload: { eventType: "INSERT" | "UPDATE" | "DELETE" }) => {
          const meta = TABLE_QUERY_KEYS[table];
          for (const key of meta.keys) {
            qc.invalidateQueries({ queryKey: [key] });
            qc.invalidateQueries({
              predicate: (q) =>
                Array.isArray(q.queryKey) && q.queryKey[0] === key,
            });
          }

          const now = Date.now();
          realtimeBus.emit({ table, type: payload.eventType, at: now });

          // Throttle toasts so a burst of changes doesn't spam the screen.
          if (now - lastToastRef.current > 1500) {
            lastToastRef.current = now;
            toast.success(`${meta.label} updated`, {
              description: "Live sync just refreshed your view.",
              duration: 1800,
            });
          }
        },
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, qc]);
}

/**
 * Tiny hook that re-renders whenever a realtime event fires.
 * Returns { count, last } so components can react to live activity.
 */
export function useRealtimeActivity() {
  return useSyncExternalStore(
    (cb) => realtimeBus.subscribe(cb),
    () => realtimeBus.count,
    () => 0,
  );
}
