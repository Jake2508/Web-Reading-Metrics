import type { Book } from "../../../../shared/src/schemas";
import { BookCover } from "../../components/ui/BookCover";
import { Meter } from "../../components/ui/Meter";
import { formatInt, plural } from "../../lib/format";
import { BookRow, Rating } from "./BookTable";
import { authorSlug, type AuthorGroup } from "./libraryFilters";

/** cover stack | name | books | avg rating | share | disclosure. */
const authorColumns =
  "grid grid-cols-[72px_minmax(0,1fr)_56px_16px] items-center gap-4 sm:grid-cols-[72px_minmax(0,1.5fr)_64px_80px_minmax(0,1fr)_16px]";

interface AuthorTableProps {
  groups: AuthorGroup[];
  totalBooks: number;
  longestPages: number;
  expanded: Set<string>;
  onToggle: (author: string) => void;
  highlighted: string | null;
}

function CoverStack({ books }: { books: Book[] }) {
  const top = [...books].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1)).slice(0, 3);
  return (
    <span className="flex items-center">
      {top.map((book, i) => (
        <BookCover
          key={book.id}
          coverUrl={book.coverUrl}
          title={book.title}
          compact
          className={`w-[30px] ${i > 0 ? "-ml-3" : ""}`}
        />
      ))}
    </span>
  );
}

function Disclosure({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
    >
      <polyline points={open ? "6 15 12 9 18 15" : "6 9 12 15 18 9"} />
    </svg>
  );
}

export function AuthorTable({ groups, totalBooks, longestPages, expanded, onToggle, highlighted }: AuthorTableProps) {
  const maxCount = Math.max(...groups.map((g) => g.books.length), 1);

  return (
    <div>
      <div
        aria-hidden="true"
        className={`${authorColumns} border-b border-border-subtle px-5 py-3 text-eyebrow font-bold uppercase tracking-eyebrow text-text-muted`}
      >
        <span />
        <span>Author</span>
        <span>Books</span>
        <span className="max-sm:hidden">Avg rating</span>
        <span className="max-sm:hidden">Share</span>
        <span />
      </div>

      <ul aria-label="Authors">
        {groups.map((group) => {
          const isOpen = expanded.has(group.author);
          const share = Math.round((group.books.length / totalBooks) * 100);
          const panelId = `author-books-${authorSlug(group.author)}`;
          return (
            <li
              key={group.author}
              id={`author-${authorSlug(group.author)}`}
              className="border-b border-border-subtle last:border-b-0"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(group.author)}
                className={`${authorColumns} w-full cursor-pointer px-5 py-3 text-left transition-colors duration-200 ease-out hover:bg-surface-hover focus-visible:-outline-offset-2 ${
                  isOpen || highlighted === group.author ? "bg-surface-2" : ""
                }`}
              >
                <CoverStack books={group.books} />
                <span className="min-w-0">
                  <span className="block truncate font-serif text-book font-semibold text-text">{group.author}</span>
                  <span className="block truncate text-meta text-text-muted">
                    {group.genres.join(" · ")} · {formatInt(group.totalPages)} pages
                  </span>
                </span>
                <span className="text-body font-bold text-text tabular-nums">
                  {group.books.length}
                  <span className="sr-only"> {group.books.length === 1 ? "book" : "books"}</span>
                </span>
                <span className="max-sm:hidden">
                  <span className="sr-only">Average rating </span>
                  <Rating value={group.avgRating} />
                </span>
                <span className="flex items-center gap-3 max-sm:hidden">
                  <Meter
                    value={group.books.length / maxCount}
                    fill={group.books.length === maxCount ? "brass" : "sage"}
                    className="flex-1"
                  />
                  <span className="w-10 text-right text-meta text-text-muted tabular-nums">
                    {share}%<span className="sr-only"> of library</span>
                  </span>
                </span>
                <Disclosure open={isOpen} />
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="table"
                  aria-label={`${plural(group.books.length, "book")} by ${group.author}`}
                  className="border-t border-border-subtle bg-bg"
                >
                  <div role="rowgroup">
                    {group.books.map((book) => (
                      <BookRow key={book.id} book={book} longestPages={longestPages} />
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
