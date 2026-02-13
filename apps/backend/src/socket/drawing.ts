import { DrawEvent } from "@whiteboard/shared-types";
import { Server } from "socket.io";
import { addStroke, getBoard, deleteStroke, undo, redo, incrementBoardConnections, decrementBoardConnections, destroyBoard, createBoard, boardExists } from "../boardStore";

// Track which boards each socket is connected to
const socketBoards = new Map<string, Set<string>>();

export function registerDrawingHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("client connected", socket.id);
    socketBoards.set(socket.id, new Set());

    // Create a new board
    socket.on("board:create", (boardId: string, callback) => {
      if (!boardId) {
        callback?.({ success: false, error: "Board ID is required" });
        return;
      }

      const created = createBoard(boardId);
      if (created) {
        console.log(`✨ Board ${boardId} created by ${socket.id}`);
        callback?.({ success: true });
      } else {
        callback?.({ success: false, error: "Board already exists" });
      }
    });

    // Check if board exists
    socket.on("board:check", (boardId: string, callback) => {
      const exists = boardExists(boardId);
      callback?.({ exists });
    });

    socket.on("join-board", (boardId: string) => {
      if (!boardId) return;

      // Check if board exists
      if (!boardExists(boardId)) {
        socket.emit("board:not-found", boardId);
        console.log(`❌ User tried to join non-existent board ${boardId}`);
        return;
      }

      socket.join(boardId);

      // Track this connection
      const boards = socketBoards.get(socket.id);
      if (boards) {
        boards.add(boardId);
      }

      try {
        incrementBoardConnections(boardId);

        // 🔑 SEND EXISTING BOARD STATE
        const strokes = getBoard(boardId);
        socket.emit("board:init", strokes);

        console.log(`📋 User joined board ${boardId}`);
      } catch (error) {
        console.error(`Error joining board ${boardId}:`, error);
        socket.emit("board:not-found", boardId);
      }
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

    // Manual board destruction
    socket.on("board:destroy", (boardId: string) => {
      if (!boardId) return;

      // Notify all users in the board
      io.to(boardId).emit("board:destroyed");

      // Destroy the board
      destroyBoard(boardId);

      console.log(`🗑️  Board ${boardId} manually destroyed by user`);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);

      // Decrement connection count for all boards this socket was in
      const boards = socketBoards.get(socket.id);
      if (boards) {
        boards.forEach(boardId => {
          decrementBoardConnections(boardId);
        });
        socketBoards.delete(socket.id);
      }
    });
  });
}
