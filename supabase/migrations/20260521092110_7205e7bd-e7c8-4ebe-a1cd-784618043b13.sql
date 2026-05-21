
-- Enum for what kind of session an attempt represents
do $$ begin
  create type public.attempt_kind as enum ('mcq_practice','quiz','mock','custom_exam');
exception when duplicate_object then null; end $$;

-- Make quiz_id nullable so practice / custom-exam attempts (with no quiz row) can be stored
alter table public.exam_attempts
  alter column quiz_id drop not null;

alter table public.exam_attempts
  add column if not exists kind public.attempt_kind not null default 'quiz',
  add column if not exists subject_id uuid,
  add column if not exists chapter_id uuid,
  add column if not exists level text,
  add column if not exists attempt_number integer not null default 1,
  add column if not exists title text,
  add column if not exists meta jsonb not null default '{}'::jsonb;

create index if not exists exam_attempts_user_created_idx
  on public.exam_attempts (user_id, created_at desc);
create index if not exists exam_attempts_user_kind_idx
  on public.exam_attempts (user_id, kind, created_at desc);
create index if not exists exam_attempts_kind_status_idx
  on public.exam_attempts (kind, status, created_at desc);
create index if not exists exam_attempts_subject_idx
  on public.exam_attempts (subject_id);
create index if not exists exam_attempts_chapter_idx
  on public.exam_attempts (chapter_id);
