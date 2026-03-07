"use client";

import { useState } from "react";

const TABS = ["Work", "Hints", "Solution"] as const;
type Tab = (typeof TABS)[number];

export default function ProblemTabs({
  work,
  hints,
  solution,
}: {
  work: React.ReactNode;
  hints: React.ReactNode;
  solution: React.ReactNode;
}) {
  const [active, setActive] = useState<Tab>("Work");

  return (
    <div className="mt-8">
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-3 py-2 text-sm font-medium ${
              active === tab
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Work" && work}
        {active === "Hints" && hints}
        {active === "Solution" && solution}
      </div>
    </div>
  );
}