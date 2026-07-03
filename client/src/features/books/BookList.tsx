import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBooks } from "./hooks/useBooks";
import { BookCover } from "../../components/ui/BookCover";
import { Badge } from "../../components/ui/Badge";
import type { Book } from "../../../../shared/src/schemas";

function applyFilter(books: Book[], filter: string): Book[] {
  if (!filter || filter === "all") return books;
  if (filter.startsWith("genre:")) return books.filter((b) => b.genre === filter.slice(6));
  if (filter === "rating:high")
    return [...books].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  if (filter === "rating:low")
    return [...books].sort((a, b) => {
      if (a.rating == null && b.rating == null) return 0;
      if (a.rating == null) return 1;
      if (b.rating == null) return -1;
      return a.rating - b.rating;
    });
  if (filter === "rating:unrated") return books.filter((b) => !b.rating);
  if (filter === "size:largest") return [...books].sort((a, b) => b.pages - a.pages);
  if (filter === "size:smallest") return [...books].sort((a, b) => a.pages - b.pages);
  return books;
}

function applySearch(books: Book[], search: string): Book[] {
  const q = search.trim().toLowerCase();
  if (!q) return books;
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q)
  );
}

type OptionGroup = {
  label: string;
  options: { value: string; label: string }[];
};

function FilterDropdown({
  value,
  onChange,
  groups,
  allLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  groups: OptionGroup[];
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const currentLabel =
    value === "all"
      ? allLabel
      : groups.flatMap((g) => g.options).find((o) => o.value === value)?.label ?? allLabel;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="border-2 border-black px-3 py-1.5 text-sm font-black bg-white flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
        style={{ boxShadow: "3px 3px 0 #000" }}
      >
        <span>{currentLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 bg-white border-2 border-black min-w-44"
          style={{ boxShadow: "4px 4px 0 #000" }}
        >
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm font-bold border-b-2 border-black hover:bg-[#FFEB3B] transition-colors ${value === "all" ? "bg-[#FFEB3B]" : ""}`}
          >
            {allLabel}
          </button>

          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-1.5 text-xs font-black uppercase tracking-widest text-black/40 bg-black/5 border-b border-black/20">
                {group.label}
              </div>
              {group.options.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-[#FFEB3B] transition-colors ${value === opt.value ? "bg-[#FFEB3B]" : ""} ${i < group.options.length - 1 ? "border-b border-black/10" : "border-b-2 border-black"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type AuthorGroup = {
  author: string;
  books: Book[];
  totalPages: number;
  avgRating: number | null;
  genres: string[];
};

function authorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function groupByAuthor(books: Book[], order: "most" | "least" = "most"): AuthorGroup[] {
  const map = new Map<string, Book[]>();
  for (const book of books) {
    if (!map.has(book.author)) map.set(book.author, []);
    map.get(book.author)!.push(book);
  }
  const direction = order === "least" ? -1 : 1;
  return [...map.entries()]
    .map(([author, authorBooks]) => {
      const rated = authorBooks.filter((b) => b.rating != null);
      return {
        author,
        books: authorBooks,
        totalPages: authorBooks.reduce((sum, b) => sum + b.pages, 0),
        avgRating:
          rated.length > 0
            ? rated.reduce((sum, b) => sum + b.rating!, 0) / rated.length
            : null,
        genres: [...new Set(authorBooks.map((b) => b.genre))],
      };
    })
    .sort((a, b) => direction * (b.books.length - a.books.length) || a.author.localeCompare(b.author));
}

function MiniBookRow({ book }: { book: Book }) {
  return (
    <div className="flex gap-3 items-center py-2.5 border-b border-black/10 last:border-0">
      <BookCover
        coverUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        className="w-8 h-11 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-black text-xs leading-tight truncate">{book.title}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          <Badge color="black">{book.genre}</Badge>
          {book.rating && <Badge color="yellow">{book.rating}/5</Badge>}
          {book.publishedYear && (
            <span className="text-xs font-semibold text-black/40">{book.publishedYear}</span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-black">{book.pages.toLocaleString()}</div>
        <div className="text-xs font-bold text-black/50">pages</div>
        {book.dateFinished && (
          <div className="text-xs font-semibold text-black/40 mt-0.5">
            {new Date(book.dateFinished).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthorCard({
  group,
  isExpanded,
  onToggle,
  highlighted,
}: {
  group: AuthorGroup;
  isExpanded: boolean;
  onToggle: () => void;
  highlighted?: boolean;
}) {
  const topBooks = [...group.books]
    .sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    .slice(0, 3);

  return (
    <div
      id={`author-${authorSlug(group.author)}`}
      className={`border-black transition-colors duration-700 ${highlighted ? "bg-[#FFEB3B]/40" : "bg-white"}`}
      style={{ borderWidth: "3px", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
    >
      <button
        className="w-full p-4 flex gap-4 items-center text-left hover:bg-[#FFEB3B]/20 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center flex-shrink-0">
          {topBooks.map((book, i) => (
            <div
              key={book.id}
              className="border-2 border-black"
              style={{ marginLeft: i === 0 ? 0 : -10, zIndex: topBooks.length - i, position: "relative" }}
            >
              <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                author={book.author}
                className="w-10 h-14"
              />
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-base leading-tight">{group.author}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {group.genres.map((g) => (
              <Badge key={g} color="black">{g}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-4 items-center flex-shrink-0">
          <div className="text-center">
            <div className="text-xl font-black leading-none">{group.books.length}</div>
            <div className="text-xs font-bold text-black/50 mt-0.5">
              {group.books.length === 1 ? "book" : "books"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black leading-none">{group.totalPages.toLocaleString()}</div>
            <div className="text-xs font-bold text-black/50 mt-0.5">pages</div>
          </div>
          {group.avgRating != null && (
            <div className="text-center">
              <div className="text-xl font-black leading-none">{group.avgRating.toFixed(1)}</div>
              <div className="text-xs font-bold text-black/50 mt-0.5">avg</div>
            </div>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms",
              flexShrink: 0,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t-2 border-black px-4 bg-black/[0.02]">
          {group.books.map((book) => (
            <MiniBookRow key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookRow({ book, highlighted }: { book: Book; highlighted?: boolean }) {
  return (
    <div
      id={`book-${book.id}`}
      className={`border-black p-4 flex gap-4 items-start hover:-translate-y-0.5 transition-transform ${
        highlighted ? "bg-[#FFEB3B]/40" : "bg-white"
      }`}
      style={{
        borderWidth: "3px",
        border: "3px solid #000",
        boxShadow: "4px 4px 0 #000",
        transition: "background-color 700ms, transform 150ms",
      }}
    >
      <BookCover
        coverUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        className="w-14 h-20 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-base text-black leading-tight">{book.title}</h3>
        <p className="text-sm font-bold text-black/60 mt-0.5">{book.author}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge color="black">{book.genre}</Badge>
          {book.rating && <Badge color="yellow">{book.rating}/5</Badge>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-lg font-black">{book.pages.toLocaleString()}</div>
        <div className="text-xs font-bold text-black/50">pages</div>
        {book.dateFinished && (
          <div className="text-xs font-semibold text-black/40 mt-1">
            {new Date(book.dateFinished).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookList() {
  const { data: books, isLoading, error } = useBooks();
  const [searchParams] = useSearchParams();
  const authorParam = searchParams.get("author");
  const bookParam = searchParams.get("book");

  const [filter, setFilter] = useState(
    authorParam ? "author:most" : bookParam ? "rating:high" : "all"
  );
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"books" | "authors">(authorParam ? "authors" : "books");
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
        behavior: "smooth",
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
        behavior: "smooth",
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
      <div className="p-6 flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-black h-24 animate-pulse bg-gray-100"
            style={{ borderWidth: "3px", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className="border-black bg-[#FF5252] p-4 text-white"
          style={{ borderWidth: "3px", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
        >
          <p className="font-black">Failed to load books: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!books?.length) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div
          className="border-black bg-[#FFEB3B] p-8 text-center"
          style={{ borderWidth: "3px", border: "3px solid #000", boxShadow: "4px 4px 0 #000" }}
        >
          <p className="font-black text-xl">No books in your library</p>
          <p className="text-sm font-semibold text-black/60 mt-2">Use Admin to add your first book.</p>
        </div>
      </div>
    );
  }

  const genres = [...new Set(books.map((b) => b.genre))].sort();
  const afterFilter = applyFilter(books, filter);
  const filtered = applySearch(afterFilter, search);
  const authorGroups =
    viewMode === "authors" ? groupByAuthor(filtered, filter === "author:least" ? "least" : "most") : [];
  const isFiltered = filter !== "all" || search.trim().length > 0;
  const totalAuthors = [...new Set(books.map((b) => b.author))].length;

  const filterGroups: OptionGroup[] = [
    ...(viewMode === "authors"
      ? [
          {
            label: "Authors",
            options: [
              { value: "author:most", label: "Most Read" },
              { value: "author:least", label: "Least Read" },
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
        { value: "rating:high", label: "Top Rated" },
        { value: "rating:low", label: "Lowest Rated" },
        { value: "rating:unrated", label: "Unrated" },
      ],
    },
    {
      label: "Size",
      options: [
        { value: "size:largest", label: "Heaviest Read" },
        { value: "size:smallest", label: "Lightest Read" },
      ],
    },
  ];

  const countLabel =
    viewMode === "authors"
      ? `${authorGroups.length}${isFiltered ? `/${totalAuthors}` : ""} Author${authorGroups.length !== 1 ? "s" : ""}`
      : `${filtered.length}${isFiltered ? `/${books.length}` : ""} Book${filtered.length !== 1 ? "s" : ""}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-black">My Library</h1>
        <div className="flex border-2 border-black" style={{ boxShadow: "3px 3px 0 #000" }}>
          <button
            className={`px-4 py-1.5 text-sm font-black border-r-2 border-black transition-colors ${
              viewMode === "books" ? "bg-[#FFEB3B]" : "bg-white hover:bg-[#FFEB3B]/40"
            }`}
            onClick={() => setViewMode("books")}
          >
            Book View
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-black transition-colors ${
              viewMode === "authors" ? "bg-[#FFEB3B]" : "bg-white hover:bg-[#FFEB3B]/40"
            }`}
            onClick={() => setViewMode("authors")}
          >
            Author View
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            viewMode === "authors"
              ? "Search authors, titles, genres…"
              : "Search titles, authors, genres…"
          }
          className="flex-1 min-w-40 border-2 border-black px-3 py-1.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
          style={{ boxShadow: "2px 2px 0 #000" }}
        />
        <FilterDropdown
          value={filter}
          onChange={setFilter}
          groups={filterGroups}
          allLabel={viewMode === "authors" ? "All Authors" : "All Books"}
        />
        <div
          className="border-2 border-black px-3 py-1.5 bg-[#FFEB3B]"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          <span className="text-sm font-black">{countLabel}</span>
        </div>
      </div>

      {viewMode === "books" && (
        filtered.length === 0 ? (
          <div
            className="border-2 border-black p-6 bg-white text-center"
            style={{ boxShadow: "3px 3px 0 #000" }}
          >
            <p className="font-black text-black/60">No books match this filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((book) => (
              <BookRow key={book.id} book={book} highlighted={highlightedBook === book.id} />
            ))}
          </div>
        )
      )}

      {viewMode === "authors" && (
        authorGroups.length === 0 ? (
          <div
            className="border-2 border-black p-6 bg-white text-center"
            style={{ boxShadow: "3px 3px 0 #000" }}
          >
            <p className="font-black text-black/60">No authors match this filter.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {authorGroups.map((group) => (
              <AuthorCard
                key={group.author}
                group={group}
                isExpanded={expandedAuthors.has(group.author)}
                onToggle={() => toggleAuthor(group.author)}
                highlighted={highlightedAuthor === group.author}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
