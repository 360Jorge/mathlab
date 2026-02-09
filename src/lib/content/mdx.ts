import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProblemMeta = {
  slug: string;
  title: string;
  difficulty: number;
  tags?: string[];
  track?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "problems");

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && (full.endsWith(".mdx") || full.endsWith(".md"))) files.push(full);
  }
  return files;
}

export function getAllProblems(): ProblemMeta[] {
  const files = walk(CONTENT_DIR);

  return files
    .map((f) => {
      const raw = fs.readFileSync(f, "utf8");
      const { data } = matter(raw);

      return {
        slug: String(data.slug),
        title: String(data.title),
        difficulty: Number(data.difficulty ?? 0),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        track: data.track ? String(data.track) : undefined,
      };
    })
    .sort((a, b) => a.difficulty - b.difficulty);
}

export function getProblemBySlug(slug: string): { meta: ProblemMeta; source: string } | null {
  const files = walk(CONTENT_DIR);

  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const { data, content } = matter(raw);

    if (String(data.slug) === slug) {
      const meta: ProblemMeta = {
        slug: String(data.slug),
        title: String(data.title),
        difficulty: Number(data.difficulty ?? 0),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        track: data.track ? String(data.track) : undefined,
      };
      // IMPORTANT: return full raw MDX (without frontmatter) as content
      return { meta, source: content };
    }
  }
  return null;
}

