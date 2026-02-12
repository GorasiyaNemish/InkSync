import { DrawEvent } from "@whiteboard/shared-types";

const boards = new Map<string, DrawEvent[]>();
const undoStacks = new Map<string, DrawEvent[][]>();
const redoStacks = new Map<string, DrawEvent[][]>();

export function getBoard(boardId: string) {
  if (!boards.has(boardId)) {
    boards.set(boardId, []);
    undoStacks.set(boardId, []);
    redoStacks.set(boardId, []);
  }
  return boards.get(boardId)!;
}

export function addStroke(boardId: string, stroke: DrawEvent) {
  const board = getBoard(boardId);

  // Save current state to undo stack before adding new stroke
  const undoStack = undoStacks.get(boardId)!;
  undoStack.push([...board]);

  // Clear redo stack when new action is performed
  redoStacks.set(boardId, []);

  board.push(stroke);
}

export function deleteStroke(boardId: string, strokeId: string) {
  const board = getBoard(boardId);
  const undoStack = undoStacks.get(boardId)!;

  // Save current state to undo stack
  undoStack.push([...board]);

  // Clear redo stack
  redoStacks.set(boardId, []);

  // Remove the stroke
  const index = board.findIndex(s => s.id === strokeId);
  if (index !== -1) {
    board.splice(index, 1);
  }

  return board;
}

export function undo(boardId: string) {
  const board = getBoard(boardId);
  const undoStack = undoStacks.get(boardId)!;
  const redoStack = redoStacks.get(boardId)!;

  if (undoStack.length === 0) return null;

  // Save current state to redo stack
  redoStack.push([...board]);

  // Restore previous state
  const previousState = undoStack.pop()!;
  boards.set(boardId, [...previousState]);

  return previousState;
}

export function redo(boardId: string) {
  const board = getBoard(boardId);
  const undoStack = undoStacks.get(boardId)!;
  const redoStack = redoStacks.get(boardId)!;

  if (redoStack.length === 0) return null;

  // Save current state to undo stack
  undoStack.push([...board]);

  // Restore next state
  const nextState = redoStack.pop()!;
  boards.set(boardId, [...nextState]);

  return nextState;
}
