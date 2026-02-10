"use client";

import { useEffect, useState } from "react";

export default function SolutionGate({
  solution,
  storageKey,
  lockedMessage,
}: {
  solution: React.ReactNode;
  storageKey: string;
  lockedMessage?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "1") setRevealed(true);
  }, [storageKey]);

  function reveal() {
    setRevealed(true);
    localStorage.setItem(storageKey, "1");
  }

  if (!revealed) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {lockedMessage ??
            "Try a full attempt first. Use hints if needed. Then reveal the solution."}
        </p>

        <button onClick={reveal} className="rounded border px-4 py-1.5 text-sm">
          Reveal solution
        </button>
      </div>
    );
  }

  return <div className="prose max-w-none">{solution}</div>;
}
