import express from "express";
import cors from "cors";
import "dotenv/config";

import healthRouter   from "./routes/health.js";
import authRouter     from "./routes/auth.js";
import learningRouter from "./routes/learning.js";
import adminRouter    from "./routes/admin.js";

const app  = express();
const PORT = parseInt(process.env.API_PORT ?? "3001", 10);

app.use(cors({
  origin: [
    "http://localhost:5000",
    "http://0.0.0.0:5000",
    /\.replit\.dev$/,
    /\.replit\.app$/,
  ],
  credentials: true,
}));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/health",   healthRouter);
app.use("/api/auth",     authRouter);
app.use("/api/learning", learningRouter);
app.use("/api/admin",    adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[API Error]", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "localhost", () => {
  console.log(`\n  EduMaster Pro API  ready`);
  console.log(`  ➜  http://localhost:${PORT}/api/health\n`);
});

export default app;
