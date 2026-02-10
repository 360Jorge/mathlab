import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getProblemBySlug } from "@/lib/content/mdx";

import ProblemTabs from "@/components/ProblemTabs";
import AttemptEditor from "@/components/AttemptEditor";
import HintLadder from "@/components/HintLadder";
import { splitProblemMdx } from "@/lib/content/sections";


type Props = { params: Promise<{ slug: string }> };

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;

  const data = getProblemBySlug(slug);

  if (!data) return notFound();

  const sections = splitProblemMdx(data.source);

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
        attempt={<AttemptEditor />}
        hints={
          <HintLadder
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
        solution={<p className="text-sm text-gray-500">Solution will appear here.</p>}
        lean={<p className="text-sm text-gray-500">Lean verification coming soon.</p>}
      />

    </main>
  );
}
