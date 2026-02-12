import { useNavigate } from "react-router";

const BoardNotFoundPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600/20 rounded-3xl mb-8">
                    <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                    Board Not Found
                </h1>

                {/* Description */}
                <p className="text-lg text-neutral-300 mb-3">
                    This board doesn't exist or has been deleted.
                </p>

                <p className="text-neutral-400 mb-8">
                    Boards are automatically cleaned up after 30 minutes of inactivity or when all users disconnect.
                </p>

                {/* Info Box */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 mb-8 text-left">
                    <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Possible Reasons
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-400">
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-600 mt-1">•</span>
                            <span>The board link is incorrect or incomplete</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-600 mt-1">•</span>
                            <span>The board was never created (boards must be created via the homepage)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-600 mt-1">•</span>
                            <span>The board was automatically deleted due to inactivity</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-neutral-600 mt-1">•</span>
                            <span>The board was manually deleted by a user</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={goHome}
                        className="w-full py-4 rounded-xl
              bg-gradient-to-r from-indigo-600 to-indigo-500
              hover:from-indigo-500 hover:to-indigo-400
              transition-all duration-200 font-semibold text-lg
              shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
              transform hover:scale-[1.02]"
                    >
                        Create New Board
                    </button>

                    <p className="text-xs text-neutral-600">
                        Need help? Make sure you're using the correct board link shared with you.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BoardNotFoundPage;
