import { notFound } from "next/navigation";
import Link from "next/link";
import { TRACKS } from "@/lib/content/tracks";
import { getAllProblems } from "@/lib/content/mdx";

type Props = { params: Promise<{ slug: string }> };

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;

  const track = TRACKS.find((t) => t.slug === slug);
  if (!track) return notFound();

  const allProblems = getAllProblems();

  const problems = track.order
    .map((slug) => allProblems.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link href="/library" className="text-sm underline">
          ← Back to Library
        </Link>
      </div>

      <h1 className="text-2xl font-semibold">{track.title}</h1>
      <p className="mt-2 text-gray-600">{track.description}</p>

      <ul className="mt-8 space-y-4">
        {problems.map((p, i) => (
          <li key={p!.slug} className="rounded border p-4">
            <div className="flex items-baseline justify-between">
              <Link
                href={`/p/${p!.slug}`}
                className="text-lg font-medium underline"
              >
                {i + 1}. {p!.title}
              </Link>
              <span className="text-xs text-gray-600">
                Difficulty {p!.difficulty}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
