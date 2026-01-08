import { useTool } from "../context/ToolContext";

export function TextTool() {
  const { tool, setTool } = useTool();

  return (
    <button
      onClick={() => setTool("text")}
      className={`px-3 py-2 rounded-lg text-sm
        ${
          tool === "text"
            ? "bg-blue-600 text-white"
            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
        }`}
    >
      Text
    </button>
  );
}
