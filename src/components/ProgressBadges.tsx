"use client";

import { useState } from "react";

type Progress = {
  attempted: boolean;
  hintsUsed: number;
  solutionRevealed: boolean;
};

function loadProgress(slug: string): Progress {
  if (typeof window === "undefined") {
    return {
      attempted: false,
      hintsUsed: 0,
      solutionRevealed: false,
    };
  }

  const attempt = localStorage.getItem(`attempt:${slug}`) ?? "";
  const attempted = attempt.trim().length > 0;

  const hintsUsed =
    Number(localStorage.getItem(`hints_revealed:${slug}`) ?? "0") || 0;

  const solutionRevealed =
    (localStorage.getItem(`solution_revealed:${slug}`) ?? "0") === "1";

  return {
    attempted,
    hintsUsed,
    solutionRevealed,
  };
}

export default function ProgressBadges({ slug }: { slug: string }) {
  const [p] = useState<Progress>(() => loadProgress(slug));

  return (
    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
      {p.attempted ? (
        <span className="rounded border px-2 py-0.5">Attempted</span>
      ) : null}

      {p.hintsUsed > 0 ? (
        <span className="rounded border px-2 py-0.5">
          {`Hints used: ${p.hintsUsed}`}
        </span>
      ) : null}

      {p.solutionRevealed ? (
        <span className="rounded border px-2 py-0.5">Solution revealed</span>
      ) : null}
    </div>
  );
}