import { useTool } from "../context/ToolContext";

export function ColorPicker() {
  const { color, setColor } = useTool();
  const colors = ["#fff", "#ef4444", "#22c55e", "#3b82f6", "#eab308"];

  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => setColor(c)}
          className="w-6 h-6 rounded-full border-2"
          style={{
            backgroundColor: c,
            borderColor: c === color ? "white" : "transparent",
          }}
        />
      ))}
    </div>
  );
}
