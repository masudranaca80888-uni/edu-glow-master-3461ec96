
-- Bookmarks: per user, per MCQ
create table if not exists public.mcq_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mcq_id uuid not null,
  chapter_id uuid,
  subject_id uuid,
  level text,
  created_at timestamptz not null default now(),
  unique (user_id, mcq_id)
);

create index if not exists mcq_bookmarks_user_idx on public.mcq_bookmarks(user_id);
create index if not exists mcq_bookmarks_chapter_idx on public.mcq_bookmarks(user_id, chapter_id);

alter table public.mcq_bookmarks enable row level security;

create policy "bookmarks_select_own"
  on public.mcq_bookmarks for select to authenticated
  using (user_id = auth.uid() or has_role(auth.uid(), 'admin'::app_role));
create policy "bookmarks_insert_self"
  on public.mcq_bookmarks for insert to authenticated
  with check (user_id = auth.uid());
create policy "bookmarks_delete_self"
  on public.mcq_bookmarks for delete to authenticated
  using (user_id = auth.uid());

-- Wrong questions tracking
create table if not exists public.mcq_wrong_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mcq_id uuid not null,
  chapter_id uuid,
  subject_id uuid,
  level text,
  last_chosen_option char(1),
  correct_option char(1),
  retry_count integer not null default 0,
  mastered boolean not null default false,
  first_wrong_at timestamptz not null default now(),
  last_wrong_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mcq_id)
);

create index if not exists mcq_wrong_user_idx on public.mcq_wrong_questions(user_id, mastered);
create index if not exists mcq_wrong_chapter_idx on public.mcq_wrong_questions(user_id, chapter_id);

alter table public.mcq_wrong_questions enable row level security;

create policy "wrongq_select_own"
  on public.mcq_wrong_questions for select to authenticated
  using (user_id = auth.uid() or has_role(auth.uid(), 'admin'::app_role));
create policy "wrongq_insert_self"
  on public.mcq_wrong_questions for insert to authenticated
  with check (user_id = auth.uid());
create policy "wrongq_update_self"
  on public.mcq_wrong_questions for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "wrongq_delete_self"
  on public.mcq_wrong_questions for delete to authenticated
  using (user_id = auth.uid());

create trigger trg_mcq_wrong_questions_updated_at
  before update on public.mcq_wrong_questions
  for each row execute function public.tg_set_updated_at();
