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

    return () => {
      socket.off("board:init");
      socket.off("drawing:event");
    };
  }, [boardId]);

  const sendStroke = (stroke: DrawEvent) => {
    socket.emit("drawing:event", { boardId, stroke });
  };

  return { drawings, setDrawings, sendStroke };
}
