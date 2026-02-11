import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { TRACKS } from "@/lib/content/tracks";
import { getTrackGuideSource } from "@/lib/content/trackGuides";

type Props = { params: Promise<{ slug: string }> };

export default async function TrackGuidePage({ params }: Props) {
  const { slug } = await params;

  const track = TRACKS.find((t) => t.slug === slug);
  if (!track) return notFound();

  const source = getTrackGuideSource(slug);
  if (!source) return notFound();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/tracks/${slug}`} className="text-sm underline">
          ← Back to Track
        </Link>
        <Link href="/library" className="text-sm underline">
          Library →
        </Link>
      </div>

      <article className="prose prose-lg leading-relaxed max-w-none">
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </article>
    </main>
  );
}
