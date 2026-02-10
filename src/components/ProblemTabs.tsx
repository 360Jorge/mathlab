"use client";

import { useState } from "react";

const TABS = ["Attempt", "Hints", "Solution", "Lean"] as const;
type Tab = (typeof TABS)[number];

export default function ProblemTabs({
  attempt,
}: {
  attempt: React.ReactNode;
}) {
  const [active, setActive] = useState<Tab>("Attempt");

  return (
    <div className="mt-8">
      {/* Tab headers */}
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

      {/* Tab content */}
      <div className="mt-6">
        {active === "Attempt" && attempt}
        {active === "Hints" && (
          <p className="text-sm text-gray-500">
            Hints coming soon.
          </p>
        )}
        {active === "Solution" && (
          <p className="text-sm text-gray-500">
            Solution will appear here.
          </p>
        )}
        {active === "Lean" && (
          <p className="text-sm text-gray-500">
            Lean verification coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
