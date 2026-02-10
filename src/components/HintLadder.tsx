"use client";

import { useMemo, useState } from "react";

export default function HintLadder({
  hints,
}: {
  hints: Array<{ title: string; body: React.ReactNode }>;
}) {
  const [revealed, setRevealed] = useState(0);

  const canRevealMore = revealed < hints.length;

  const visibleHints = useMemo(() => hints.slice(0, revealed), [hints, revealed]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setRevealed((r) => Math.min(r + 1, hints.length))}
          disabled={!canRevealMore}
          className="rounded border px-4 py-1.5 text-sm disabled:opacity-50"
        >
          Reveal next hint
        </button>

        <button
          onClick={() => setRevealed(0)}
          disabled={revealed === 0}
          className="rounded border px-4 py-1.5 text-sm disabled:opacity-50"
        >
          Hide all
        </button>

        <span className="text-sm text-gray-600">
          {hints.length === 0 ? "No hints yet." : `${revealed}/${hints.length} revealed`}
        </span>
      </div>

      {hints.length === 0 ? null : (
        <div className="space-y-4">
          {visibleHints.map((h, i) => (
            <div key={i} className="rounded border p-4">
              <div className="text-sm font-medium">{h.title}</div>
              <div className="prose mt-3 max-w-none">{h.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
