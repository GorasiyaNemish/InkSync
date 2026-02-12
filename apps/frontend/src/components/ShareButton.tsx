import { useState } from "react";
import ShareBoardModal from "./ShareBoardModal";

const ShareButton = ({ boardId }: { boardId: string }) => {
  const [isShareOpen, setShareOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setShareOpen(true)}
        className="fixed top-4 right-32 sm:right-36 z-50
          flex items-center gap-2
          bg-neutral-800/80 backdrop-blur
          border border-neutral-700
          rounded-xl px-3 sm:px-4 py-2.5 shadow-xl
          text-neutral-300 hover:text-white hover:bg-neutral-700
          transition-all duration-200"
        title="Share Board"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="text-sm font-medium hidden sm:inline">Share</span>
      </button>

      <ShareBoardModal
        boardId={boardId}
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
};

export default ShareButton;
