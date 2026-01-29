import { useState } from "react";
import ShareBoardModal from "./ShareBoardModal";

const ShareButton = ({ boardId }) => {
  const [isShareOpen, setShareOpen] = useState(false);

  return (
    <>
      <button onClick={() => setShareOpen(true)}>Share</button>
      <ShareBoardModal
        boardId={boardId}
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
};

export default ShareButton;
