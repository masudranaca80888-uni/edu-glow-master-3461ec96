import type { AppRole } from "@/lib/app-data";

export function fakeApi<T>(data: T, delay = 650): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(data), delay));
}

export async function fakeLogin(input: { email: string; password: string; role: AppRole }) {
  if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");
  return fakeApi({
    name: input.role === "admin" ? "Admin" : input.email.split("@")[0] || "Mahfuz",
    email: input.email,
    role: input.role,
  });
}

export async function fakeSubmit<T>(payload: T) {
  return fakeApi({ ok: true, payload, id: crypto.randomUUID?.() ?? String(Date.now()) });
}