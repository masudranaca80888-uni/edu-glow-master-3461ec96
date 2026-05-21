import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "EduMaster Pro API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    supabase_configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    mode: process.env.SUPABASE_URL ? "live" : "demo",
  });
});

export default router;
