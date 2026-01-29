import { Server, Socket } from "socket.io";

type User = {
  socketId: string;
  username: string;
};

const boardUsers = new Map<string, User[]>();

export function registerPresenceHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on(
      "presence:join",
      ({ boardId, username }: { boardId: string; username: string }) => {
        socket.join(boardId);

        const users = boardUsers.get(boardId) || [];

        const updatedUsers = [
          ...users.filter((u) => u.socketId !== socket.id),
          { socketId: socket.id, username },
        ];

        boardUsers.set(boardId, updatedUsers);

        io.to(boardId).emit(
          "users:update",
          updatedUsers.map((u) => u.username)
        );
      }
    );

    socket.on("disconnect", () => {
      for (const [boardId, users] of boardUsers.entries()) {
        const updated = users.filter((u) => u.socketId !== socket.id);

        if (updated.length !== users.length) {
          boardUsers.set(boardId, updated);
          io.to(boardId).emit(
            "users:update",
            updated.map((u) => u.username)
          );
        }
      }
    });
  });
}
