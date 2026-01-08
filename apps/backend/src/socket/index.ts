import { Server } from "socket.io";
import { registerDrawingHandlers } from "./drawing";
import { env } from "../config/env";
import { Server as HttpServer } from "node:http";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ["GET", "POST"],
    },
  });

  registerDrawingHandlers(io);

  return io;
}
