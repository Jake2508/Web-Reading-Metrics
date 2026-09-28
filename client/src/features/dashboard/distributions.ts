import type { Book } from "../../../../shared/src/schemas";
import type { HistogramBin } from "../charts/Histogram";

interface BucketDef {
  label: string;
  range: string;
  test: (value: number) => boolean;
}

export interface Distribution {
  bins: HistogramBin[];
  /** Books that had a usable value. */
  counted: number;
  /** Books left out because the value was missing. */
  missing: number;
}

const LENGTH_BUCKETS: BucketDef[] = [
  { label: "<200", range: "Under 200 pages", test: (p) => p < 200 },
  { label: "200s", range: "200–299 pages", test: (p) => p >= 200 && p < 300 },
  { label: "300s", range: "300–399 pages", test: (p) => p >= 300 && p < 400 },
  { label: "400s", range: "400–499 pages", test: (p) => p >= 400 && p < 500 },
  { label: "500–699", range: "500–699 pages", test: (p) => p >= 500 && p < 700 },
  { label: "700+", range: "700 pages or more", test: (p) => p >= 700 },
];

const RATING_BUCKETS: BucketDef[] = [
  { label: "<3.0", range: "Rated below 3.0", test: (r) => r < 3 },
  { label: "3.0–3.4", range: "Rated 3.0–3.4", test: (r) => r >= 3 && r < 3.5 },
  { label: "3.5–3.9", range: "Rated 3.5–3.9", test: (r) => r >= 3.5 && r < 4 },
  { label: "4.0–4.4", range: "Rated 4.0–4.4", test: (r) => r >= 4 && r < 4.5 },
  { label: "4.5–5", range: "Rated 4.5–5", test: (r) => r >= 4.5 },
];

function distribute(values: (number | null | undefined)[], buckets: BucketDef[]): Distribution {
  const valid = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  return {
    bins: buckets.map(({ label, range, test }) => ({ label, range, count: valid.filter(test).length })),
    counted: valid.length,
    missing: values.length - valid.length,
  };
}

export function bookLengthDistribution(books: Book[]): Distribution {
  return distribute(
    books.map((b) => (b.pages > 0 ? b.pages : null)),
    LENGTH_BUCKETS
  );
}

export function ratingDistribution(books: Book[]): Distribution {
  // Ratings are stored to one decimal; round so float noise can't slip across a bucket edge.
  return distribute(
    books.map((b) => (b.rating == null ? null : Math.round(b.rating * 10) / 10)),
    RATING_BUCKETS
  );
}
