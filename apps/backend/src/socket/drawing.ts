import { DrawEvent } from "@whiteboard/shared-types";
import { Server } from "socket.io";
import { addStroke, getBoard, deleteStroke, undo, redo } from "../boardStore";

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

    socket.on("drawing:delete", (data: { boardId: string; strokeId: string }) => {
      if (!data?.boardId || !data.strokeId) return;

      const updatedBoard = deleteStroke(data.boardId, data.strokeId);

      // Broadcast the updated board state to all clients including sender
      io.to(data.boardId).emit("board:sync", updatedBoard);
    });

    socket.on("drawing:undo", (boardId: string) => {
      if (!boardId) return;

      const previousState = undo(boardId);

      if (previousState !== null) {
        // Broadcast the updated board state to all clients including sender
        io.to(boardId).emit("board:sync", previousState);
      }
    });

    socket.on("drawing:redo", (boardId: string) => {
      if (!boardId) return;

      const nextState = redo(boardId);

      if (nextState !== null) {
        // Broadcast the updated board state to all clients including sender
        io.to(boardId).emit("board:sync", nextState);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });
}
