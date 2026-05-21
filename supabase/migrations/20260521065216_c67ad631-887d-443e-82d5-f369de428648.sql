
CREATE TYPE public.flash_card_type AS ENUM ('concept','formula','diagram','timeline','definition','other');

CREATE TABLE public.flash_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  level text NOT NULL DEFAULT 'professional',
  front text NOT NULL,
  back text NOT NULL,
  formula text,
  image_url text,
  card_type public.flash_card_type NOT NULL DEFAULT 'concept',
  tags text[] NOT NULL DEFAULT '{}',
  status public.content_status NOT NULL DEFAULT 'draft',
  is_hidden boolean NOT NULL DEFAULT false,
  scheduled_at timestamptz,
  view_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.flash_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY flash_cards_read_published
  ON public.flash_cards FOR SELECT TO authenticated
  USING (
    (status = 'published' AND is_hidden = false)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY flash_cards_admin_write
  ON public.flash_cards FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER flash_cards_set_updated_at
  BEFORE UPDATE ON public.flash_cards
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX flash_cards_subject_idx ON public.flash_cards(subject_id);
CREATE INDEX flash_cards_chapter_idx ON public.flash_cards(chapter_id);
CREATE INDEX flash_cards_status_idx ON public.flash_cards(status, is_hidden);

ALTER PUBLICATION supabase_realtime ADD TABLE public.flash_cards;
ALTER TABLE public.flash_cards REPLICA IDENTITY FULL;
