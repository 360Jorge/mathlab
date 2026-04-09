"use client";

const TABS = ["Work", "Hints", "Solution", "AI Tutor", "Formal"] as const;
export type Tab = (typeof TABS)[number];

type ProblemTabsProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  work: React.ReactNode;
  hints: React.ReactNode;
  solution: React.ReactNode;
  aiTutor: React.ReactNode;
  formal: React.ReactNode;
};

export default function ProblemTabs({
  activeTab,
  onTabChange,
  work,
  hints,
  solution,
  aiTutor,
  formal,
}: ProblemTabsProps) {
  return (
    <div className="mt-8">
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Work" && work}
        {activeTab === "Hints" && hints}
        {activeTab === "Solution" && solution}
        {activeTab === "AI Tutor" && aiTutor}
        {activeTab === "Formal" && formal}
      </div>
    </div>
  );
}