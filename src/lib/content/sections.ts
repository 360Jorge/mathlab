export type ProblemSections = {
  problemMdx: string; // includes "## Problem" and anything before hints/solution
  hints: Array<{ title: string; mdx: string }>;
  solutionMdx: string; // content after "## Solution" (without the heading)
};

function findHeadingIndex(source: string, heading: string): number | null {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, "m");
  const m = re.exec(source);
  return m ? m.index : null;
}

export function splitProblemMdx(source: string): ProblemSections {
  const hintsIdx = findHeadingIndex(source, "Hints");
  const solutionIdx = findHeadingIndex(source, "Solution");

  const cut1 = hintsIdx ?? solutionIdx ?? source.length;
  const problemMdx = source.slice(0, cut1).trim();

  // Hints block: between ## Hints and ## Solution (or end)
  let hintsBlock = "";
  if (hintsIdx !== null) {
    const start = hintsIdx;
    const end = solutionIdx ?? source.length;
    hintsBlock = source.slice(start, end);
  }

  // Solution block: after ## Solution
  let solutionMdx = "";
  if (solutionIdx !== null) {
    const solHeadingRe = /^##\s+Solution\s*$/m;
    const after = source.slice(solutionIdx);
    const m = solHeadingRe.exec(after);
    solutionMdx = m ? after.slice(m.index + m[0].length).trim() : "";
  }

  // Parse hints into "### Hint ..." chunks
  const hints: Array<{ title: string; mdx: string }> = [];
  if (hintsBlock) {
    const lines = hintsBlock.split("\n");

    // Drop the "## Hints" heading line
    while (lines.length && !lines[0].match(/^##\s+Hints\s*$/)) lines.shift();
    if (lines.length && lines[0].match(/^##\s+Hints\s*$/)) lines.shift();

    const text = lines.join("\n").trim();

    // Split on "### Hint ..."
    const re = /^###\s+(.+)\s*$/gm;
    const matches = [...text.matchAll(re)];

    if (matches.length === 0) {
      // If user wrote hints without "###", treat whole thing as one hint
      if (text) hints.push({ title: "Hint 1", mdx: text });
    } else {
      for (let i = 0; i < matches.length; i++) {
        const title = matches[i][1].trim();
        const start = matches[i].index ?? 0;
        const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;

        // Remove the "### Title" line from the chunk
        const chunk = text.slice(start, end).replace(/^###\s+.+\s*$/m, "").trim();
        hints.push({ title, mdx: chunk });
      }
    }
  }

  return {
    problemMdx,
    hints,
    solutionMdx,
  };
}
