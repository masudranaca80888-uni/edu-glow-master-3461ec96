
-- Extend subjects with level for cascade
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'professional';

-- Extend quizzes to support mock tests
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'quiz';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS level text NOT NULL DEFAULT 'professional';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS starts_at timestamptz;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS ends_at timestamptz;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS randomize_questions boolean NOT NULL DEFAULT true;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS randomize_options boolean NOT NULL DEFAULT false;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS negative_marking numeric NOT NULL DEFAULT 0;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS passing_marks integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_quizzes_kind_status ON public.quizzes (kind, status);
CREATE INDEX IF NOT EXISTS idx_quizzes_level ON public.quizzes (level);
CREATE INDEX IF NOT EXISTS idx_subjects_level ON public.subjects (level);

-- Trigger to keep updated_at fresh on quizzes
DROP TRIGGER IF EXISTS quizzes_set_updated_at ON public.quizzes;
CREATE TRIGGER quizzes_set_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.tg_set_updated_at();
