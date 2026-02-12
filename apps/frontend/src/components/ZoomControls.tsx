interface ZoomControlsProps {
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
}

export function ZoomControls({
    scale,
    onZoomIn,
    onZoomOut,
    onResetZoom,
}: ZoomControlsProps) {
    return (
        <div
            className="fixed top-4 right-4 z-50
      flex flex-col gap-2
      bg-neutral-800/80 backdrop-blur
      border border-neutral-700
      rounded-xl p-2 shadow-xl"
        >
            <button
                onClick={onZoomIn}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition"
                title="Zoom In (Mouse Wheel)"
            >
                +
            </button>
            <div className="text-xs text-neutral-400 text-center px-2 py-1">
                {Math.round(scale * 100)}%
            </div>
            <button
                onClick={onZoomOut}
                className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition"
                title="Zoom Out (Mouse Wheel)"
            >
                −
            </button>
            <div className="h-px bg-neutral-600 my-1" />
            <button
                onClick={onResetZoom}
                className="px-2 py-1 rounded-lg text-xs bg-neutral-700 text-neutral-300 hover:bg-neutral-600 transition"
                title="Reset Zoom"
            >
                Reset
            </button>
        </div>
    );
}
