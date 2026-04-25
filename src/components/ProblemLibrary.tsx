"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProblemMeta } from "@/lib/content/mdx";

type ProblemLibraryProps = {
  problems: ProblemMeta[];
};

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

function label(value?: string) {
  if (!value) return "";
  return value.replaceAll("_", " ");
}

export default function ProblemLibrary({ problems }: ProblemLibraryProps) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [strategy, setStrategy] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [source, setSource] = useState("all");

  const domains = useMemo(
    () => unique(problems.map((p) => p.domain)),
    [problems]
  );

  const sources = useMemo(
    () => unique(problems.map((p) => p.source ?? "MathLab")),
    [problems]
  );

  const strategies = useMemo(() => {
    return Array.from(
      new Set(problems.flatMap((p) => p.strategies ?? []))
    ).sort();
  }, [problems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return problems.filter((p) => {
      const haystack = [
        p.title,
        p.slug,
        p.domain,
        ...(p.tags ?? []),
        ...(p.topics ?? []),
        ...(p.strategies ?? []),
        ...(p.moves ?? []),
        p.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = q.length === 0 || haystack.includes(q);
      const matchesDomain = domain === "all" || p.domain === domain;
      const matchesStrategy =
        strategy === "all" || (p.strategies ?? []).includes(strategy);
      const matchesDifficulty =
        difficulty === "all" || String(p.difficulty) === difficulty;
      const matchesSource = source === "all" || (p.source ?? "MathLab") === source;

      return (
        matchesQuery &&
        matchesDomain &&
        matchesStrategy &&
        matchesDifficulty &&
        matchesSource
      );
    });
  }, [problems, query, domain, strategy, difficulty, source]);

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-lg border p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, topic, strategy, or proof move..."
            className="rounded border px-3 py-2 text-sm md:col-span-2"
          />

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="all">All domains</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {label(d)}
              </option>
            ))}
          </select>

          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="all">All strategies</option>
            {strategies.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="all">All difficulties</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={String(d)}>
                Difficulty {d}
              </option>
            ))}
          </select>

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded border px-3 py-2 text-sm"
          >
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Showing {filtered.length} of {problems.length} problems
        </div>
      </div>

      <ul className="space-y-3">
        {filtered.map((p) => (
          <li key={p.slug} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-3">
              <Link
                className="text-lg font-medium underline"
                href={`/p/${p.slug}`}
              >
                {p.title}
              </Link>
              <span className="shrink-0 text-xs text-gray-600">
                Difficulty {p.difficulty}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {p.domain ? (
                <span className="rounded-full border px-2 py-0.5 text-gray-700">
                  {label(p.domain)}
                </span>
              ) : null}

              {(p.topics ?? []).map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2 py-0.5 text-gray-700"
                >
                  {label(t)}
                </span>
              ))}

              {(p.strategies ?? []).map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-2 py-0.5 text-gray-700"
                >
                  strategy: {label(s)}
                </span>
              ))}
            </div>

            {(p.moves ?? []).length ? (
              <div className="mt-2 text-xs text-gray-600">
                Moves: {(p.moves ?? []).map(label).join(", ")}
              </div>
            ) : null}

            <div className="mt-2 text-xs text-gray-500">
              Source: {p.source ?? "MathLab"}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No problems match those filters.
        </div>
      ) : null}
    </div>
  );
}