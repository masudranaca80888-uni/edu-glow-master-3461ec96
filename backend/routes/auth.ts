import { Router } from "express";
import { DEMO_USERS } from "../data/demo.js";

const router = Router();

const DEMO_CREDENTIALS: Record<string, { token: string; role: string }> = {
  "demo@student.com":    { token: "demo-token-student", role: "student" },
  "admin@edumaster.pro": { token: "demo-token-admin",   role: "admin"   },
};

const DEMO_PASSWORDS: Record<string, string> = {
  "demo@student.com":    "Demo@1234",
  "admin@edumaster.pro": "Admin@1234",
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const key = email.trim().toLowerCase();
  const expectedPw = DEMO_PASSWORDS[key];
  const cred = DEMO_CREDENTIALS[key];

  if (!expectedPw || !cred) {
    res.status(401).json({ error: "No account found for this email" });
    return;
  }
  if (password !== expectedPw) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const user = DEMO_USERS.find((u) => u.email === key);
  res.json({ token: cred.token, user });
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (_req, res) => {
  res.json({ ok: true });
});

/**
 * GET /api/auth/me  (requires Authorization: Bearer <token>)
 */
router.get("/me", (req, res) => {
  const header = req.headers.authorization ?? "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : "";

  const tokenMap: Record<string, string> = {
    "demo-token-student": "demo@student.com",
    "demo-token-admin":   "admin@edumaster.pro",
  };

  const email = tokenMap[token];
  if (!email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = DEMO_USERS.find((u) => u.email === email);
  res.json({ user });
});

export default router;
