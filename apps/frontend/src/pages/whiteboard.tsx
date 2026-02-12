import { useParams } from "react-router";
import CanvasBoard from "../components/CanvasBoard";
import { ToolBar } from "../components/ToolBar";
import { ToolProvider } from "../context/ToolContext";
import ActiveUsersPanel from "../components/ActiveUsersPanel";
import { useEffect, useState } from "react";
import { getUsername, setUsername } from "../utils/user";
import { UsernameModal } from "../components/UsernameModal";
import { ZoomControls } from "../components/ZoomControls";

const WhiteboardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [usernameState, setUsernameState] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    setUsernameState(getUsername());
  }, []);

  if (!boardId) return null;

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setUsernameState(name);
  };

  if (!boardId) return null;

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
