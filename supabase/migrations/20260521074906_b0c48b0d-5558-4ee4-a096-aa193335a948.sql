
-- enum for note content type
do $$ begin
  create type public.short_note_kind as enum ('text','pdf','doc');
exception when duplicate_object then null; end $$;

create table if not exists public.short_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  level text not null default 'professional',
  subject_id uuid references public.subjects(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  kind public.short_note_kind not null default 'text',
  body text,
  file_url text,
  file_name text,
  file_size_bytes integer,
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  is_hidden boolean not null default false,
  scheduled_at timestamptz,
  view_count integer not null default 0,
  download_count integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_short_notes_subject on public.short_notes(subject_id);
create index if not exists idx_short_notes_chapter on public.short_notes(chapter_id);
create index if not exists idx_short_notes_level on public.short_notes(level);
create index if not exists idx_short_notes_status on public.short_notes(status);

alter table public.short_notes enable row level security;

create policy short_notes_admin_write on public.short_notes
  for all to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

create policy short_notes_read_published on public.short_notes
  for select to authenticated
  using ((status = 'published' and is_hidden = false) or has_role(auth.uid(), 'admin'));

drop trigger if exists trg_short_notes_updated on public.short_notes;
create trigger trg_short_notes_updated
  before update on public.short_notes
  for each row execute function public.tg_set_updated_at();

-- Visibility singleton
create table if not exists public.short_notes_visibility (
  id integer primary key default 1,
  section_hidden boolean not null default false,
  hidden_levels text[] not null default '{}',
  hidden_subject_ids uuid[] not null default '{}',
  hidden_chapter_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint short_notes_visibility_singleton check (id = 1)
);

insert into public.short_notes_visibility (id) values (1) on conflict (id) do nothing;

alter table public.short_notes_visibility enable row level security;

create policy snv_admin_write on public.short_notes_visibility
  for all to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

create policy snv_read_all_auth on public.short_notes_visibility
  for select to authenticated using (true);

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('short-notes','short-notes', true)
on conflict (id) do nothing;

create policy "short-notes public read"
  on storage.objects for select
  using (bucket_id = 'short-notes');

create policy "short-notes admin write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'short-notes' and has_role(auth.uid(), 'admin'));

create policy "short-notes admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'short-notes' and has_role(auth.uid(), 'admin'));

create policy "short-notes admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'short-notes' and has_role(auth.uid(), 'admin'));
