"use client";

import { useState } from "react";

const TABS = ["Attempt", "Hints", "Solution", "Lean"] as const;
type Tab = (typeof TABS)[number];

export default function ProblemTabs({
  attempt,
  hints,
  solution,
  lean,
}: {
  attempt: React.ReactNode;
  hints: React.ReactNode;
  solution: React.ReactNode;
  lean: React.ReactNode;
}) {
  const [active, setActive] = useState<Tab>("Attempt");

  return (
    <div className="mt-8">
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-2 text-sm font-medium ${
              active === tab ? "border-b-2 border-black" : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Attempt" && attempt}
        {active === "Hints" && hints}
        {active === "Solution" && solution}
        {active === "Lean" && lean}
      </div>
    </div>
  );
}
