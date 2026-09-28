import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { BookCover } from "../../components/ui/BookCover";
import { Chip } from "../../components/ui/Chip";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { formatInt } from "../../lib/format";

interface FeaturedBookProps {
  stats: Stats;
}

export function FeaturedBook({ stats }: FeaturedBookProps) {
  const book = stats.highestRatedBook ?? stats.mostRecentBook ?? stats.longestBook;
  const label = stats.highestRatedBook
    ? "Highest rated"
    : stats.mostRecentBook
      ? "Most recent"
      : "Longest book";

  if (!book) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="rounded-lg border border-border bg-surface transition-colors duration-150 ease-out hover:bg-surface-hover"
    >
      <Link to={`/books?book=${book.id}`} className="flex h-full gap-6 rounded-lg px-6 py-[22px]">
        <BookCover coverUrl={book.coverUrl} title={book.title} className="w-28 self-start" sizes="112px" priority />
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 id="featured-heading">
            <Eyebrow tone="brass">Featured · {label}</Eyebrow>
          </h2>
          <p className="mt-2.5 line-clamp-2 font-serif text-metric text-text">{book.title}</p>
          <p className="mt-1 truncate text-body text-text-muted">{book.author}</p>
          <div className="mt-3">
            <Chip>{book.genre}</Chip>
          </div>
          <dl className="mt-auto flex gap-8 pt-4">
            <div className="flex flex-col gap-1">
              <dt>
                <Eyebrow>Pages</Eyebrow>
              </dt>
              <dd className="font-serif text-metric text-text tabular-nums">{formatInt(book.pages)}</dd>
            </div>
            {book.rating != null && (
              <div className="flex flex-col gap-1">
                <dt>
                  <Eyebrow>Rating</Eyebrow>
                </dt>
                <dd className="font-serif text-metric text-brass tabular-nums">{book.rating.toFixed(1)}</dd>
              </div>
            )}
          </dl>
        </div>
      </Link>
    </section>
  );
}
