import { useBoardSocket } from "../hooks/useBoardSocket";

interface UndoRedoButtonsProps {
    boardId: string;
}

export function UndoRedoButtons({ boardId }: UndoRedoButtonsProps) {
    const { undo, redo } = useBoardSocket(boardId);

    return (
        <div className="flex gap-2">
            <button
                onClick={undo}
                className="px-3 py-2 rounded-lg text-sm bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition"
                title="Undo (Ctrl+Z)"
            >
                ↶ Undo
            </button>
            <button
                onClick={redo}
                className="px-3 py-2 rounded-lg text-sm bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition"
                title="Redo (Ctrl+Y)"
            >
                ↷ Redo
            </button>
        </div>
    );
}
