"use client";

import { useState } from "react";

export default function SolutionGate({
  solution,
  lockedMessage,
}: {
  solution: React.ReactNode;
  lockedMessage?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {lockedMessage ??
            "Try a full attempt first. Use hints if needed. Then reveal the solution."}
        </p>

        <button
          onClick={() => setRevealed(true)}
          className="rounded border px-4 py-1.5 text-sm"
        >
          Reveal solution
        </button>
      </div>
    );
  }

  return <div className="prose max-w-none">{solution}</div>;
}
