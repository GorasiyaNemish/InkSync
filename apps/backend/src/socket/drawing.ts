import { DrawEvent } from "@whiteboard/shared-types";
import { Server } from "socket.io";
import { addStroke, getBoard } from "../boardStore";

export function registerDrawingHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("join-board", (boardId: string) => {
      if (!boardId) return;
      socket.join(boardId);

      // 🔑 SEND EXISTING BOARD STATE
      const strokes = getBoard(boardId);
      socket.emit("board:init", strokes);
    });

    socket.on(
      "drawing:event",
      (data: { boardId: string; stroke: DrawEvent }) => {
        if (!data?.boardId || !data.stroke) return;

        addStroke(data.boardId, data.stroke);

        socket.to(data.boardId).emit("drawing:event", data.stroke);
      }
    );

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });
}
