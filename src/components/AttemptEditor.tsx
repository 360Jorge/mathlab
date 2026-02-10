"use client";

import { useState } from "react";

export default function AttemptEditor() {
  const [text, setText] = useState("");

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts, partial ideas, or a full solution…"
        className="w-full min-h-[160px] rounded border p-3 text-sm"
      />

      <button
        disabled={!text.trim()}
        className="rounded border px-4 py-1.5 text-sm disabled:opacity-50"
      >
        Save attempt
      </button>
    </div>
  );
}
