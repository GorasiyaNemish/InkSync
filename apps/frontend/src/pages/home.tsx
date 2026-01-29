import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const createBoard = () => {
    const boardId = crypto.randomUUID();
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen min-w-screen bg-neutral-950 text-white flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Whiteboard</h1>
          <p className="text-neutral-400">
            Real-time collaborative whiteboard,
          </p>
          <p className=" m-4">
            <span
              className="py-2 m-4 px-4 rounded-lg
            bg-neutral-700 hover:bg-neutral-900
            transition"
            >
              No login required
            </span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <button
            onClick={createBoard}
            className="w-full py-2.5 rounded-lg
              bg-indigo-600 hover:bg-indigo-500
              transition font-medium"
          >
            Create whiteboard
          </button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            Anyone with the link can join instantly
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
