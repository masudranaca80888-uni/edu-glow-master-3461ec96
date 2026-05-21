export const DEMO_USERS = [
  { id: "demo-student-001", name: "Alex Morgan", email: "demo@student.com", role: "student", status: "active", joined: "2025-01-15" },
  { id: "demo-admin-001",   name: "Admin User",  email: "admin@edumaster.pro", role: "admin", status: "active", joined: "2024-09-01" },
  { id: "demo-student-002", name: "Priya Sharma", email: "priya@student.com", role: "student", status: "active", joined: "2025-02-20" },
  { id: "demo-student-003", name: "Rahul Verma",  email: "rahul@student.com", role: "student", status: "active", joined: "2025-03-10" },
];

export const DEMO_SUBJECTS = [
  { id: "subj-1", name: "Physics",     level: "Class 12", chapter_count: 15, mcq_count: 420 },
  { id: "subj-2", name: "Chemistry",   level: "Class 12", chapter_count: 18, mcq_count: 510 },
  { id: "subj-3", name: "Mathematics", level: "Class 12", chapter_count: 20, mcq_count: 680 },
  { id: "subj-4", name: "Biology",     level: "Class 11", chapter_count: 22, mcq_count: 590 },
  { id: "subj-5", name: "English",     level: "Class 11", chapter_count: 10, mcq_count: 220 },
];

export const DEMO_CHAPTERS = [
  { id: "ch-1", subject_id: "subj-1", name: "Electrostatics",     order: 1, mcq_count: 30 },
  { id: "ch-2", subject_id: "subj-1", name: "Current Electricity", order: 2, mcq_count: 28 },
  { id: "ch-3", subject_id: "subj-1", name: "Magnetic Effects",    order: 3, mcq_count: 32 },
  { id: "ch-4", subject_id: "subj-2", name: "Solid State",         order: 1, mcq_count: 26 },
  { id: "ch-5", subject_id: "subj-2", name: "Solutions",           order: 2, mcq_count: 24 },
  { id: "ch-6", subject_id: "subj-3", name: "Relations & Functions",order: 1, mcq_count: 35 },
  { id: "ch-7", subject_id: "subj-3", name: "Integrals",           order: 2, mcq_count: 40 },
];

export const DEMO_MCQS = [
  {
    id: "mcq-1", chapter_id: "ch-1", subject_id: "subj-1",
    question: "Which of the following is a scalar quantity?",
    options: ["Electric field", "Electric potential", "Electric dipole moment", "Magnetic field"],
    answer: 1, explanation: "Electric potential is a scalar quantity as it has only magnitude, not direction.",
    difficulty: "easy",
  },
  {
    id: "mcq-2", chapter_id: "ch-1", subject_id: "subj-1",
    question: "Gauss's law relates the electric flux to the",
    options: ["Total charge outside the surface", "Total enclosed charge", "Surface area only", "Medium permittivity only"],
    answer: 1, explanation: "Gauss's law states that electric flux through a closed surface equals the total enclosed charge divided by ε₀.",
    difficulty: "medium",
  },
  {
    id: "mcq-3", chapter_id: "ch-2", subject_id: "subj-1",
    question: "Ohm's law is NOT valid for",
    options: ["Copper wire", "Silver wire", "Semiconductor diode", "Resistor"],
    answer: 2, explanation: "Semiconductor diodes have a non-linear V-I characteristic, so Ohm's law does not apply.",
    difficulty: "easy",
  },
  {
    id: "mcq-4", chapter_id: "ch-6", subject_id: "subj-3",
    question: "The range of f(x) = sin x is",
    options: ["[0, 1]", "[-1, 1]", "(-∞, ∞)", "[0, ∞)"],
    answer: 1, explanation: "The sine function always produces values between -1 and 1, inclusive.",
    difficulty: "easy",
  },
];

export const DEMO_DASHBOARD_SNAPSHOT = {
  active_students: 12847,
  pending_drafts: 3,
  live_exams: 7,
  total_mcqs: 2420,
  new_registrations_today: 48,
  attempts_today: 1230,
  recent_activity: [
    { type: "signup",  message: "Priya Sharma joined",          time: "2m ago" },
    { type: "attempt", message: "Mock Test #12 completed — 94/100", time: "5m ago" },
    { type: "content", message: "15 new MCQs added to Physics", time: "12m ago" },
    { type: "signup",  message: "Rahul Verma joined",           time: "18m ago" },
    { type: "attempt", message: "Quiz: Electrostatics completed", time: "25m ago" },
  ],
};

export const DEMO_ANALYTICS = {
  registration_trend: [
    { month: "Nov", count: 820 }, { month: "Dec", count: 1040 },
    { month: "Jan", count: 1380 }, { month: "Feb", count: 1720 },
    { month: "Mar", count: 2100 }, { month: "Apr", count: 2640 },
    { month: "May", count: 3180 },
  ],
  attempt_activity: [
    { day: "Mon", attempts: 980 }, { day: "Tue", attempts: 1120 },
    { day: "Wed", attempts: 1340 }, { day: "Thu", attempts: 1180 },
    { day: "Fri", attempts: 1450 }, { day: "Sat", attempts: 1890 },
    { day: "Sun", attempts: 1560 },
  ],
  subject_performance: [
    { subject: "Physics",     avg_score: 68 },
    { subject: "Chemistry",   avg_score: 72 },
    { subject: "Mathematics", avg_score: 65 },
    { subject: "Biology",     avg_score: 75 },
    { subject: "English",     avg_score: 81 },
  ],
};

export const DEMO_STUDENT_PERFORMANCE = {
  user_id: "demo-student-001",
  accuracy: 92,
  streak_days: 24,
  xp: 8400,
  success_rate: 98,
  total_attempted: 1840,
  total_correct: 1693,
  weekly_scores: [
    { day: "Mon", score: 78 }, { day: "Tue", score: 84 },
    { day: "Wed", score: 91 }, { day: "Thu", score: 88 },
    { day: "Fri", score: 95 }, { day: "Sat", score: 89 },
    { day: "Sun", score: 93 },
  ],
  subject_breakdown: [
    { subject: "Physics",     correct: 340, attempted: 380, pct: 89 },
    { subject: "Chemistry",   correct: 410, attempted: 440, pct: 93 },
    { subject: "Mathematics", correct: 520, attempted: 560, pct: 93 },
    { subject: "Biology",     correct: 280, attempted: 310, pct: 90 },
    { subject: "English",     correct: 143, attempted: 150, pct: 95 },
  ],
};
