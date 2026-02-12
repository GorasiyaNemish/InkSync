import { useState } from "react";

type Props = {
  onSubmit: (username: string) => void;
};

const MAX_USERNAME_LENGTH = 20;

export function UsernameModal({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Username is required");
      return;
    }

    if (trimmedName.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be ${MAX_USERNAME_LENGTH} characters or less`);
      return;
    }

    onSubmit(trimmedName);
  };

  const handleNameChange = (value: string) => {
    // Allow typing but show error if over limit
    setName(value);
    setError("");

    if (value.trim().length > MAX_USERNAME_LENGTH) {
      setError(`Username must be ${MAX_USERNAME_LENGTH} characters or less`);
    }
  };

  const remainingChars = MAX_USERNAME_LENGTH - name.trim().length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-2xl w-[340px] border border-neutral-800">
        <h2 className="text-xl font-semibold text-white mb-2">
          Enter your name
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          This name will be visible to other collaborators.
        </p>

        <div className="relative">
          <input
            autoFocus
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Your name"
            maxLength={MAX_USERNAME_LENGTH + 10} // Allow typing a bit over to show error
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700
              focus:ring-2 focus:ring-indigo-500 outline-none text-white"
          />
          <div className={`absolute right-3 top-2.5 text-xs ${isOverLimit ? 'text-red-400' : 'text-neutral-500'
            }`}>
            {name.trim().length}/{MAX_USERNAME_LENGTH}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button
          onClick={submit}
          disabled={isOverLimit || !name.trim()}
          className={`mt-4 w-full py-2.5 rounded-lg transition
            ${isOverLimit || !name.trim()
              ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
