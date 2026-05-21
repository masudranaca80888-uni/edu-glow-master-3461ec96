import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to every content + visibility table and invalidates the
 * matching React Query keys so any student view re-fetches instantly
 * when an admin publishes, edits, hides, or deletes content.
 *
 * Mounted once at the root — safe to call from any component.
 */
type TableMap = Record<string, string[]>;

const TABLE_QUERY_KEYS: TableMap = {
  mcqs: ["mcqs", "mcq", "question-bank"],
  quizzes: ["quizzes", "quiz", "mock-tests", "mocks"],
  quiz_questions: ["quizzes", "quiz", "mock-tests"],
  short_notes: ["short-notes", "shortNotes"],
  short_notes_visibility: ["short-notes", "shortNotes", "short-notes-visibility"],
  flash_cards: ["flash-cards", "flashCards"],
  flash_card_visibility: ["flash-cards", "flashCards", "flash-card-visibility"],
  video_classes: ["video-classes", "classes", "videoClasses"],
  video_class_visibility: ["video-classes", "classes", "video-class-visibility"],
  question_bank_resources: ["question-bank", "qns-bank", "questionBank"],
  question_bank_visibility: ["question-bank", "qns-bank", "question-bank-visibility"],
  notifications: ["notifications"],
  notification_reads: ["notifications"],
  levels: ["levels"],
  subjects: ["subjects"],
  chapters: ["chapters"],
  profiles: ["profile", "profiles", "users"],
  user_roles: ["users", "user-roles"],
  exam_attempts: ["exam-attempts", "analytics", "stats"],
};

export function useRealtimeInvalidator(enabled = true) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase.channel("global-realtime-invalidator");

    for (const table of Object.keys(TABLE_QUERY_KEYS)) {
      channel.on(
        "postgres_changes" as never,
        { event: "*", schema: "public", table },
        () => {
          const keys = TABLE_QUERY_KEYS[table];
          for (const key of keys) {
            qc.invalidateQueries({ queryKey: [key] });
            qc.invalidateQueries({
              predicate: (q) =>
                Array.isArray(q.queryKey) && q.queryKey[0] === key,
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
