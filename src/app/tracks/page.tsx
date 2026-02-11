import Link from "next/link";
import { TRACKS } from "@/lib/content/tracks";

export default function TracksIndexPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Tracks</h1>
      <p className="mt-2 text-gray-600">
        Curated learning paths designed to build specific problem-solving skills.
      </p>

      <ul className="mt-8 space-y-4">
        {TRACKS.map((track) => (
          <li key={track.slug} className="rounded border p-4">
            <Link
              href={`/tracks/${track.slug}`}
              className="text-lg font-medium underline"
            >
              {track.title}
            </Link>
            <p className="mt-1 text-sm text-gray-600">
              {track.description}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
