import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import {
  DEMO_SUBJECTS,
  DEMO_CHAPTERS,
  DEMO_MCQS,
  DEMO_STUDENT_PERFORMANCE,
} from "../data/demo.js";

const router = Router();

/**
 * GET /api/learning/subjects
 */
router.get("/subjects", requireAuth, (_req, res) => {
  res.json({ subjects: DEMO_SUBJECTS });
});

/**
 * GET /api/learning/subjects/:subjectId/chapters
 */
router.get("/subjects/:subjectId/chapters", requireAuth, (req, res) => {
  const { subjectId } = req.params;
  const chapters = DEMO_CHAPTERS.filter((c) => c.subject_id === subjectId);
  res.json({ chapters });
});

/**
 * GET /api/learning/chapters/:chapterId/mcqs
 * Query: ?limit=20&offset=0&difficulty=easy|medium|hard
 */
router.get("/chapters/:chapterId/mcqs", requireAuth, (req, res) => {
  const { chapterId } = req.params;
  const limit      = Math.min(parseInt(req.query.limit  as string) || 20, 100);
  const offset     = parseInt(req.query.offset as string) || 0;
  const difficulty = req.query.difficulty as string | undefined;

  let mcqs = DEMO_MCQS.filter((m) => m.chapter_id === chapterId);
  if (difficulty) mcqs = mcqs.filter((m) => m.difficulty === difficulty);

  res.json({
    mcqs: mcqs.slice(offset, offset + limit),
    total: mcqs.length,
    limit,
    offset,
  });
});

/**
 * GET /api/learning/mcqs  (all MCQs, paginated)
 */
router.get("/mcqs", requireAuth, (req, res) => {
  const limit  = Math.min(parseInt(req.query.limit  as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  res.json({
    mcqs: DEMO_MCQS.slice(offset, offset + limit),
    total: DEMO_MCQS.length,
    limit,
    offset,
  });
});

/**
 * POST /api/learning/attempts
 * Body: { mcq_id, selected_option, time_taken_ms }
 */
router.post("/attempts", requireAuth, (req: AuthRequest, res) => {
  const { mcq_id, selected_option } = req.body as {
    mcq_id?: string;
    selected_option?: number;
    time_taken_ms?: number;
  };

  if (mcq_id === undefined || selected_option === undefined) {
    res.status(400).json({ error: "mcq_id and selected_option are required" });
    return;
  }

  const mcq = DEMO_MCQS.find((m) => m.id === mcq_id);
  if (!mcq) {
    res.status(404).json({ error: "MCQ not found" });
    return;
  }

  const correct = selected_option === mcq.answer;
  res.json({
    ok: true,
    correct,
    correct_answer: mcq.answer,
    explanation: mcq.explanation,
    xp_earned: correct ? 10 : 2,
  });
});

/**
 * GET /api/learning/performance
 */
router.get("/performance", requireAuth, (_req, res) => {
  res.json(DEMO_STUDENT_PERFORMANCE);
});

export default router;
