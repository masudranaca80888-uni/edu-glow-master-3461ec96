
-- Re-define functions with explicit search_path already set (done) and revoke public EXECUTE.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.tg_set_updated_at() from public, anon, authenticated;

-- has_role is invoked from RLS policies; authenticated needs EXECUTE
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
