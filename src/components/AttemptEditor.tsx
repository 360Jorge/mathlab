"use client";

import { useEffect, useRef, useState } from "react";

export default function AttemptEditor({
  storageKey,
}: {
  storageKey: string;
}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const saveTimer = useRef<number | null>(null);

  // Load saved attempt on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setText(saved);
  }, [storageKey]);

  // Debounced autosave whenever text changes
  useEffect(() => {
    // clear previous timer
    if (saveTimer.current) window.clearTimeout(saveTimer.current);

    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem(storageKey, text);
      setStatus("saved");

      window.setTimeout(() => setStatus("idle"), 800);
    }, 300);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [text, storageKey]);

  function clearAttempt() {
    setText("");
    localStorage.removeItem(storageKey);
    setStatus("idle");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Your Work
        </p>
        <span className="text-xs text-gray-500">
          {status === "saved" ? "Saved" : ""}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start by writing anything you notice. Try small cases, compute examples, look for patterns, or rewrite the problem."
        className="w-full min-h-[180px] rounded border p-3 text-sm"
      />

      <div className="flex gap-2">
        <button
          onClick={clearAttempt}
          className="rounded border px-4 py-1.5 text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
