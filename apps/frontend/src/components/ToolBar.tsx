import { ColorPicker } from "./ColorPicker";
import { ShapeSelector } from "./ShapeSelector";
import { TextTool } from "./TextTool";
import { UndoRedoButtons } from "./UndoRedoButtons";

interface ToolBarProps {
  boardId: string;
}

export function ToolBar({ boardId }: ToolBarProps) {
  return (
    <div
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2
      flex items-center gap-2 sm:gap-4
      bg-neutral-800/80 backdrop-blur
      border border-neutral-700
      rounded-2xl px-3 sm:px-6 py-2 sm:py-3 shadow-xl
      max-w-[95vw] overflow-x-auto"
    >
      <ShapeSelector />
      <Divider />
      <ColorPicker />
      <Divider />
      <TextTool />
      <Divider />
      <UndoRedoButtons boardId={boardId} />
    </div>
  );
}

const Divider = () => <div className="h-6 w-px bg-neutral-600 flex-shrink-0" />;
