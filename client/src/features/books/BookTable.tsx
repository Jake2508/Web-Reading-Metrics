import type { Book } from "../../../../shared/src/schemas";
import { BookCover } from "../../components/ui/BookCover";
import { Chip } from "../../components/ui/Chip";
import { Meter } from "../../components/ui/Meter";
import { formatInt } from "../../lib/format";

/** cover | title + author | genre | rating | length. Genre and length drop out on small screens. */
export const bookColumns =
  "grid grid-cols-[52px_minmax(0,1fr)_64px] items-center gap-4 sm:grid-cols-[52px_minmax(0,1.5fr)_120px_80px_minmax(0,1fr)]";

const headerClass =
  "border-b border-border-subtle px-5 py-3 text-eyebrow font-bold uppercase tracking-eyebrow text-text-muted";

function finishedLabel(dateFinished: string | null): string | null {
  if (!dateFinished) return null;
  return new Date(dateFinished).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function Rating({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="text-body text-text-faint">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Unrated</span>
      </span>
    );
  }
  return (
    <span className="text-body font-bold text-brass tabular-nums">
      <span aria-hidden="true">★ </span>
      {value.toFixed(1)}
      <span className="sr-only"> out of 5</span>
    </span>
  );
}

interface BookRowProps {
  book: Book;
  longestPages: number;
  highlighted?: boolean;
}

export function BookRow({ book, longestPages, highlighted }: BookRowProps) {
  const finished = finishedLabel(book.dateFinished);
  return (
    <div
      role="row"
      id={`book-${book.id}`}
      className={`${bookColumns} border-b border-border-subtle px-5 py-3 transition-colors duration-200 ease-out last:border-b-0 hover:bg-surface-hover ${
        highlighted ? "bg-surface-2" : ""
      }`}
    >
      <div role="cell">
        <BookCover coverUrl={book.coverUrl} title={book.title} className="w-11" compact />
      </div>
      <div role="cell" className="min-w-0">
        <p className="line-clamp-2 font-serif text-book font-semibold text-text">{book.title}</p>
        <p className="mt-0.5 truncate text-meta text-text-muted">
          {book.author}
          {finished && ` · ${finished}`}
          <span className="sm:hidden"> · {formatInt(book.pages)} pages</span>
        </p>
      </div>
      <div role="cell" className="min-w-0 max-sm:hidden">
        <Chip>{book.genre}</Chip>
      </div>
      <div role="cell">
        <Rating value={book.rating} />
      </div>
      <div role="cell" className="flex items-center gap-3 max-sm:hidden">
        <Meter value={longestPages > 0 ? book.pages / longestPages : 0} className="flex-1" />
        <span className="w-12 text-right text-meta text-text-muted tabular-nums">
          {formatInt(book.pages)}
          <span className="sr-only"> pages</span>
        </span>
      </div>
    </div>
  );
}

interface BookTableProps {
  books: Book[];
  longestPages: number;
  highlightedId: string | null;
}

export function BookTable({ books, longestPages, highlightedId }: BookTableProps) {
  return (
    <div role="table" aria-label="Books" aria-rowcount={books.length + 1}>
      <div role="rowgroup">
        <div role="row" className={`${bookColumns} ${headerClass}`}>
          <span role="columnheader">
            <span className="sr-only">Cover</span>
          </span>
          <span role="columnheader">Title</span>
          <span role="columnheader" className="max-sm:hidden">
            Genre
          </span>
          <span role="columnheader">Rating</span>
          <span role="columnheader" className="max-sm:hidden">
            Length
          </span>
        </div>
      </div>
      <div role="rowgroup">
        {books.map((book) => (
          <BookRow key={book.id} book={book} longestPages={longestPages} highlighted={highlightedId === book.id} />
        ))}
      </div>
    </div>
  );
}
