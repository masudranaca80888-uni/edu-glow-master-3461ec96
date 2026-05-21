import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useServerFn } from "@tanstack/react-start";
import {
  Search, Users, UserPlus, UserX, Crown, ShieldCheck, Activity,
  TrendingUp, Filter, Loader2, X, Save, Edit3, Eye,
  Sparkles, CircleDot, CheckCircle2, Pause, Play,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListUsers, adminUserStats, adminSetUserStatus, adminSetUserRole, adminUpdateUserProfile,
} from "@/lib/admin-users.functions";
import { adminListLevels } from "@/lib/admin-mcq.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type User = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  level: string;
  bio: string | null;
  status: "active" | "suspended" | "pending";
  created_at: string;
  updated_at: string;
  roles: string[];
};

const STATUS_TONE: Record<string, string> = {
  active: "border-emerald-400/40 bg-emerald-500/10 text-emerald-400",
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-400",
  suspended: "border-rose-400/40 bg-rose-500/10 text-rose-400",
};

export function UserManagementFlow() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListUsers);
  const statsFn = useServerFn(adminUserStats);
  const statusFn = useServerFn(adminSetUserStatus);
  const levelsFn = useServerFn(adminListLevels);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | null>(null);

  // realtime
  useEffect(() => {
    const ch = supabase
      .channel("users-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-users"] });
        qc.invalidateQueries({ queryKey: ["admin-user-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-users"] });
        qc.invalidateQueries({ queryKey: ["admin-user-stats"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const stats = useQuery({ queryKey: ["admin-user-stats"], queryFn: () => statsFn() });
  const levels = useQuery({ queryKey: ["admin-levels"], queryFn: () => levelsFn() });
  const debouncedSearch = useDebouncedValue(search, 300);
  const list = useQuery({
    queryKey: ["admin-users", { search: debouncedSearch, role, status, level, page }],
    queryFn: () => listFn({
      data: {
        search: debouncedSearch || undefined,
        role: role === "all" ? undefined : (role as "admin" | "moderator" | "student"),
        status: status === "all" ? undefined : (status as User["status"]),
        level: level === "all" ? undefined : level,
        page, pageSize: 25,
      },
    }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["admin-user-stats"] });
  };

  const statusM = useMutation({
    mutationFn: (v: { id: string; status: User["status"] }) => statusFn({ data: v }),
    onSuccess: (_d, v) => { toast.success(`User ${v.status}`); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (list.data?.rows ?? []) as User[];
  const total = list.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-4 p-4 lg:p-6">
      {/* Header */}
      <section className="glass shadow-card-soft relative overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--neon-purple)]/25 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-cta-gradient border-0 text-white shadow-glow">
              <Sparkles className="mr-1 h-3 w-3" /> Identity Control
            </Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              User <span className="text-gradient">Management</span>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Manage students, roles, permissions and account status — realtime, no refresh needed.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { l: "Total Users", v: stats.data?.total ?? 0, i: Users, c: "#a855f7" },
          { l: "Active", v: stats.data?.active ?? 0, i: Activity, c: "#22d3ee" },
          { l: "Pending", v: stats.data?.pending ?? 0, i: TrendingUp, c: "#fbbf24" },
          { l: "Suspended", v: stats.data?.suspended ?? 0, i: UserX, c: "#ef4444" },
          { l: "Admins", v: stats.data?.admins ?? 0, i: Crown, c: "#34d399" },
        ].map(({ l, v, i: Icon, c }) => (
          <div key={l} className="glass shadow-card-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${c}22`, color: c }}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight">{v.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{l}</p>
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="glass shadow-card-soft rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users by name…"
              className="h-9 rounded-xl pl-9"
            />
          </div>
          <Select value={role} onValueChange={(v) => { setRole(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {((levels.data as Array<{ code: string; name: string }> | undefined) ?? []).map((l) => (
                <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-auto text-[10px]"><Filter className="mr-1 h-3 w-3" />{total} users</Badge>
        </div>
      </section>

      {/* Table */}
      <section className="glass shadow-card-soft overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight">All Users</h3>
            <p className="text-[11px] text-muted-foreground">Page {page} of {totalPages} · live sync</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow" /> Realtime
          </div>
        </div>
        <div className="overflow-x-auto">
          {list.isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : rows.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              No users match the current filters.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-background/30 text-muted-foreground">
                <tr className="text-left">
                  {["User", "Level", "Roles", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-t border-border/30 hover:bg-background/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cta-gradient text-[11px] font-bold text-white shadow-glow">
                          {u.display_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{u.display_name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{u.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground capitalize">{u.level}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length === 0 && <span className="text-[10px] text-muted-foreground">none</span>}
                        {u.roles.map((r) => (
                          <Badge key={r} variant="outline" className="text-[10px] capitalize">{r}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] capitalize ${STATUS_TONE[u.status]}`}>
                        <CircleDot className="mr-1 h-2 w-2" />{u.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <IconBtn title="View / edit" onClick={() => setEditing(u)}><Eye className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title="Edit profile" onClick={() => setEditing(u)}><Edit3 className="h-3.5 w-3.5" /></IconBtn>
                        {u.status === "suspended" ? (
                          <IconBtn title="Reactivate" onClick={() => statusM.mutate({ id: u.id, status: "active" })}>
                            <Play className="h-3.5 w-3.5 text-emerald-400" />
                          </IconBtn>
                        ) : (
                          <IconBtn title="Suspend" onClick={() => { if (confirm(`Suspend ${u.display_name}?`)) statusM.mutate({ id: u.id, status: "suspended" }); }}>
                            <Pause className="h-3.5 w-3.5 text-amber-400" />
                          </IconBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 text-xs text-muted-foreground">
            <span>Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, total)} of {total}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        )}
      </section>

      {editing && (
        <UserEditorDialog
          user={editing}
          levels={(levels.data as Array<{ code: string; name: string }>) ?? []}
          onClose={() => setEditing(null)}
          onSaved={invalidate}
        />
      )}
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg border border-border/40 bg-background/40 p-1.5 hover:border-[var(--neon-purple)]/60 hover:text-[var(--neon-purple)]"
    >
      {children}
    </button>
  );
}

// ============================================================
// Editor dialog
// ============================================================
function UserEditorDialog({
  user, levels, onClose, onSaved,
}: {
  user: User;
  levels: Array<{ code: string; name: string }>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const profileFn = useServerFn(adminUpdateUserProfile);
  const roleFn = useServerFn(adminSetUserRole);
  const statusFn = useServerFn(adminSetUserStatus);

  const [form, setForm] = useState({
    display_name: user.display_name,
    level: user.level,
    bio: user.bio ?? "",
  });
  const [roles, setRoles] = useState<Set<string>>(new Set(user.roles));

  const save = useMutation({
    mutationFn: async () => {
      await profileFn({ data: { id: user.id, display_name: form.display_name, level: form.level, bio: form.bio || null } });
      // sync role grants/revokes
      const target = new Set(roles);
      const current = new Set(user.roles);
      const allRoles = ["admin", "moderator", "student"] as const;
      for (const r of allRoles) {
        const want = target.has(r);
        const had = current.has(r);
        if (want !== had) await roleFn({ data: { id: user.id, role: r, grant: want } });
      }
    },
    onSuccess: () => { toast.success("User updated"); onSaved(); onClose(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusM = useMutation({
    mutationFn: (s: User["status"]) => statusFn({ data: { id: user.id, status: s } }),
    onSuccess: (_d, s) => { toast.success(`Marked ${s}`); onSaved(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> {user.display_name}
          </DialogTitle>
          <DialogDescription>Manage profile, roles, and account status.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Display name</Label>
            <Input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
          </div>
          <div>
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div>
            <Label className="mb-2 block">Roles</Label>
            <div className="grid gap-2">
              {(["student", "moderator", "admin"] as const).map((r) => (
                <div key={r} className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm capitalize">
                    {r === "admin" ? <Crown className="h-4 w-4 text-amber-400" /> :
                     r === "moderator" ? <ShieldCheck className="h-4 w-4 text-sky-400" /> :
                     <UserPlus className="h-4 w-4 text-emerald-400" />}
                    {r}
                  </div>
                  <Switch
                    checked={roles.has(r)}
                    onCheckedChange={(v) => {
                      const next = new Set(roles);
                      if (v) next.add(r); else next.delete(r);
                      setRoles(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Account status</Label>
            <div className="flex gap-2">
              {(["active", "suspended", "pending"] as const).map((s) => (
                <Button
                  key={s}
                  variant={user.status === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => statusM.mutate(s)}
                  disabled={statusM.isPending}
                  className="capitalize"
                >
                  {s === "active" ? <CheckCircle2 className="mr-1 h-3 w-3" /> :
                   s === "suspended" ? <UserX className="mr-1 h-3 w-3" /> :
                   <Activity className="mr-1 h-3 w-3" />}
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}><X className="mr-1 h-4 w-4" />Close</Button>
          <Button className="bg-cta-gradient text-white" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
