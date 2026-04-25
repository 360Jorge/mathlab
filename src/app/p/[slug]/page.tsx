import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Link from "next/link";

import {
  getProblemBySlug,
  getAllProblems,
  getSimilarProblems,
} from "@/lib/content/mdx";
import { splitProblemMdx } from "@/lib/content/sections";
import { TRACKS } from "@/lib/content/tracks";
import ProblemWorkspace from "@/components/ProblemWorkspace";

type Props = { params: Promise<{ slug: string }> };

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;

  const data = getProblemBySlug(slug);
  if (!data) return notFound();

  const sections = splitProblemMdx(data.source);
  const allProblems = getAllProblems();

  const trackSlug = data.meta.track as string | undefined;
  const track = trackSlug ? TRACKS.find((t) => t.slug === trackSlug) : undefined;

  const currentSlug = data.meta.slug ?? slug;
  const idx = track ? track.order.indexOf(currentSlug) : -1;

  const nextSlug = track && idx >= 0 ? track.order[idx + 1] : undefined;
  const prevSlug = track && idx >= 0 ? track.order[idx - 1] : undefined;

  const nextProblem = nextSlug
    ? allProblems.find((p) => p.slug === nextSlug)
    : undefined;

  const prevProblem = prevSlug
    ? allProblems.find((p) => p.slug === prevSlug)
    : undefined;

  const similarProblems = getSimilarProblems(data.meta, 3);

  const renderedHints = sections.hints.map((h) => ({
  title: h.title,
  body: (
    <MDXRemote
      source={h.mdx}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  ),
}));

const renderedSolution =
  sections.solutionMdx.trim().length === 0 ? (
    <p className="text-sm text-gray-500">No solution yet.</p>
  ) : (
    <MDXRemote
      source={sections.solutionMdx}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
      }}
    />
  );

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <a href="/library" className="text-sm underline">
          ← Back to Library
        </a>
      </div>

      <h1 className="text-2xl font-semibold">{data.meta.title}</h1>
      <p className="mt-1 text-sm text-gray-600">
        Difficulty {data.meta.difficulty}
      </p>

      <article className="prose mt-6 max-w-none">
        <MDXRemote
          source={sections.problemMdx}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </article>

      <ProblemWorkspace
        slug={slug}
        problemTitle={data.meta.title}
        problemText={sections.problemMdx}
        hints={renderedHints}
        solution={renderedSolution}
      />

      {similarProblems.length > 0 ? (
  <div className="mt-10 rounded border p-4">
    <h2 className="text-lg font-semibold">Similar problems</h2>

    <ul className="mt-3 space-y-3">
      {similarProblems.map((p) => (
        <li key={p.slug}>
          <Link href={`/p/${p.slug}`} className="text-sm font-medium underline">
            {p.title}
          </Link>

          {p.moves?.length ? (
            <div className="mt-1 text-xs text-gray-500">
  {(() => {
    const sharedMoves = (p.moves ?? []).filter((m) =>
      (data.meta.moves ?? []).includes(m)
    );

    const sharedStrategies = (p.strategies ?? []).filter((s) =>
      (data.meta.strategies ?? []).includes(s)
    );

    if (sharedMoves.length > 0) {
      return `Both use: ${sharedMoves
        .map((m) => m.replaceAll("_", " "))
        .join(", ")}`;
    }

    if (sharedStrategies.length > 0) {
      return `Same strategy: ${sharedStrategies
        .map((s) => s.replaceAll("_", " "))
        .join(", ")}`;
    }

    return "Related by topic";
  })()}
</div>
          ) : null}
        </li>
      ))}
    </ul>
  </div>
) : null}

      {track ? (
        <div className="mt-10 rounded border p-4">
          <div className="text-xs text-gray-600">
            Track: <Link className="underline" href={`/tracks/${track.slug}`}>{track.title}</Link>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-gray-600">Next up</div>
              {nextProblem ? (
                <Link
                  href={`/p/${nextProblem.slug}`}
                  className="block truncate text-base font-medium underline"
                >
                  {nextProblem.title} →
                </Link>
              ) : (
                <div className="text-base font-medium text-gray-600">
                  You reached the end of this track.
                </div>
              )}
            </div>

            {prevProblem ? (
              <Link
                href={`/p/${prevProblem.slug}`}
                className="shrink-0 text-sm underline text-gray-600"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}