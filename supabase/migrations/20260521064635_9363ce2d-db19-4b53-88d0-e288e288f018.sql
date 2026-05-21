
CREATE TABLE IF NOT EXISTS public.levels (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY levels_read_published
  ON public.levels FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY levels_admin_write
  ON public.levels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER levels_set_updated_at
  BEFORE UPDATE ON public.levels
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.levels (code, name, description, color, icon, sort_order) VALUES
  ('certificate', 'Certificate', 'Foundational certificate-level curriculum', '#22d3ee', 'GraduationCap', 1),
  ('professional', 'Professional', 'Professional-level core curriculum', '#a855f7', 'Briefcase', 2),
  ('advanced', 'Advanced', 'Advanced and strategic-level curriculum', '#f43f5e', 'Trophy', 3)
ON CONFLICT (code) DO NOTHING;
