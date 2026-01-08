import { DrawEvent } from "@whiteboard/shared-types";

const boards = new Map<string, DrawEvent[]>();

export function getBoard(boardId: string) {
  if (!boards.has(boardId)) {
    boards.set(boardId, []);
  }
  return boards.get(boardId)!;
}

export function addStroke(boardId: string, stroke: DrawEvent) {
  getBoard(boardId).push(stroke);
}
