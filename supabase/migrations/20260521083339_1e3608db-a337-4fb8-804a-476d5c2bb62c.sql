-- Master module visibility: admin-controlled on/off switches per top-level student module.
create table if not exists public.module_visibility (
  key text primary key,
  label text not null,
  hidden boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.module_visibility enable row level security;

drop policy if exists mv_read_all_auth on public.module_visibility;
create policy mv_read_all_auth on public.module_visibility
  for select to authenticated using (true);

drop policy if exists mv_admin_write on public.module_visibility;
create policy mv_admin_write on public.module_visibility
  for all to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

drop trigger if exists set_module_visibility_updated_at on public.module_visibility;
create trigger set_module_visibility_updated_at
  before update on public.module_visibility
  for each row execute function public.tg_set_updated_at();

insert into public.module_visibility (key, label) values
  ('mcq_practice','MCQ Practice'),
  ('quiz','Quiz'),
  ('mock_test','Mock Test'),
  ('flash_cards','Flash Cards'),
  ('short_notes','Short Notes'),
  ('qns_bank','Question Bank'),
  ('classes','Video Classes')
on conflict (key) do nothing;

alter table public.module_visibility replica identity full;
alter publication supabase_realtime add table public.module_visibility;