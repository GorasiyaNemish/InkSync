export function ActiveUsersPanel() {
  const users = ["A", "B", "C"];

  return (
    <div
      className="fixed top-4 right-4
      bg-neutral-800/80 backdrop-blur
      border border-neutral-700
      rounded-xl p-3 shadow-lg"
    >
      <div className="flex items-center gap-2">
        {users.map((u, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-blue-600
              flex items-center justify-center text-sm font-medium"
          >
            {u}
          </div>
        ))}
      </div>
    </div>
  );
}
