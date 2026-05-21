import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "student" | "admin";
  userEmail?: string;
}

const DEMO_TOKENS: Record<string, { id: string; email: string; role: "student" | "admin" }> = {
  "demo-token-student": { id: "demo-student-001", email: "demo@student.com",     role: "student" },
  "demo-token-admin":   { id: "demo-admin-001",   email: "admin@edumaster.pro",  role: "admin"   },
};

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const demo = DEMO_TOKENS[token];
  if (demo) {
    req.userId    = demo.id;
    req.userEmail = demo.email;
    req.userRole  = demo.role;
    return next();
  }

  res.status(401).json({ error: "Invalid or expired token" });
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if ((req as AuthRequest).userRole !== "admin") {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  });
}
