
-- Question Bank Manager backend
DO $$ BEGIN
  CREATE TYPE public.qb_kind AS ENUM ('text','pdf','doc');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.question_bank_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  level text NOT NULL DEFAULT 'professional',
  subject_id uuid,
  chapter_id uuid,
  kind public.qb_kind NOT NULL DEFAULT 'text',
  resource_type text NOT NULL DEFAULT 'important', -- important | pyq | model | notes | text
  body text,
  file_url text,
  file_name text,
  file_size_bytes integer,
  question_count integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  status public.content_status NOT NULL DEFAULT 'draft',
  is_hidden boolean NOT NULL DEFAULT false,
  scheduled_at timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  download_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS qbr_level_idx ON public.question_bank_resources(level);
CREATE INDEX IF NOT EXISTS qbr_subject_idx ON public.question_bank_resources(subject_id);
CREATE INDEX IF NOT EXISTS qbr_chapter_idx ON public.question_bank_resources(chapter_id);
CREATE INDEX IF NOT EXISTS qbr_status_idx ON public.question_bank_resources(status, is_hidden);

ALTER TABLE public.question_bank_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS qbr_admin_write ON public.question_bank_resources;
CREATE POLICY qbr_admin_write ON public.question_bank_resources
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS qbr_read_published ON public.question_bank_resources;
CREATE POLICY qbr_read_published ON public.question_bank_resources
  FOR SELECT TO authenticated
  USING (((status = 'published'::content_status) AND (is_hidden = false)) OR has_role(auth.uid(),'admin'::app_role));

DROP TRIGGER IF EXISTS qbr_set_updated_at ON public.question_bank_resources;
CREATE TRIGGER qbr_set_updated_at BEFORE UPDATE ON public.question_bank_resources
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Visibility singleton
CREATE TABLE IF NOT EXISTS public.question_bank_visibility (
  id integer PRIMARY KEY DEFAULT 1,
  section_hidden boolean NOT NULL DEFAULT false,
  hidden_levels text[] NOT NULL DEFAULT '{}',
  hidden_subject_ids uuid[] NOT NULL DEFAULT '{}',
  hidden_chapter_ids uuid[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT qbv_singleton CHECK (id = 1)
);

INSERT INTO public.question_bank_visibility (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.question_bank_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS qbv_admin_write ON public.question_bank_visibility;
CREATE POLICY qbv_admin_write ON public.question_bank_visibility
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

DROP POLICY IF EXISTS qbv_read_all_auth ON public.question_bank_visibility;
CREATE POLICY qbv_read_all_auth ON public.question_bank_visibility
  FOR SELECT TO authenticated USING (true);

-- Storage bucket for question bank uploads (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-bank','question-bank', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read question-bank" ON storage.objects;
CREATE POLICY "Public read question-bank" ON storage.objects
  FOR SELECT USING (bucket_id = 'question-bank');

DROP POLICY IF EXISTS "Admins manage question-bank" ON storage.objects;
CREATE POLICY "Admins manage question-bank" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'question-bank' AND has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (bucket_id = 'question-bank' AND has_role(auth.uid(),'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.question_bank_resources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.question_bank_visibility;
