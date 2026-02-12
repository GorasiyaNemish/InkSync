import { useEffect, useState } from "react";
import { socket } from "../socket";
import type { DrawEvent } from "@whiteboard/shared-types";

export function useBoardSocket(boardId: string) {
  const [drawings, setDrawings] = useState<DrawEvent[]>([]);

  useEffect(() => {
    socket.emit("join-board", boardId);

    socket.on("board:init", (strokes: DrawEvent[]) => {
      setDrawings(strokes);
    });

    socket.on("drawing:event", (stroke: DrawEvent) => {
      setDrawings((prev) => [...prev, stroke]);
    });

    // Listen for synchronized board state (for undo/redo/delete)
    socket.on("board:sync", (strokes: DrawEvent[]) => {
      setDrawings(strokes);
    });

    return () => {
      socket.off("board:init");
      socket.off("drawing:event");
      socket.off("board:sync");
    };
  }, [boardId]);

  const sendStroke = (stroke: DrawEvent) => {
    socket.emit("drawing:event", { boardId, stroke });
  };

  const deleteStroke = (strokeId: string) => {
    socket.emit("drawing:delete", { boardId, strokeId });
  };

  const undo = () => {
    socket.emit("drawing:undo", boardId);
  };

  const redo = () => {
    socket.emit("drawing:redo", boardId);
  };

  return { drawings, setDrawings, sendStroke, deleteStroke, undo, redo };
}
