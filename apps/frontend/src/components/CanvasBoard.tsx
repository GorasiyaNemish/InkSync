import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
import { useRef, useState, useEffect } from "react";
import { useTool } from "../context/ToolContext";
import type { DrawEvent } from "@whiteboard/shared-types";
import { useBoardSocket } from "../hooks/useBoardSocket";
import Konva from "konva";

interface CanvasStageProps {
  boardId: string;
  onZoomChange?: (scale: number, position: { x: number; y: number }) => void;
}

export default function CanvasStage({
  boardId,
  onZoomChange,
}: CanvasStageProps) {
  const { tool, color } = useTool();

  const { drawings, setDrawings, sendStroke, deleteStroke, undo, redo } =
    useBoardSocket(boardId);

  const [editingText, setEditingText] = useState<DrawEvent | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isTyping = useRef(false);
  const ignoreInitialBlur = useRef(false);

  const isDrawing = useRef(false);
  const currentId = useRef<string | null>(null);
  const currentStroke = useRef<DrawEvent | null>(null);

  // Zoom and Pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const isPanning = useRef(false);
  const lastPanPosition = useRef({ x: 0, y: 0 });

  // Eraser cursor position
  const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(
    null
  );

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  /* ---------------- ZOOM & PAN ---------------- */

  // Notify parent of zoom changes
  useEffect(() => {
    if (onZoomChange) {
      onZoomChange(scale, position);
    }
  }, [scale, position, onZoomChange]);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    // Zoom in/out
    const scaleBy = 1.1;
    const newScale =
      e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Limit zoom range
    const clampedScale = Math.max(0.1, Math.min(5, newScale));

    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  // Expose zoom control methods
  const zoomIn = () => {
    const newScale = Math.min(5, scale * 1.2);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(0.1, scale / 1.2);
    setScale(newScale);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Expose methods to parent (if needed)
  useEffect(() => {
    (window as any).canvasZoomControls = { zoomIn, zoomOut, resetZoom, scale };
  }, [scale]);

  /* ---------------- PINCH TO ZOOM (MOBILE) ---------------- */

  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const getTouchDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = (e: any) => {
    const touches = e.evt.touches;

    if (touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      e.evt.preventDefault();
      const touch1 = touches[0];
      const touch2 = touches[1];

      lastTouchDistance.current = getTouchDistance(touch1, touch2);
      lastTouchCenter.current = getTouchCenter(touch1, touch2);
    }
  };

  const handleTouchMove = (e: any) => {
    const touches = e.evt.touches;

    if (touches.length === 2 && lastTouchDistance.current !== null) {
      // Pinch zoom in progress
      e.evt.preventDefault();

      const touch1 = touches[0];
      const touch2 = touches[1];
      const currentDistance = getTouchDistance(touch1, touch2);
      const currentCenter = getTouchCenter(touch1, touch2);

      const stage = stageRef.current;
      if (!stage || !lastTouchCenter.current) return;

      // Calculate zoom
      const scaleChange = currentDistance / lastTouchDistance.current!;
      const oldScale = scale;
      const newScale = Math.max(0.1, Math.min(5, oldScale * scaleChange));

      // Get the touch center relative to the stage
      const rect = stage.container().getBoundingClientRect();
      const centerPoint = {
        x: currentCenter.x - rect.left,
        y: currentCenter.y - rect.top,
      };

      // Calculate the point in canvas coordinates
      const pointTo = {
        x: (centerPoint.x - position.x) / oldScale,
        y: (centerPoint.y - position.y) / oldScale,
      };

      // Calculate new position
      const newPosition = {
        x: centerPoint.x - pointTo.x * newScale,
        y: centerPoint.y - pointTo.y * newScale,
      };

      setScale(newScale);
      setPosition(newPosition);

      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    }
  };

  const handleTouchEnd = (e: any) => {
    const touches = e.evt.touches;

    if (touches.length < 2) {
      // Reset pinch zoom state
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    }
  };

  /* ---------------- DRAWING ---------------- */

  const onMouseDown = (e: any) => {
    if (isTyping.current) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    // Middle mouse button for panning
    if (e.evt.button === 1) {
      isPanning.current = true;
      lastPanPosition.current = { x: pos.x, y: pos.y };
      return;
    }

    // Transform position based on zoom/pan
    const transformedPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    // Eraser tool - delete on click
    if (tool === "eraser") {
      const clickedStroke = findStrokeAtPosition(transformedPos);
      if (clickedStroke) {
        deleteStroke(clickedStroke.id);
      }
      return;
    }

    if (tool === "text") {
      const textStroke: DrawEvent = {
        id: crypto.randomUUID(),
        tool: "text",
        color,
        x: transformedPos.x,
        y: transformedPos.y,
        text: "",
      };

      ignoreInitialBlur.current = true;
      isTyping.current = true;
      setEditingText(textStroke);
      return;
    }

    // OTHER TOOLS
    isDrawing.current = true;
    const id = crypto.randomUUID();
    currentId.current = id;

    const stroke: DrawEvent =
      tool === "pen"
        ? { id, tool, color, points: [transformedPos.x, transformedPos.y] }
        : {
          id,
          tool,
          color,
          x: transformedPos.x,
          y: transformedPos.y,
          width: 0,
          height: 0,
        };

    currentStroke.current = stroke;
    setDrawings((prev) => [...prev, stroke]);
  };

  const onMouseMove = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;

    // Update eraser cursor position
    if (tool === "eraser") {
      const transformedPos = {
        x: (pos.x - position.x) / scale,
        y: (pos.y - position.y) / scale,
      };
      setEraserPos(transformedPos);
    } else {
      setEraserPos(null);
    }

    // Handle panning
    if (isPanning.current) {
      const dx = pos.x - lastPanPosition.current.x;
      const dy = pos.y - lastPanPosition.current.y;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
      lastPanPosition.current = { x: pos.x, y: pos.y };
      return;
    }

    if (isTyping.current) return;
    if (!isDrawing.current || !currentId.current) return;

    const transformedPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    setDrawings((prev) =>
      prev.map((d) => {
        if (d.id !== currentId.current) return d;

        const updated =
          d.tool === "pen"
            ? { ...d, points: [...(d.points || []), transformedPos.x, transformedPos.y] }
            : {
              ...d,
              width: transformedPos.x - (d.x || 0),
              height: transformedPos.y - (d.y || 0),
            };

        currentStroke.current = updated;
        return updated;
      })
    );
  };

  const onMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      return;
    }

    if (tool === "text" || tool === "eraser") return;

    isDrawing.current = false;

    if (currentStroke.current) {
      sendStroke(currentStroke.current);
    }

    currentId.current = null;
    currentStroke.current = null;
  };

  const finalizeText = (value: string) => {
    if (!editingText) return;

    const trimmed = value.trim();
    isTyping.current = false;
    setEditingText(null);

    if (!trimmed) return;

    const stroke: DrawEvent = {
      ...editingText,
      text: trimmed,
    };

    setDrawings((prev) => [...prev, stroke]);
    sendStroke(stroke);
  };

  // Helper function to find stroke at position
  const findStrokeAtPosition = (pos: { x: number; y: number }) => {
    // Increased tolerance for better eraser detection
    const tolerance = 15 / scale; // Adjust tolerance based on zoom

    // Check in reverse order (top to bottom)
    for (let i = drawings.length - 1; i >= 0; i--) {
      const d = drawings[i];

      if (d.tool === "pen" && d.points) {
        // Check if click is near any segment of the line
        for (let j = 0; j < d.points.length - 2; j += 2) {
          const x1 = d.points[j];
          const y1 = d.points[j + 1];
          const x2 = d.points[j + 2];
          const y2 = d.points[j + 3];

          // Distance from point to line segment
          const dist = distanceToLineSegment(pos, { x: x1, y: y1 }, { x: x2, y: y2 });
          if (dist < tolerance) return d;
        }
      } else if (d.tool === "rect") {
        const x = d.x || 0;
        const y = d.y || 0;
        const w = d.width || 0;
        const h = d.height || 0;

        // Check if point is inside rectangle (with tolerance for borders)
        if (
          pos.x >= Math.min(x, x + w) - tolerance &&
          pos.x <= Math.max(x, x + w) + tolerance &&
          pos.y >= Math.min(y, y + h) - tolerance &&
          pos.y <= Math.max(y, y + h) + tolerance
        ) {
          return d;
        }
      } else if (d.tool === "circle") {
        const dist = Math.sqrt(
          (pos.x - (d.x || 0)) ** 2 + (pos.y - (d.y || 0)) ** 2
        );
        const radius = Math.abs(d.width || 0);
        if (Math.abs(dist - radius) < tolerance || dist < radius) {
          return d;
        }
      } else if (d.tool === "text") {
        // Better bounding box for text
        const textWidth = (d.text?.length || 0) * 10;
        const textHeight = 20;
        if (
          pos.x >= (d.x || 0) - tolerance &&
          pos.x <= (d.x || 0) + textWidth + tolerance &&
          pos.y >= (d.y || 0) - tolerance &&
          pos.y <= (d.y || 0) + textHeight + tolerance
        ) {
          return d;
        }
      }
    }
    return null;
  };

  // Helper function to calculate distance from point to line segment
  const distanceToLineSegment = (
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ) => {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
      // Line segment is a point
      return Math.sqrt(
        (point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2
      );
    }

    // Calculate projection of point onto line segment
    let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));

    const projX = lineStart.x + t * dx;
    const projY = lineStart.y + t * dy;

    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  };

  /* ---------------- TOUCH SUPPORT ---------------- */

  const getTouchPos = (e: any) => {
    const stage = stageRef.current;
    if (!stage) return null;

    const touch = e.evt.touches[0] || e.evt.changedTouches[0];
    if (!touch) return null;

    const rect = stage.container().getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const onTouchStart = (e: any) => {
    const touches = e.evt.touches;

    // Two finger touch - pinch zoom
    if (touches.length === 2) {
      handleTouchStart(e);
      return;
    }

    // Single finger touch - drawing
    e.evt.preventDefault();
    const pos = getTouchPos(e);
    if (!pos) return;

    // Transform position based on zoom/pan
    const transformedPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    // Eraser tool - delete on tap
    if (tool === "eraser") {
      const clickedStroke = findStrokeAtPosition(transformedPos);
      if (clickedStroke) {
        deleteStroke(clickedStroke.id);
      }
      return;
    }

    if (tool === "text") {
      const textStroke: DrawEvent = {
        id: crypto.randomUUID(),
        tool: "text",
        color,
        x: transformedPos.x,
        y: transformedPos.y,
        text: "",
      };

      ignoreInitialBlur.current = true;
      isTyping.current = true;
      setEditingText(textStroke);
      return;
    }

    // OTHER TOOLS
    isDrawing.current = true;
    const id = crypto.randomUUID();
    currentId.current = id;

    const stroke: DrawEvent =
      tool === "pen"
        ? { id, tool, color, points: [transformedPos.x, transformedPos.y] }
        : {
          id,
          tool,
          color,
          x: transformedPos.x,
          y: transformedPos.y,
          width: 0,
          height: 0,
        };

    currentStroke.current = stroke;
    setDrawings((prev) => [...prev, stroke]);
  };

  const onTouchMove = (e: any) => {
    const touches = e.evt.touches;

    // Two finger touch - pinch zoom
    if (touches.length === 2) {
      handleTouchMove(e);
      return;
    }

    // Single finger touch - drawing
    e.evt.preventDefault();
    if (isTyping.current) return;
    if (!isDrawing.current || !currentId.current) return;

    const pos = getTouchPos(e);
    if (!pos) return;

    const transformedPos = {
      x: (pos.x - position.x) / scale,
      y: (pos.y - position.y) / scale,
    };

    setDrawings((prev) =>
      prev.map((d) => {
        if (d.id !== currentId.current) return d;

        const updated =
          d.tool === "pen"
            ? { ...d, points: [...(d.points || []), transformedPos.x, transformedPos.y] }
            : {
              ...d,
              width: transformedPos.x - (d.x || 0),
              height: transformedPos.y - (d.y || 0),
            };

        currentStroke.current = updated;
        return updated;
      })
    );
  };

  const onTouchEnd = (e: any) => {
    handleTouchEnd(e);

    // Only finalize drawing if it was a single touch (not pinch zoom)
    if (e.evt.changedTouches.length === 1) {
      if (tool === "text" || tool === "eraser") return;

      isDrawing.current = false;

      if (currentStroke.current) {
        sendStroke(currentStroke.current);
      }

      currentId.current = null;
      currentStroke.current = null;
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Stage
        ref={stageRef}
        tabIndex={-1}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        style={{ cursor: tool === "eraser" ? "none" : "crosshair" }}
      >
        <Layer>
          {drawings.map((d) => {
            if (d.tool === "pen")
              return (
                <Line
                  key={d.id}
                  points={d.points!}
                  stroke={d.color}
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                />
              );

            if (d.tool === "rect")
              return (
                <Rect
                  key={d.id}
                  x={d.x}
                  y={d.y}
                  width={d.width}
                  height={d.height}
                  stroke={d.color}
                />
              );

            if (d.tool === "circle")
              return (
                <Circle
                  key={d.id}
                  x={d.x!}
                  y={d.y!}
                  radius={Math.abs(d.width || 0)}
                  stroke={d.color}
                />
              );

            if (d.tool === "text")
              return (
                <Text
                  key={d.id}
                  x={d.x!}
                  y={d.y!}
                  text={d.text!}
                  fill={d.color}
                  fontSize={18}
                  width={400}
                  wrap="word"
                />
              );

            return null;
          })}

          {/* Eraser cursor */}
          {tool === "eraser" && eraserPos && (
            <Circle
              x={eraserPos.x}
              y={eraserPos.y}
              radius={10}
              stroke="#ff4444"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
        </Layer>
      </Stage>
      {editingText && (
        <div
          className="absolute"
          style={{
            left: editingText.x! * scale + position.x,
            top: editingText.y! * scale + position.y,
            transform: `scale(${1})`,
            transformOrigin: "top left",
          }}
        >
          <textarea
            ref={textareaRef}
            autoFocus
            placeholder="Type text here..."
            maxLength={500}
            className="bg-white/95 backdrop-blur-sm border-2 border-indigo-500 
              rounded-lg px-3 py-2 outline-none resize-none
              shadow-lg shadow-indigo-500/20
              placeholder:text-neutral-400
              text-neutral-900
              min-w-[200px] max-w-[400px]
              overflow-hidden"
            style={{
              fontSize: `${18 * scale}px`,
              fontFamily: "inherit",
            }}
            rows={1}
            onInput={(e) => {
              // Auto-resize textarea
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 300) + 'px';
            }}
            onBlur={(e) => {
              if (ignoreInitialBlur.current) {
                ignoreInitialBlur.current = false;
                textareaRef.current?.focus();
                return;
              }
              finalizeText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                finalizeText(e.currentTarget.value);
              }
              if (e.key === "Escape") {
                isTyping.current = false;
                setEditingText(null);
              }
            }}
          />
          <div className="text-xs text-neutral-600 bg-white/90 rounded px-2 py-1 mt-1">
            Press <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-neutral-700 font-mono text-xs">Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-neutral-700 font-mono text-xs">Shift+Enter</kbd> for new line
          </div>
        </div>
      )}
    </>
  );
}
