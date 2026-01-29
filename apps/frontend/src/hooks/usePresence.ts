import { useEffect, useState } from "react";
import { socket } from "../socket";

export function usePresence(boardId: string, username: string) {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("presence:join", { boardId, username });

    socket.on("users:update", setUsers);

    return () => {
      socket.off("users:update");
    };
  }, [boardId, username]);

  return users;
}
