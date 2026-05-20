
-- =====================================================================
-- ENUMS
-- =====================================================================
create type public.app_role as enum ('admin', 'moderator', 'student');
create type public.mcq_difficulty as enum ('easy', 'medium', 'hard');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.attempt_status as enum ('in_progress', 'completed', 'abandoned');

-- =====================================================================
-- PROFILES
-- =====================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  level text not null default 'professional',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_all_authenticated"
  on public.profiles for select to authenticated using (true);
create policy "profiles_update_self"
  on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_self"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

-- =====================================================================
-- USER ROLES (separate table — never store roles on profiles!)
-- =====================================================================
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "user_roles_select_self_or_admin"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "user_roles_admin_manage"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- HANDLE NEW USER TRIGGER → create profile + assign student role
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Learner'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- UPDATED_AT TRIGGER HELPER
-- =====================================================================
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger tg_profiles_updated before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- =====================================================================
-- SUBJECTS
-- =====================================================================
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  color text,
  status public.content_status not null default 'published',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subjects enable row level security;
create index idx_subjects_status on public.subjects(status);

create policy "subjects_read_published"
  on public.subjects for select to authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "subjects_admin_write"
  on public.subjects for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger tg_subjects_updated before update on public.subjects
  for each row execute function public.tg_set_updated_at();

-- =====================================================================
-- CHAPTERS
-- =====================================================================
create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  sort_order int not null default 0,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, slug)
);
alter table public.chapters enable row level security;
create index idx_chapters_subject on public.chapters(subject_id);

create policy "chapters_read_published"
  on public.chapters for select to authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "chapters_admin_write"
  on public.chapters for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger tg_chapters_updated before update on public.chapters
  for each row execute function public.tg_set_updated_at();

-- =====================================================================
-- MCQS
-- =====================================================================
create table public.mcqs (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option char(1) not null check (correct_option in ('A','B','C','D')),
  explanation text,
  difficulty public.mcq_difficulty not null default 'medium',
  tags text[] not null default '{}',
  status public.content_status not null default 'published',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mcqs enable row level security;
create index idx_mcqs_chapter on public.mcqs(chapter_id);
create index idx_mcqs_status on public.mcqs(status);
create index idx_mcqs_difficulty on public.mcqs(difficulty);

create policy "mcqs_read_published"
  on public.mcqs for select to authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "mcqs_admin_write"
  on public.mcqs for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger tg_mcqs_updated before update on public.mcqs
  for each row execute function public.tg_set_updated_at();

-- =====================================================================
-- QUIZZES + QUIZ QUESTIONS
-- =====================================================================
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject_id uuid references public.subjects(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  duration_seconds int not null default 600,
  total_questions int not null default 10,
  difficulty public.mcq_difficulty not null default 'medium',
  status public.content_status not null default 'published',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.quizzes enable row level security;
create index idx_quizzes_status on public.quizzes(status);

create policy "quizzes_read_published"
  on public.quizzes for select to authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "quizzes_admin_write"
  on public.quizzes for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger tg_quizzes_updated before update on public.quizzes
  for each row execute function public.tg_set_updated_at();

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  mcq_id uuid not null references public.mcqs(id) on delete cascade,
  position int not null default 0,
  unique (quiz_id, mcq_id)
);
alter table public.quiz_questions enable row level security;
create index idx_qq_quiz on public.quiz_questions(quiz_id);

create policy "qq_read_authenticated"
  on public.quiz_questions for select to authenticated using (true);
create policy "qq_admin_write"
  on public.quiz_questions for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- EXAM ATTEMPTS + ANSWERS
-- =====================================================================
create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  status public.attempt_status not null default 'in_progress',
  score int not null default 0,
  correct_count int not null default 0,
  total_count int not null default 0,
  duration_seconds int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.exam_attempts enable row level security;
create index idx_attempts_user on public.exam_attempts(user_id);
create index idx_attempts_quiz on public.exam_attempts(quiz_id);
create index idx_attempts_score on public.exam_attempts(score desc);

create policy "attempts_select_own_or_admin"
  on public.exam_attempts for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "attempts_insert_self"
  on public.exam_attempts for insert to authenticated
  with check (user_id = auth.uid());
create policy "attempts_update_self"
  on public.exam_attempts for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  mcq_id uuid not null references public.mcqs(id) on delete cascade,
  chosen_option char(1) check (chosen_option in ('A','B','C','D')),
  is_correct boolean not null default false,
  time_spent_ms int not null default 0,
  created_at timestamptz not null default now(),
  unique (attempt_id, mcq_id)
);
alter table public.attempt_answers enable row level security;
create index idx_answers_attempt on public.attempt_answers(attempt_id);

create policy "answers_select_own_or_admin"
  on public.attempt_answers for select to authenticated
  using (
    exists (select 1 from public.exam_attempts a
            where a.id = attempt_id
              and (a.user_id = auth.uid() or public.has_role(auth.uid(), 'admin')))
  );
create policy "answers_insert_own"
  on public.attempt_answers for insert to authenticated
  with check (
    exists (select 1 from public.exam_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );

-- =====================================================================
-- LEADERBOARD VIEW (no PII)
-- =====================================================================
create or replace view public.quiz_leaderboard
with (security_invoker = true)
as
select
  ea.quiz_id,
  ea.user_id,
  p.display_name,
  p.avatar_url,
  ea.score,
  ea.correct_count,
  ea.total_count,
  ea.duration_seconds,
  ea.completed_at
from public.exam_attempts ea
join public.profiles p on p.id = ea.user_id
where ea.status = 'completed';

-- =====================================================================
-- STORAGE BUCKET for MCQ imports (PDF / DOC / TXT)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('mcq-imports', 'mcq-imports', false)
on conflict (id) do nothing;

create policy "mcq_imports_admin_read"
  on storage.objects for select to authenticated
  using (bucket_id = 'mcq-imports' and public.has_role(auth.uid(), 'admin'));
create policy "mcq_imports_admin_write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'mcq-imports' and public.has_role(auth.uid(), 'admin'));
create policy "mcq_imports_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'mcq-imports' and public.has_role(auth.uid(), 'admin'));

-- =====================================================================
-- REALTIME on key tables (for live dashboards / notifications later)
-- =====================================================================
alter publication supabase_realtime add table public.exam_attempts;
alter publication supabase_realtime add table public.mcqs;
