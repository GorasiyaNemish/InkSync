import { ColorPicker } from "./ColorPicker";
import { ShapeSelector } from "./ShapeSelector";
import { TextTool } from "./TextTool";

export function ToolBar() {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2
      flex items-center gap-4
      bg-neutral-800/80 backdrop-blur
      border border-neutral-700
      rounded-2xl px-6 py-3 shadow-xl"
    >
      <ShapeSelector />
      <Divider />
      <ColorPicker />
      <Divider />
      <TextTool />
    </div>
  );
}

const Divider = () => <div className="h-6 w-px bg-neutral-600" />;
