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
        A math training platform for learning how to solve problems, recognize
        proof strategies, and get guided AI feedback without jumping straight to
        the answer.
      </p>

      <p className="mt-4 text-gray-600">
        Work through Putnam-style, Olympiad-style, and MathNet problems with
        hints, saved attempts, similar-problem recommendations, and an AI tutor
        that responds to your own work.
      </p>

      <div className="mt-6 grid gap-3 sm:flex sm:gap-4">
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

      <div className="mt-8 rounded border p-4">
        <h2 className="text-sm font-semibold">What MathLab supports now</h2>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>• Guided hint ladders and gated solutions</li>
          <li>• Autosaved work with Supabase login</li>
          <li>• AI tutor feedback powered by Ollama Cloud</li>
          <li>• Similar problems connected by strategy and proof moves</li>
          <li>• Early MathNet problem integration</li>
        </ul>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Early alpha. Built as a structure-aware math learning system.
      </p>
    </main>
  );
}