-- Ensure realtime publication includes every content + visibility + reference table
-- and that updates/deletes carry full row data so client subscriptions can react instantly.

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'mcqs',
    'quizzes',
    'quiz_questions',
    'short_notes',
    'short_notes_visibility',
    'flash_cards',
    'flash_card_visibility',
    'video_classes',
    'video_class_visibility',
    'question_bank_resources',
    'question_bank_visibility',
    'notifications',
    'notification_reads',
    'levels',
    'subjects',
    'chapters',
    'profiles',
    'user_roles',
    'exam_attempts'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;