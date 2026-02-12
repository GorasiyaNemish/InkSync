import { usePresence } from "../hooks/usePresence";
import { useState } from "react";

type Props = {
  boardId: string;
  username: string;
};

const ActiveUsersPanel = ({ boardId, username }: Props) => {
  const users = usePresence(boardId, username);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="fixed top-4 left-4 z-50
      bg-neutral-900/90 backdrop-blur
      border border-neutral-800
      rounded-xl shadow-xl
      w-56 sm:w-64 md:w-56"
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-neutral-800/50 transition rounded-xl"
      >
        <h3 className="text-xs uppercase tracking-wide text-neutral-400">
          Active users
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
            {users.length}
          </span>
          <span className="text-neutral-400 text-xs">
            {isExpanded ? "▼" : "▶"}
          </span>
        </div>
      </button>

      {/* User List - Collapsible */}
      {isExpanded && (
        <ul className="space-y-1 max-h-48 overflow-y-auto px-3 pb-3">
          {users.map((user, idx) => {
            const isYou = user === username;

            return (
              <li
                key={`${user}-${idx}`}
                className="flex items-center gap-2 text-sm text-white"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isYou ? "bg-indigo-400" : "bg-green-400"
                    }`}
                />
                <span className={`truncate ${isYou ? "font-medium" : ""}`}>
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
      )}
    </div>
  );
};

export default ActiveUsersPanel;
