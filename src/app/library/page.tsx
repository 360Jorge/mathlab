import Link from 'next/link'
import { getAllProblems } from '@/lib/content/mdx'

export default function LibraryPage() {
  const problems = getAllProblems()

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Library</h1>
      <p className="mt-2 text-sm text-gray-600">
        Training problems with hints, solutions, and (soon) Lean verification.
      </p>

      <ul className="mt-6 space-y-3">
        {problems.map((p) => (
          <li key={p.slug} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between gap-3">
              <Link className="text-lg font-medium underline" href={`/p/${p.slug}`}>
                {p.title}
              </Link>
              <span className="text-xs text-gray-600">Difficulty {p.difficulty}</span>
            </div>
            {p.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5 text-xs text-gray-700">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
