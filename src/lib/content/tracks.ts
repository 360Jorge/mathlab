export type TrackMeta = {
  slug: string;
  title: string;
  description: string;
  order: string[]; // ordered list of problem slugs
};

export const TRACKS: TrackMeta[] = [
  {
    slug: "putnam-warmups",
    title: "Putnam Warmups",
    description:
      "A collection of short problems designed to build intuition in invariants, modular arithmetic, and combinatorics.",
    order: [
      "pw-001-parity-invariant",
      "pw-002-mod-invariant",
      "pw-003-pigeonhole",
    ],
  },
];
