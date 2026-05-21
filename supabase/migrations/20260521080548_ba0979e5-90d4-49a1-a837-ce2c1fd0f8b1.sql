
-- Enum for video kinds
do $$ begin
  create type public.video_class_kind as enum ('youtube','playlist','upload');
exception when duplicate_object then null; end $$;

-- Main table
create table if not exists public.video_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text not null default 'professional',
  subject_id uuid,
  chapter_id uuid,
  instructor text,
  kind public.video_class_kind not null default 'youtube',
  youtube_url text,
  youtube_video_id text,
  youtube_playlist_id text,
  thumbnail_url text,
  duration_seconds integer not null default 0,
  playlist_key text,
  position integer not null default 0,
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  is_hidden boolean not null default false,
  is_featured boolean not null default false,
  scheduled_at timestamptz,
  view_count integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists video_classes_level_idx on public.video_classes(level);
create index if not exists video_classes_subject_idx on public.video_classes(subject_id);
create index if not exists video_classes_chapter_idx on public.video_classes(chapter_id);
create index if not exists video_classes_playlist_idx on public.video_classes(playlist_key);

alter table public.video_classes enable row level security;

drop policy if exists video_classes_admin_write on public.video_classes;
create policy video_classes_admin_write on public.video_classes
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists video_classes_read_published on public.video_classes;
create policy video_classes_read_published on public.video_classes
  for select to authenticated
  using (((status = 'published'::content_status) and (is_hidden = false)) or has_role(auth.uid(), 'admin'::app_role));

drop trigger if exists video_classes_set_updated_at on public.video_classes;
create trigger video_classes_set_updated_at
  before update on public.video_classes
  for each row execute function public.tg_set_updated_at();

-- Visibility singleton
create table if not exists public.video_class_visibility (
  id integer primary key default 1,
  section_hidden boolean not null default false,
  hidden_levels text[] not null default '{}',
  hidden_subject_ids uuid[] not null default '{}',
  hidden_chapter_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint video_class_visibility_singleton check (id = 1)
);

insert into public.video_class_visibility(id) values (1)
on conflict (id) do nothing;

alter table public.video_class_visibility enable row level security;

drop policy if exists vcv_admin_write on public.video_class_visibility;
create policy vcv_admin_write on public.video_class_visibility
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists vcv_read_all_auth on public.video_class_visibility;
create policy vcv_read_all_auth on public.video_class_visibility
  for select to authenticated using (true);

-- Realtime
alter table public.video_classes replica identity full;
alter table public.video_class_visibility replica identity full;
do $$ begin
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='video_classes';
  if not found then
    execute 'alter publication supabase_realtime add table public.video_classes';
  end if;
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='video_class_visibility';
  if not found then
    execute 'alter publication supabase_realtime add table public.video_class_visibility';
  end if;
end $$;
