import { useNavigate } from "react-router";
import { socket } from "../socket";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createBoard = () => {
    setIsCreating(true);
    const boardId = crypto.randomUUID();

    // Create board on server first
    socket.emit("board:create", boardId, (response: { success: boolean; error?: string }) => {
      setIsCreating(false);
      if (response.success) {
        navigate(`/board/${boardId}`);
      } else {
        console.error("Failed to create board:", response.error);
        // Retry with new ID if board already exists
        createBoard();
      }
    });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600/20 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InkSync
          </h1>

          <p className="text-xl text-neutral-300 mb-3">
            Instant collaborative whiteboard
          </p>

          <p className="text-neutral-400 max-w-lg mx-auto">
            Create, share, and collaborate in real-time. No sign-up, no hassle—just pure creativity on the go.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-sm mb-1">Instant Start</h3>
            <p className="text-xs text-neutral-500">No login required</p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-sm mb-1">Easy Sharing</h3>
            <p className="text-xs text-neutral-500">Share link & collaborate</p>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold text-sm mb-1">Full Featured</h3>
            <p className="text-xs text-neutral-500">Draw, erase, zoom & more</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <button
            onClick={createBoard}
            disabled={isCreating}
            className={`w-full py-4 rounded-xl
              bg-gradient-to-r from-indigo-600 to-indigo-500
              hover:from-indigo-500 hover:to-indigo-400
              transition-all duration-200 font-semibold text-lg
              shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
              transform hover:scale-[1.02]
              ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCreating ? 'Creating Board...' : 'Create Board Instantly'}
          </button>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Anyone with the link can join instantly</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time collaboration with unlimited users</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Boards auto-cleanup after 30 minutes of inactivity</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-600 mt-8">
          Perfect for brainstorming, teaching, design reviews, and quick sketches
        </p>
      </div>
    </div>
  );
};

export default HomePage;
