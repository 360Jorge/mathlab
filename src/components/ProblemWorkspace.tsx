"use client";

import { useState } from "react";

import ProblemTabs, { Tab } from "@/components/ProblemTabs";
import AttemptEditor from "@/components/AttemptEditor";
import HintLadder from "@/components/HintLadder";
import SolutionGate from "@/components/SolutionGate";
import AITutor from "@/components/AITutor";

type RenderedHint = {
  title: string;
  body: React.ReactNode;
};

type ProblemWorkspaceProps = {
  slug: string;
  problemTitle: string;
  problemText: string;
  hints: RenderedHint[];
  solution: React.ReactNode;
};

export default function ProblemWorkspace({
  slug,
  problemTitle,
  problemText,
  hints,
  solution,
}: ProblemWorkspaceProps) {
  const [attempt, setAttempt] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Work");
  const [requestedAction, setRequestedAction] = useState<
    "hint" | "check_idea" | "missing_concept" | null
  >(null);

  function handleAskAI() {
    setActiveTab("AI Tutor");
    setRequestedAction("check_idea");
  }

  return (
    <ProblemTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      work={
        <AttemptEditor
          storageKey={`attempt:${slug}`}
          value={attempt}
          onChange={setAttempt}
          onAskAI={handleAskAI}
        />
      }
      hints={
        <HintLadder
          storageKey={`hints_revealed:${slug}`}
          hints={hints}
        />
      }
      solution={
        <SolutionGate
          storageKey={`solution_revealed:${slug}`}
          solution={solution}
        />
      }
      aiTutor={
        <AITutor
          problemTitle={problemTitle}
          problemText={problemText}
          problemSlug={slug}
          attempt={attempt}
          requestedAction={requestedAction}
          onActionHandled={() => setRequestedAction(null)}
        />
      }
      formal={
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            See how this problem can be expressed in formal mathematical language.
          </p>

          <div className="rounded border p-3 text-sm text-gray-700">
            Lean formalization coming soon.
          </div>
        </div>
      }
    />
  );
}