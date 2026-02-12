import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getProblemBySlug } from "@/lib/content/mdx";

import ProblemTabs from "@/components/ProblemTabs";
import AttemptEditor from "@/components/AttemptEditor";
import HintLadder from "@/components/HintLadder";
import { splitProblemMdx } from "@/lib/content/sections";
import SolutionGate from "@/components/SolutionGate";

import Link from "next/link";
import { TRACKS } from "@/lib/content/tracks";
import { getAllProblems } from "@/lib/content/mdx";


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

      
      <ProblemTabs
        attempt={<AttemptEditor storageKey={`attempt:${slug}`} />}
        hints={
          <HintLadder
            storageKey={`hints_revealed:${slug}`}
            hints={sections.hints.map((h) => ({
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
            }))}
          />
        }
        solution={
            sections.solutionMdx.trim().length === 0 ? (
              <p className="text-sm text-gray-500">No solution yet.</p>
            ) : (
              <SolutionGate
                storageKey={`solution_revealed:${slug}`}
                solution={
                  <MDXRemote
                    source={sections.solutionMdx}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkMath],
                        rehypePlugins: [rehypeKatex],
                      },
                    }}
                  />
                }
              />
            )
          }

        lean={<p className="text-sm text-gray-500">Lean verification coming soon.</p>}
      />

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

            {/* Optional: previous link (nice for navigation) */}
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
