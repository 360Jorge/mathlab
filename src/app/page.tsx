import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">MathLab</h1>

      <p className="mt-4 text-gray-600">
        Free, open mathematics training with AI coaching and formal verification.
      </p>

      <Link
        href="/library"
        className="mt-6 inline-block rounded border px-4 py-2 text-sm font-medium"
      >
        Go to Library →
      </Link>

      <Link
        href="/tracks"
        className="mt-6 inline-block rounded border px-4 py-2 text-sm font-medium"
      >
        Explore Tracks →
      </Link>

    </main>
  );
}
