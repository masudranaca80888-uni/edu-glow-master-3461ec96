import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const roleEnum = z.enum(["admin", "moderator", "student"]);
const statusEnum = z.enum(["active", "suspended", "pending"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

const listInput = z.object({
  search: z.string().trim().max(200).optional(),
  role: roleEnum.optional(),
  status: statusEnum.optional(),
  level: z.string().trim().max(40).optional(),
  page: z.number().int().min(1).max(2000).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export const adminListUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: z.infer<typeof listInput>) => listInput.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = sb
      .from("profiles")
      .select("id,display_name,avatar_url,level,bio,status,created_at,updated_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (data.status) q = q.eq("status", data.status);
    if (data.level) q = q.eq("level", data.level);
    if (data.search) q = q.ilike("display_name", `%${data.search}%`);
    const { data: profiles, error, count } = await q;
    if (error) throw error;

    const ids = (profiles ?? []).map((p: { id: string }) => p.id);
    let rolesMap = new Map<string, string[]>();
    if (ids.length) {
      const { data: rs } = await sb.from("user_roles").select("user_id,role").in("user_id", ids);
      for (const r of rs ?? []) {
        const arr = rolesMap.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesMap.set(r.user_id, arr);
      }
    }

    let rows = (profiles ?? []).map((p: { id: string }) => ({
      ...p,
      roles: rolesMap.get(p.id) ?? [],
    }));

    if (data.role) rows = rows.filter((r) => r.roles.includes(data.role!));

    return { rows, count: count ?? 0, page: data.page, pageSize: data.pageSize };
  });

export const adminUserStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    const [total, active, suspended, pending, admins] = await Promise.all([
      sb.from("profiles").select("id", { count: "exact", head: true }),
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "suspended"),
      sb.from("profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
      sb.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "admin"),
    ]);
    return {
      total: total.count ?? 0,
      active: active.count ?? 0,
      suspended: suspended.count ?? 0,
      pending: pending.count ?? 0,
      admins: admins.count ?? 0,
    };
  });

export const adminSetUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: z.infer<typeof statusEnum> }) =>
    z.object({ id: z.string().uuid(), status: statusEnum }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("profiles").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; role: z.infer<typeof roleEnum>; grant: boolean }) =>
    z.object({ id: z.string().uuid(), role: roleEnum, grant: z.boolean() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const sb = context.supabase;
    if (data.grant) {
      const { error } = await sb
        .from("user_roles")
        .upsert({ user_id: data.id, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await sb
        .from("user_roles")
        .delete()
        .eq("user_id", data.id)
        .eq("role", data.role);
      if (error) throw error;
    }
    return { ok: true };
  });

export const adminUpdateUserProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; display_name?: string; level?: string; bio?: string | null }) =>
    z.object({
      id: z.string().uuid(),
      display_name: z.string().trim().min(1).max(120).optional(),
      level: z.string().trim().max(40).optional(),
      bio: z.string().trim().max(1000).nullable().optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("profiles").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });
