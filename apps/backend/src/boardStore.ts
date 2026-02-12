import { DrawEvent } from "@whiteboard/shared-types";

const boards = new Map<string, DrawEvent[]>();
const undoStacks = new Map<string, DrawEvent[][]>();
const redoStacks = new Map<string, DrawEvent[][]>();

// Track board metadata for cleanup
interface BoardMetadata {
  createdAt: Date;
  lastActivity: Date;
  activeConnections: number;
}

const boardMetadata = new Map<string, BoardMetadata>();

// Track valid board IDs (boards that were explicitly created)
const validBoardIds = new Set<string>();

// Auto-cleanup configuration
const BOARD_INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

// Create a new board
export function createBoard(boardId: string): boolean {
  if (validBoardIds.has(boardId)) {
    return false; // Board already exists
  }

  validBoardIds.add(boardId);
  boards.set(boardId, []);
  undoStacks.set(boardId, []);
  redoStacks.set(boardId, []);
  boardMetadata.set(boardId, {
    createdAt: new Date(),
    lastActivity: new Date(),
    activeConnections: 0,
  });

  console.log(`✨ Board ${boardId} created`);
  return true;
}

// Check if board exists
export function boardExists(boardId: string): boolean {
  return validBoardIds.has(boardId);
}

export function getBoard(boardId: string) {
  if (!validBoardIds.has(boardId)) {
    throw new Error(`Board ${boardId} does not exist`);
  }

  if (!boards.has(boardId)) {
    boards.set(boardId, []);
    undoStacks.set(boardId, []);
    redoStacks.set(boardId, []);
    boardMetadata.set(boardId, {
      createdAt: new Date(),
      lastActivity: new Date(),
      activeConnections: 0,
    });
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
  updateBoardActivity(boardId);
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

  updateBoardActivity(boardId);
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

  updateBoardActivity(boardId);
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

  updateBoardActivity(boardId);
  return nextState;
}

// Board lifecycle management
export function updateBoardActivity(boardId: string) {
  const metadata = boardMetadata.get(boardId);
  if (metadata) {
    metadata.lastActivity = new Date();
  }
}

export function incrementBoardConnections(boardId: string) {
  if (!validBoardIds.has(boardId)) {
    throw new Error(`Cannot join non-existent board ${boardId}`);
  }

  getBoard(boardId); // Ensure board exists
  const metadata = boardMetadata.get(boardId)!;
  metadata.activeConnections++;
  metadata.lastActivity = new Date();
}

export function decrementBoardConnections(boardId: string) {
  const metadata = boardMetadata.get(boardId);
  if (metadata) {
    metadata.activeConnections = Math.max(0, metadata.activeConnections - 1);
    metadata.lastActivity = new Date();

    // If no active connections, schedule cleanup check
    if (metadata.activeConnections === 0) {
      scheduleEmptyBoardCleanup(boardId);
    }
  }
}

export function destroyBoard(boardId: string) {
  boards.delete(boardId);
  undoStacks.delete(boardId);
  redoStacks.delete(boardId);
  boardMetadata.delete(boardId);
  validBoardIds.delete(boardId);
  console.log(`🗑️  Board ${boardId} destroyed`);
}

export function getBoardMetadata(boardId: string) {
  return boardMetadata.get(boardId);
}

export function getAllBoards() {
  return Array.from(boards.keys()).map(boardId => ({
    boardId,
    metadata: boardMetadata.get(boardId),
    strokeCount: boards.get(boardId)?.length || 0,
  }));
}

// Cleanup empty boards after a delay
function scheduleEmptyBoardCleanup(boardId: string) {
  setTimeout(() => {
    const metadata = boardMetadata.get(boardId);
    if (metadata && metadata.activeConnections === 0) {
      const timeSinceLastActivity = Date.now() - metadata.lastActivity.getTime();

      // Destroy board if it's been empty for 5 minutes
      if (timeSinceLastActivity > 5 * 60 * 1000) {
        destroyBoard(boardId);
      }
    }
  }, 5 * 60 * 1000); // Check after 5 minutes
}

// Periodic cleanup of inactive boards
function cleanupInactiveBoards() {
  const now = Date.now();

  for (const [boardId, metadata] of boardMetadata.entries()) {
    const timeSinceLastActivity = now - metadata.lastActivity.getTime();

    // Destroy boards that have been inactive for the timeout period
    if (timeSinceLastActivity > BOARD_INACTIVE_TIMEOUT) {
      destroyBoard(boardId);
    }
  }
}

// Start periodic cleanup
setInterval(cleanupInactiveBoards, CLEANUP_INTERVAL);

console.log(`🧹 Board cleanup service started (inactive timeout: ${BOARD_INACTIVE_TIMEOUT / 60000} minutes)`);
