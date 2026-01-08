import { Stage, Layer, Line, Rect, Circle, Text } from "react-konva";
import { useEffect, useRef, useState } from "react";
import { useTool } from "../context/ToolContext";
import type { DrawEvent } from "@whiteboard/shared-types";
import { socket } from "../socket";

export default function CanvasStage({ boardId }: { boardId: string }) {
  const { tool, color } = useTool();

  const [drawings, setDrawings] = useState<DrawEvent[]>([]);

  const [editingText, setEditingText] = useState<DrawEvent | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isTyping = useRef(false);
  const ignoreInitialBlur = useRef(false);

  const isDrawing = useRef(false);
  const currentId = useRef<string | null>(null);
  const currentStroke = useRef<DrawEvent | null>(null);

  /* ---------------- SOCKET ---------------- */

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

  /* ---------------- DRAWING ---------------- */

  const onMouseDown = (e: any) => {
    if (isTyping.current) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (tool === "text") {
      const textStroke: DrawEvent = {
        id: crypto.randomUUID(),
        tool: "text",
        color,
        x: pos.x,
        y: pos.y,
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
        ? { id, tool, color, points: [pos.x, pos.y] }
        : { id, tool, color, x: pos.x, y: pos.y, width: 0, height: 0 };

    currentStroke.current = stroke;
    setDrawings((prev) => [...prev, stroke]);
  };

  const onMouseMove = (e: any) => {
    if (isTyping.current) return;
    if (!isDrawing.current || !currentId.current) return;

    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setDrawings((prev) =>
      prev.map((d) => {
        if (d.id !== currentId.current) return d;

        const updated =
          d.tool === "pen"
            ? { ...d, points: [...(d.points || []), pos.x, pos.y] }
            : {
                ...d,
                width: pos.x - (d.x || 0),
                height: pos.y - (d.y || 0),
              };

        currentStroke.current = updated;
        return updated;
      })
    );
  };

  const onMouseUp = () => {
    if (tool === "text") return;

    isDrawing.current = false;

    if (currentStroke.current) {
      socket.emit("drawing:event", {
        boardId,
        stroke: currentStroke.current,
      });
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

    socket.emit("drawing:event", {
      boardId,
      stroke,
    });
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Stage
        tabIndex={-1}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
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
                />
              );

            return null;
          })}
        </Layer>
      </Stage>
      {editingText && (
        <textarea
          ref={textareaRef}
          autoFocus
          className="absolute bg-transparent border-none outline-none resize-none"
          style={{
            left: editingText.x,
            top: editingText.y,
            color: editingText.color,
            fontSize: "18px",
            fontFamily: "inherit",
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
            if (e.key === "Enter") {
              e.preventDefault();
              finalizeText(e.currentTarget.value);
            }
            if (e.key === "Escape") {
              isTyping.current = false;
              setEditingText(null);
            }
          }}
        />
      )}
    </>
  );
}
