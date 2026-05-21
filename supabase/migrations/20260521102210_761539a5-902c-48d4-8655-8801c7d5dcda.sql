
-- Public avatars bucket for profile photos
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Anyone can view avatars (public bucket)
create policy "avatars_public_read"
on storage.objects for select
using (bucket_id = 'avatars');

-- Authenticated users can upload to their own folder (user-id/...)
create policy "avatars_user_insert"
on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_user_update"
on storage.objects for update to authenticated
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_user_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
