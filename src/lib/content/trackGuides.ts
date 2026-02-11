import fs from "node:fs";
import path from "node:path";

export function getTrackGuideSource(trackSlug: string): string | null {
  const file = path.join(process.cwd(), "src", "content", "tracks", trackSlug, "guide.mdx");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}
