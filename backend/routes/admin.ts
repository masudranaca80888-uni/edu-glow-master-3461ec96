import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import {
  DEMO_USERS,
  DEMO_SUBJECTS,
  DEMO_MCQS,
  DEMO_DASHBOARD_SNAPSHOT,
  DEMO_ANALYTICS,
} from "../data/demo.js";

const router = Router();

/**
 * GET /api/admin/dashboard
 */
router.get("/dashboard", requireAdmin, (_req, res) => {
  res.json(DEMO_DASHBOARD_SNAPSHOT);
});

/**
 * GET /api/admin/analytics
 */
router.get("/analytics", requireAdmin, (_req, res) => {
  res.json(DEMO_ANALYTICS);
});

/**
 * GET /api/admin/users
 * Query: ?role=student|admin&status=active
 */
router.get("/users", requireAdmin, (req, res) => {
  let users = [...DEMO_USERS];
  if (req.query.role)   users = users.filter((u) => u.role   === req.query.role);
  if (req.query.status) users = users.filter((u) => u.status === req.query.status);
  res.json({ users, total: users.length });
});

/**
 * GET /api/admin/users/:userId
 */
router.get("/users/:userId", requireAdmin, (req, res) => {
  const user = DEMO_USERS.find((u) => u.id === req.params.userId);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ user });
});

/**
 * GET /api/admin/subjects
 */
router.get("/subjects", requireAdmin, (_req, res) => {
  res.json({ subjects: DEMO_SUBJECTS, total: DEMO_SUBJECTS.length });
});

/**
 * POST /api/admin/subjects
 * Body: { name, level }
 */
router.post("/subjects", requireAdmin, (req, res) => {
  const { name, level } = req.body as { name?: string; level?: string };
  if (!name || !level) {
    res.status(400).json({ error: "name and level are required" });
    return;
  }
  const subject = { id: `subj-${Date.now()}`, name, level, chapter_count: 0, mcq_count: 0 };
  DEMO_SUBJECTS.push(subject);
  res.status(201).json({ subject });
});

/**
 * GET /api/admin/mcqs
 * Query: ?subject_id=&chapter_id=&limit=20&offset=0
 */
router.get("/mcqs", requireAdmin, (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  let mcqs = [...DEMO_MCQS];
  if (req.query.subject_id) mcqs = mcqs.filter((m) => m.subject_id === req.query.subject_id);
  if (req.query.chapter_id) mcqs = mcqs.filter((m) => m.chapter_id === req.query.chapter_id);
  res.json({ mcqs: mcqs.slice(offset, offset + limit), total: mcqs.length, limit, offset });
});

/**
 * POST /api/admin/mcqs
 * Body: { chapter_id, subject_id, question, options, answer, explanation, difficulty }
 */
router.post("/mcqs", requireAdmin, (req, res) => {
  const body = req.body as {
    chapter_id?: string; subject_id?: string; question?: string;
    options?: string[]; answer?: number; explanation?: string; difficulty?: string;
  };
  if (!body.question || !body.options || body.answer === undefined) {
    res.status(400).json({ error: "question, options, and answer are required" });
    return;
  }
  const mcq = {
    id: `mcq-${Date.now()}`,
    chapter_id:   body.chapter_id   ?? "",
    subject_id:   body.subject_id   ?? "",
    question:     body.question,
    options:      body.options,
    answer:       body.answer,
    explanation:  body.explanation  ?? "",
    difficulty:   body.difficulty   ?? "medium",
  };
  DEMO_MCQS.push(mcq);
  res.status(201).json({ mcq });
});

export default router;
