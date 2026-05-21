
create table if not exists public.flash_card_visibility (
  id integer primary key default 1,
  section_hidden boolean not null default false,
  hidden_levels text[] not null default '{}',
  hidden_subject_ids uuid[] not null default '{}',
  hidden_chapter_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint flash_card_visibility_singleton check (id = 1)
);

insert into public.flash_card_visibility (id) values (1)
  on conflict (id) do nothing;

alter table public.flash_card_visibility enable row level security;

create policy "fcv_read_all_auth"
  on public.flash_card_visibility for select
  to authenticated
  using (true);

create policy "fcv_admin_write"
  on public.flash_card_visibility for all
  to authenticated
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

alter publication supabase_realtime add table public.flash_card_visibility;
