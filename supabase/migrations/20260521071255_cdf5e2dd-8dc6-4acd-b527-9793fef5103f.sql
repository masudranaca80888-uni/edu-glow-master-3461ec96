-- ============ profiles.status ============
do $$ begin
  create type public.profile_status as enum ('active','suspended','pending');
exception when duplicate_object then null; end $$;

alter table public.profiles
  add column if not exists status public.profile_status not null default 'active';

-- ============ notifications ============
do $$ begin
  create type public.notification_type as enum ('announcement','push','email','in_app');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_priority as enum ('low','medium','high','critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_status as enum ('draft','scheduled','sent','failed','paused');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_audience as enum ('all','level','subject','role','users');
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body  text not null default '',
  link  text,
  type  public.notification_type not null default 'in_app',
  priority public.notification_priority not null default 'medium',
  status public.notification_status not null default 'draft',
  audience public.notification_audience not null default 'all',
  audience_level text,
  audience_subject_id uuid,
  audience_role public.app_role,
  audience_user_ids uuid[] not null default '{}',
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivered_count integer not null default 0,
  open_count integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notifications_status_idx on public.notifications(status);
create index if not exists notifications_sent_at_idx on public.notifications(sent_at desc);

drop trigger if exists set_notifications_updated_at on public.notifications;
create trigger set_notifications_updated_at
before update on public.notifications
for each row execute function public.tg_set_updated_at();

alter table public.notifications enable row level security;

drop policy if exists notifications_admin_all on public.notifications;
create policy notifications_admin_all on public.notifications
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

drop policy if exists notifications_read_targeted on public.notifications;
create policy notifications_read_targeted on public.notifications
  for select to authenticated
  using (
    public.has_role(auth.uid(),'admin')
    or (
      status = 'sent'
      and (
        audience = 'all'
        or (audience = 'level' and exists(select 1 from public.profiles p where p.id = auth.uid() and p.level = notifications.audience_level))
        or (audience = 'role'  and audience_role is not null and public.has_role(auth.uid(), audience_role))
        or (audience = 'users' and auth.uid() = any(audience_user_ids))
        or (audience = 'subject') -- subject-level visibility handled in app
      )
    )
  );

-- ============ notification_reads ============
create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);

alter table public.notification_reads enable row level security;

drop policy if exists nr_self_rw on public.notification_reads;
create policy nr_self_rw on public.notification_reads
  for all to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- realtime
alter publication supabase_realtime add table public.notifications;