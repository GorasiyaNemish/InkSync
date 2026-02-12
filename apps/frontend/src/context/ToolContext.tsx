import { createContext, useContext, useState } from "react";

export type Tool = "pen" | "rect" | "circle" | "text" | "eraser";

type ToolState = {
  tool: Tool;
  color: string;
  setTool: (t: Tool) => void;
  setColor: (c: string) => void;
};

const ToolContext = createContext<ToolState | null>(null);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ffffff");

  return (
    <ToolContext.Provider value={{ tool, color, setTool, setColor }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const ctx = useContext(ToolContext);
  if (!ctx) throw new Error("useTool must be inside ToolProvider");
  return ctx;
}
