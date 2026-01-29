import { useParams } from "react-router";
import CanvasBoard from "../components/CanvasBoard";
import { ToolBar } from "../components/ToolBar";
import { ToolProvider } from "../context/ToolContext";
import ActiveUsersPanel from "../components/ActiveUsersPanel";
import { useEffect, useState } from "react";
import { getUsername, setUsername } from "../utils/user";
import { UsernameModal } from "../components/UsernameModal";

const WhiteboardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [usernameState, setUsernameState] = useState<string | null>(null);

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

  return (
    <ToolProvider>
      <div className="relative h-screen w-screen bg-neutral-900 overflow-hidden">
        <CanvasBoard boardId={boardId} />
        <ActiveUsersPanel boardId={boardId} username={usernameState} />
        <ToolBar />
      </div>
    </ToolProvider>
  );
};

export default WhiteboardPage;
