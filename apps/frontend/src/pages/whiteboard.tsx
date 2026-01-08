import { useParams } from "react-router";
import CanvasBoard from "../components/CanvasBoard";
import { ActiveUsersPanel } from "../components/ActiveUsersPanel";
import { ToolBar } from "../components/ToolBar";
import { ToolProvider } from "../context/ToolContext";

const WhiteboardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) return null;

  return (
    <ToolProvider>
      <div className="relative h-screen w-screen bg-neutral-900 overflow-hidden">
        <CanvasBoard boardId={boardId} />
        <ActiveUsersPanel />
        <ToolBar />
      </div>
    </ToolProvider>
  );
};

export default WhiteboardPage;
