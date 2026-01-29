import { usePresence } from "../hooks/usePresence";

type Props = {
  boardId: string;
  username: string;
};

const ActiveUsersPanel = ({ boardId, username }: Props) => {
  const users = usePresence(boardId, username);

  return (
    <div
      className="fixed top-4 right-4 z-50
      bg-neutral-900/90 backdrop-blur
      border border-neutral-800
      rounded-xl p-3 w-56 shadow-xl"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs uppercase tracking-wide text-neutral-400">
          Active users
        </h3>
        <span className="text-xs text-neutral-500">{users.length}</span>
      </div>

      <ul className="space-y-1 max-h-48 overflow-y-auto">
        {users.map((user, idx) => {
          const isYou = user === username;

          return (
            <li
              key={`${user}-${idx}`}
              className="flex items-center gap-2 text-sm text-white"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isYou ? "bg-indigo-400" : "bg-green-400"
                }`}
              />
              <span className={isYou ? "font-medium" : ""}>
                {user}
                {isYou && (
                  <span className="ml-1 text-xs text-neutral-400">(you)</span>
                )}
              </span>
            </li>
          );
        })}

        {users.length === 0 && (
          <li className="text-xs text-neutral-500">No active users</li>
        )}
      </ul>
    </div>
  );
};

export default ActiveUsersPanel;
