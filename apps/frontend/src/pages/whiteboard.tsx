import { useParams, useNavigate } from "react-router";
import CanvasBoard from "../components/CanvasBoard";
import { ToolBar } from "../components/ToolBar";
import { ToolProvider } from "../context/ToolContext";
import ActiveUsersPanel from "../components/ActiveUsersPanel";
import { useEffect, useState } from "react";
import { getUsername, setUsername } from "../utils/user";
import { UsernameModal } from "../components/UsernameModal";
import { ZoomControls } from "../components/ZoomControls";
import ShareButton from "../components/ShareButton";
import { socket } from "../socket";

const WhiteboardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [usernameState, setUsernameState] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [boardExists, setBoardExists] = useState<boolean | null>(null);

  useEffect(() => {
    setUsernameState(getUsername());
  }, []);

  // Check if board exists
  useEffect(() => {
    if (!boardId) return;

    // Check board existence
    socket.emit("board:check", boardId, (response: { exists: boolean }) => {
      if (!response.exists) {
        navigate("/board-not-found");
      } else {
        setBoardExists(true);
      }
    });

    // Listen for board not found event
    const handleBoardNotFound = () => {
      navigate("/board-not-found");
    };

    socket.on("board:not-found", handleBoardNotFound);

    return () => {
      socket.off("board:not-found", handleBoardNotFound);
    };
  }, [boardId, navigate]);

  if (!boardId) return null;

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setUsernameState(name);
  };

  if (!boardId) return null;

  // Show loading while checking board existence
  if (boardExists === null) {
    return (
      <div className="h-screen w-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-neutral-400">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!usernameState) {
    return <UsernameModal onSubmit={handleUsernameSubmit} />;
  }

  const handleZoomIn = () => {
    (window as any).canvasZoomControls?.zoomIn();
  };

  const handleZoomOut = () => {
    (window as any).canvasZoomControls?.zoomOut();
  };

  const handleResetZoom = () => {
    (window as any).canvasZoomControls?.resetZoom();
  };

  const handleZoomChange = (scale: number) => {
    setCurrentZoom(scale);
  };

  return (
    <ToolProvider>
      <div className="relative h-screen w-screen bg-neutral-900 overflow-hidden">
        <CanvasBoard
          boardId={boardId}
          onZoomChange={(scale) => handleZoomChange(scale)}
        />
        <ActiveUsersPanel boardId={boardId} username={usernameState} />
        <ShareButton boardId={boardId} />
        <ToolBar boardId={boardId} />
        <ZoomControls
          scale={currentZoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
      </div>
    </ToolProvider>
  );
};

export default WhiteboardPage;
