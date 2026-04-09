import Link from "next/link";

import AuthButton from "@/components/AuthButton";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">MathLab</h1>
        <AuthButton />
      </div>

      <p className="mt-4 text-gray-700">
        A structured training platform for learning how to think through
        Putnam-style and Olympiad-style problems.
      </p>

      <p className="mt-4 text-gray-600">
        This is not a solution archive. It’s a guided environment designed to help
        you build problem-solving instincts: experimenting, spotting invariants,
        working with modular arithmetic, and learning how to start when you don’t
        know where to begin.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/tracks"
          className="rounded border px-4 py-2 text-sm font-medium"
        >
          Start a Training Track →
        </Link>

        <Link
          href="/library"
          className="rounded border px-4 py-2 text-sm font-medium"
        >
          Browse Problems →
        </Link>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Early alpha. Built to evolve.
      </p>
    </main>

  );
}
