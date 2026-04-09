"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AIAction = "hint" | "check_idea" | "missing_concept";

type AITutorProps = {
  problemTitle: string;
  problemText: string;
  problemSlug: string;
  attempt?: string;
  requestedAction?: AIAction | null;
  onActionHandled?: () => void;
};

export default function AITutor({
  problemTitle,
  problemText,
  problemSlug,
  attempt = "",
  requestedAction = null,
  onActionHandled,
}: AITutorProps) {
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  async function runAction(action: AIAction) {
  setLoading(true);
  setError("");

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({
        action,
        problemTitle,
        problemText,
        problemSlug,
        attempt,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setReply("");
      return;
    }

    setReply(data.reply ?? "");
  } catch {
    setError("Could not reach the AI route.");
    setReply("");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    if (!requestedAction) return;

    runAction(requestedAction).finally(() => {
      onActionHandled?.();
    });
  }, [requestedAction]); // intentional

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Get targeted help without jumping straight to the full solution. Your
        current work can be used to give more relevant feedback.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => runAction("hint")}
          disabled={loading}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Give me a hint
        </button>

        <button
          onClick={() => runAction("check_idea")}
          disabled={loading}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Check my idea
        </button>

        <button
          onClick={() => runAction("missing_concept")}
          disabled={loading}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          What concept am I missing?
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-500">Thinking...</p> : null}

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {reply ? (
        <div className="rounded border p-4">
          <div className="mb-2 text-sm font-medium">AI Tutor</div>
          <p className="text-sm text-gray-700">{reply}</p>
        </div>
      ) : null}
    </div>
  );
}