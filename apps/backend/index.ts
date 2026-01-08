import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { registerDrawingHandlers } from "./src/socket/drawing";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});

// Register your Socket.IO handlers
registerDrawingHandlers(io);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express API 🚀" });
});

httpServer.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);

// app.listen(4000, () => console.log("API running on http://localhost:4000"));
