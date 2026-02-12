export type Tool = "pencil" | "rect" | "circle" | "triangle";

export interface LineShape {
  type: "line";
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface BoxShape {
  type: "rect" | "circle" | "triangle";
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  strokeWidth: number;
}

export type Shape = LineShape | BoxShape;

export type Point = { x: number; y: number };

export type DrawEvent = {
  id: string;
  tool: "pen" | "rect" | "circle" | "text" | "eraser";
  color: string;
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
};

export type DeleteEvent = {
  id: string;
  type: "delete";
};

export type UndoRedoAction = {
  type: "undo" | "redo";
};

export type BoardState = {
  boardId: string;
  strokes: DrawEvent[];
};
