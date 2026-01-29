import express from "express";
import cors from "cors";
import { env } from "./config/env";
import path from "node:path";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.use((_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
