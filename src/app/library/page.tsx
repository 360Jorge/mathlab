import { getAllProblems } from "@/lib/content/mdx";
import ProblemLibrary from "@/components/ProblemLibrary";

export default function LibraryPage() {
  const problems = getAllProblems();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Library</h1>
      <p className="mt-2 text-sm text-gray-600">
        Search problems by topic, difficulty, and proof strategy.
      </p>

      <ProblemLibrary problems={problems} />
    </main>
  );
}