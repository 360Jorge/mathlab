"use client";

import { useEffect, useRef, useState } from "react";

type AttemptEditorProps = {
  storageKey: string;
  value?: string;
  onChange?: (value: string) => void;
  onAskAI?: () => void;
};

export default function AttemptEditor({
  storageKey,
  value,
  onChange,
  onAskAI,
}: AttemptEditorProps) {
  const [internalText, setInternalText] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(storageKey) ?? "";
  });

  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const saveTimer = useRef<number | null>(null);

  const isControlled = value !== undefined;
  const text = isControlled ? value : internalText;

  useEffect(() => {
    if (!isControlled) return;

    const saved = localStorage.getItem(storageKey);
    if (saved === null) return;

    const timer = window.setTimeout(() => {
      onChange?.(saved);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey, isControlled, onChange]);

  useEffect(() => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem(storageKey, text);
      setStatus("saved");

      window.setTimeout(() => setStatus("idle"), 800);
    }, 300);

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [text, storageKey]);

  function handleChange(next: string) {
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternalText(next);
    }
  }

  function clearAttempt() {
    if (isControlled) {
      onChange?.("");
    } else {
      setInternalText("");
    }

    localStorage.removeItem(storageKey);
    setStatus("idle");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Your Work</p>
        <span className="text-xs text-gray-500">
          {status === "saved" ? "Saved" : ""}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start by writing anything you notice. Try small cases, compute examples, look for patterns, or rewrite the problem."
        className="min-h-[180px] w-full rounded border p-3 text-sm"
      />

      <div className="flex gap-2">
        <button
          onClick={clearAttempt}
          className="rounded border px-4 py-1.5 text-sm"
        >
          Clear
        </button>

        {onAskAI ? (
          <button
            onClick={onAskAI}
            className="rounded border px-4 py-1.5 text-sm"
          >
            Ask AI for feedback
          </button>
        ) : null}
      </div>
    </div>
  );
}