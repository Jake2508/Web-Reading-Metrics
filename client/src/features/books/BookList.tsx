import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "./hooks/useBooks";
import { BookTable } from "./BookTable";
import { AuthorTable } from "./AuthorTable";
import { applyFilter, applySearch, authorSlug, groupByAuthor } from "./libraryFilters";
import { Panel } from "../../components/ui/Panel";
import { Select } from "../../components/ui/Select";
import { SegmentedToggle } from "../../components/ui/SegmentedToggle";
import { Skeleton } from "../../components/ui/Skeleton";
import { fieldClass } from "../../components/ui/fieldStyles";
import { formatInt } from "../../lib/format";
import { scrollBehavior } from "../../lib/useReducedMotion";

type ViewMode = "books" | "authors";

type OptionGroup = {
  label: string;
  options: { value: string; label: string }[];
};

function SearchIcon() {
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
      className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16" y2="16" />
    </svg>
  );
}

function PageHeader({ viewMode, onViewChange }: { viewMode: ViewMode; onViewChange?: (v: ViewMode) => void }) {
  return (
    <header className="mb-2 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-serif text-title text-text">Library</h1>
      {onViewChange && (
        <SegmentedToggle
          label="View"
          value={viewMode}
          onChange={onViewChange}
          options={[
            { value: "books", label: "Books" },
            { value: "authors", label: "Authors" },
          ]}
        />
      )}
    </header>
  );
}

export function BookList() {
  const { data: books, isLoading, error } = useBooks();
  const [searchParams] = useSearchParams();
  const authorParam = searchParams.get("author");
  const bookParam = searchParams.get("book");
  const filterParam = searchParams.get("filter");

  const [filter, setFilter] = useState(
    filterParam ?? (authorParam ? "author:most" : bookParam ? "rating:high" : "all")
  );
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(authorParam ? "authors" : "books");
  const [expandedAuthors, setExpandedAuthors] = useState<Set<string>>(new Set());
  const [highlightedAuthor, setHighlightedAuthor] = useState<string | null>(null);
  const [highlightedBook, setHighlightedBook] = useState<string | null>(null);

  useEffect(() => {
    if (!authorParam || !books) return;
    const match = books.find((b) => b.author.toLowerCase() === authorParam.toLowerCase());
    if (!match) return;

    setExpandedAuthors((prev) => new Set(prev).add(match.author));
    setHighlightedAuthor(match.author);

    const raf = requestAnimationFrame(() => {
      document.getElementById(`author-${authorSlug(match.author)}`)?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "center",
      });
    });
    const timeout = setTimeout(() => setHighlightedAuthor(null), 1800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [authorParam, books]);

  useEffect(() => {
    if (!bookParam || !books) return;
    const match = books.find((b) => b.id === bookParam);
    if (!match) return;

    setHighlightedBook(match.id);

    const raf = requestAnimationFrame(() => {
      document.getElementById(`book-${match.id}`)?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "center",
      });
    });
    const timeout = setTimeout(() => setHighlightedBook(null), 1800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [bookParam, books]);

  const toggleAuthor = (author: string) => {
    setExpandedAuthors((prev) => {
      const next = new Set(prev);
      if (next.has(author)) next.delete(author);
      else next.add(author);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <PageHeader viewMode={viewMode} />
        <Skeleton className="h-12" />
        <Skeleton className="h-[480px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader viewMode={viewMode} />
        <Panel>
          <p className="text-body text-text">Couldn’t load your library.</p>
          <p className="mt-1 text-meta text-text-muted">{error.message}</p>
        </Panel>
      </div>
    );
  }

  if (!books?.length) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader viewMode={viewMode} />
        <Panel className="text-center">
          <p className="font-serif text-panel font-semibold text-text">No books in your library</p>
          <p className="mt-1 text-meta text-text-muted">Use Admin to add your first book.</p>
        </Panel>
      </div>
    );
  }

  const genres = [...new Set(books.map((b) => b.genre))].sort();
  const afterFilter = applyFilter(books, filter);
  const filtered = applySearch(afterFilter, search);
  const authorGroups =
    viewMode === "authors" ? groupByAuthor(filtered, filter === "author:least" ? "least" : "most") : [];
  const isFiltered = filter !== "all" || search.trim().length > 0;
  const totalAuthors = new Set(books.map((b) => b.author)).size;
  const longestPages = Math.max(...books.map((b) => b.pages));

  const filterGroups: OptionGroup[] = [
    ...(viewMode === "authors"
      ? [
          {
            label: "Authors",
            options: [
              { value: "author:most", label: "Most read" },
              { value: "author:least", label: "Least read" },
            ],
          },
        ]
      : []),
    {
      label: "Genre",
      options: genres.map((g) => ({ value: `genre:${g}`, label: g })),
    },
    {
      label: "Rating",
      options: [
        { value: "rating:high", label: "Top rated" },
        { value: "rating:low", label: "Lowest rated" },
        { value: "rating:unrated", label: "Unrated" },
      ],
    },
    {
      label: "Size",
      options: [
        { value: "size:largest", label: "Heaviest read" },
        { value: "size:smallest", label: "Lightest read" },
      ],
    },
  ];

  const shown = viewMode === "authors" ? authorGroups.length : filtered.length;
  const total = viewMode === "authors" ? totalAuthors : books.length;
  const noun = viewMode === "authors" ? "author" : "book";
  const countLabel = `${formatInt(shown)}${isFiltered ? ` / ${formatInt(total)}` : ""} ${noun}${shown === 1 && !isFiltered ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader viewMode={viewMode} onViewChange={setViewMode} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search library"
            placeholder={
              viewMode === "authors" ? "Search authors, titles, genres…" : "Search titles, authors, genres…"
            }
            className={`${fieldClass} pl-11`}
          />
        </div>
        <Select
          aria-label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-56"
        >
          <option value="all">{viewMode === "authors" ? "All authors" : "All books"}</option>
          {filterGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
        <p aria-live="polite" className="px-1 text-body font-bold whitespace-nowrap text-brass tabular-nums">
          {countLabel}
        </p>
      </div>

      <Panel as="div" flush className="overflow-hidden">
        {shown === 0 ? (
          <p className="px-6 py-10 text-center text-body text-text-muted">
            No {noun}s match this {search.trim() ? "search" : "filter"}.
          </p>
        ) : viewMode === "books" ? (
          <BookTable books={filtered} longestPages={longestPages} highlightedId={highlightedBook} />
        ) : (
          <AuthorTable
            groups={authorGroups}
            totalBooks={books.length}
            longestPages={longestPages}
            expanded={expandedAuthors}
            onToggle={toggleAuthor}
            highlighted={highlightedAuthor}
          />
        )}
      </Panel>
    </div>
  );
}
