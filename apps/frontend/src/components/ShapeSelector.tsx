import { useTool } from "../context/ToolContext";

export function ShapeSelector() {
  const { tool, setTool } = useTool();

  const tools = ["pen", "rect", "circle", "text"] as const;

  return (
    <div className="flex gap-2">
      {tools.map((t) => (
        <button
          key={t}
          onClick={() => setTool(t)}
          className={`px-3 py-2 rounded-lg text-sm
            ${
              tool === t
                ? "bg-blue-600 text-white"
                : "bg-neutral-700 text-neutral-300"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
