/** Fixed genre → colour mapping from DESIGN.md, in palette order. */
const FIXED_GENRE_COLOURS: Record<string, string> = {
  Fantasy: "var(--g1)",
  "Science Fiction": "var(--g2)",
  Horror: "var(--g3)",
  "Mystery & Thriller": "var(--g4)",
  History: "var(--g5)",
  Nature: "var(--g6)",
  "Self-Help": "var(--g7)",
};

const PALETTE = Object.values(FIXED_GENRE_COLOURS);

export const OTHER_GENRES_COLOUR = "var(--g-other)";

/**
 * Colours for the genres shown in a chart. Named genres always keep their fixed
 * colour; a genre outside the named seven that still makes the top list borrows
 * the first palette colour no shown genre is using.
 */
export function assignGenreColours(genres: string[]): Map<string, string> {
  const taken = new Set(genres.map((g) => FIXED_GENRE_COLOURS[g]).filter(Boolean));
  const spare = PALETTE.filter((colour) => !taken.has(colour));
  return new Map(genres.map((g) => [g, FIXED_GENRE_COLOURS[g] ?? spare.shift() ?? OTHER_GENRES_COLOUR]));
}
