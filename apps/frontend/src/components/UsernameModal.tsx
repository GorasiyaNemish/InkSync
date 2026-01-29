import { useState } from "react";

type Props = {
  onSubmit: (username: string) => void;
};

export function UsernameModal({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) {
      setError("Username is required");
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center">
      <div className="bg-neutral-900 p-6 rounded-2xl w-[340px] border border-neutral-800">
        <h2 className="text-xl font-semibold text-white mb-2">
          Enter your name
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          This name will be visible to other collaborators.
        </p>

        <input
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your name"
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700
            focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button
          onClick={submit}
          className="mt-4 w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
