import { useState } from "react";
import { useSearch } from "./hooks/useSearch";
import { BookForm } from "./BookForm";
import { useCreateBook, useBooks, useUpdateBook, useDeleteBook } from "../books/hooks/useBooks";
import { BookCover } from "../../components/ui/BookCover";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { Panel } from "../../components/ui/Panel";
import { SegmentedToggle } from "../../components/ui/SegmentedToggle";
import { Skeleton } from "../../components/ui/Skeleton";
import { Tag } from "../../components/ui/Tag";
import { fieldClass, labelClass } from "../../components/ui/fieldStyles";
import type { BookSearchResult, Book } from "../../../../shared/src/schemas";

function isDuplicateBook(
  candidate: { title?: string; author?: string; isbn?: string | null },
  books: Book[]
): Book | undefined {
  const norm = (s: string) => s.trim().toLowerCase();
  return books.find((b) => {
    if (
      candidate.isbn &&
      b.isbn &&
      candidate.isbn.replace(/[-\s]/g, "") === b.isbn.replace(/[-\s]/g, "")
    )
      return true;
    return (
      norm(b.title) === norm(candidate.title ?? "") &&
      norm(b.author) === norm(candidate.author ?? "")
    );
  });
}

type AdminView =
  | { type: "search" }
  | { type: "form-new"; prefill?: Partial<BookSearchResult> }
  | { type: "form-edit"; book: Book }
  | { type: "library" };

export function AdminPanel() {
  const [view, setView] = useState<AdminView>({ type: "search" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: searchResults, isLoading: searchLoading } = useSearch(activeQuery, searchLimit);
  const { data: books } = useBooks();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const formNewDuplicate =
    view.type === "form-new" && view.prefill
      ? isDuplicateBook(view.prefill, books ?? [])
      : undefined;

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      setActiveQuery(searchQuery.trim());
    }
  };

  const handleSelectResult = (result: BookSearchResult) => {
    setView({ type: "form-new", prefill: result });
  };

  const handleCreateSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      pages: Number(data.pages),
      rating: data.rating !== "" && data.rating != null ? Number(data.rating) : null,
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
      coverUrl: data.coverUrl || null,
      description: data.description || null,
      publishedYear: data.publishedYear !== "" && data.publishedYear != null ? Number(data.publishedYear) : null,
      isbn: data.isbn || null,
    };
    await createBook.mutateAsync(payload);
    setView({ type: "library" });
  };

  const handleUpdateSubmit = async (data: any, bookId: string) => {
    const payload = {
      title: data.title,
      author: data.author,
      genre: data.genre,
      pages: Number(data.pages),
      rating: data.rating !== "" && data.rating != null ? Number(data.rating) : null,
      dateFinished: data.dateFinished ? new Date(data.dateFinished).toISOString() : null,
      coverUrl: data.coverUrl || null,
      description: data.description || null,
      publishedYear: data.publishedYear !== "" && data.publishedYear != null ? Number(data.publishedYear) : null,
      isbn: data.isbn || null,
    };
    await updateBook.mutateAsync({ id: bookId, data: payload });
    setView({ type: "library" });
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteError(null);
      await deleteBook.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-title text-text">Admin</h1>
        <SegmentedToggle
          label="Admin section"
          value={view.type === "search" || view.type === "form-new" ? "add" : "manage"}
          onChange={(v) => setView({ type: v === "add" ? "search" : "library" })}
          options={[
            { value: "add", label: "Add book" },
            { value: "manage", label: "Manage library" },
          ]}
        />
      </header>

      {view.type === "search" && (
        <div className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-3" aria-labelledby="admin-search-heading">
            <h2 id="admin-search-heading" className="font-serif text-panel font-semibold text-text">
              Search for a book
            </h2>
            <div className="flex flex-wrap items-end gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Book title or author…"
                aria-label="Book title or author"
                className={`${fieldClass} min-w-48 flex-1`}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="admin-search-limit" className={labelClass}>
                  Results
                </label>
                <input
                  id="admin-search-limit"
                  type="number"
                  min={1}
                  max={40}
                  value={searchLimit}
                  onChange={(e) => {
                    const v = Math.min(40, Math.max(1, parseInt(e.target.value, 10) || 1));
                    setSearchLimit(v);
                  }}
                  className={`${fieldClass} w-20 text-center`}
                />
              </div>
              <Button onClick={handleSearch} disabled={searchQuery.trim().length < 2} className="py-3">
                Search
              </Button>
            </div>
            <p className="text-meta text-text-muted">
              Searches Open Library and Google Books. You can edit all fields before saving.
            </p>
          </Panel>

          {searchLoading && (
            <div className="flex flex-col gap-2" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          )}

          {searchResults && !searchLoading && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-body font-bold text-brass tabular-nums">{searchResults.length} results</p>
                <Button size="sm" variant="ghost" onClick={() => setView({ type: "form-new" })}>
                  Add manually
                </Button>
              </div>
              {searchResults.length === 0 && (
                <Panel as="div" className="text-center">
                  <p className="text-body text-text-muted">No results found.</p>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={() => setView({ type: "form-new" })}>
                    Add manually
                  </Button>
                </Panel>
              )}
              {searchResults.map((result) => {
                const alreadyAdded = isDuplicateBook(result, books ?? []);
                return (
                  <div
                    key={result.externalId}
                    className="flex cursor-pointer items-start gap-4 rounded-lg border border-border bg-surface px-5 py-3 transition-colors duration-150 ease-out hover:bg-surface-hover"
                    onClick={() => handleSelectResult(result)}
                  >
                    <BookCover coverUrl={result.coverUrl} title={result.title} className="w-10" compact />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-book font-semibold text-text">{result.title}</p>
                      <p className="mt-0.5 text-meta text-text-muted">{result.author}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Chip>{result.genre}</Chip>
                        {result.pages && <Chip>{result.pages} pages</Chip>}
                        {result.publishedYear && (
                          <span className="text-meta text-text-muted tabular-nums">{result.publishedYear}</span>
                        )}
                        {alreadyAdded && <Tag>In library</Tag>}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleSelectResult(result); }}>
                      Select
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view.type === "form-new" && (
        <Panel className="flex flex-col gap-4" aria-labelledby="admin-form-heading">
          <h2 id="admin-form-heading" className="font-serif text-panel font-semibold text-text">
            {view.prefill ? "Review and edit book" : "Add book manually"}
          </h2>
          {formNewDuplicate && (
            <div role="status" className="rounded-md border border-brass bg-surface-2 px-4 py-3">
              <p className="text-body font-bold text-brass">Already in your library</p>
              <p className="mt-0.5 text-meta text-text-muted">
                “{formNewDuplicate.title}” by {formNewDuplicate.author} has already been added.
              </p>
            </div>
          )}
          <BookForm
            prefill={view.prefill}
            onSubmit={handleCreateSubmit}
            onCancel={() => setView({ type: "search" })}
            isSubmitting={createBook.isPending}
          />
          {createBook.isError && (
            <p role="alert" className="text-body font-bold text-brass">{createBook.error.message}</p>
          )}
        </Panel>
      )}

      {view.type === "library" && (
        <div className="flex flex-col gap-3">
          {deleteError && (
            <div role="alert" className="rounded-md border border-brass bg-surface-2 px-4 py-3">
              <p className="text-body font-bold text-brass">Delete failed: {deleteError}</p>
              <p className="mt-1 text-meta text-text-muted">Make sure the backend server is running on port 3002.</p>
            </div>
          )}
          {!books?.length && (
            <Panel as="div" className="text-center">
              <p className="text-body text-text-muted">No books yet. Add some!</p>
            </Panel>
          )}
          {books?.map((book) => (
            <div
              key={book.id}
              className="flex items-start gap-4 rounded-lg border border-border bg-surface px-5 py-3 transition-colors duration-150 ease-out hover:bg-surface-hover"
            >
              <BookCover coverUrl={book.coverUrl} title={book.title} className="w-11" compact />
              <div className="min-w-0 flex-1">
                <p className="font-serif text-book font-semibold text-text">{book.title}</p>
                <p className="text-meta text-text-muted">{book.author}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Chip>{book.genre}</Chip>
                  {book.rating != null && (
                    <span className="text-meta font-bold text-brass tabular-nums">
                      <span aria-hidden="true">★ </span>
                      {book.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => setView({ type: "form-edit", book })}>
                  Edit
                </Button>
                {deleteConfirmId === book.id ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)} disabled={deleteBook.isPending}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(null)}>
                      No
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(book.id)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {view.type === "form-edit" && (
        <Panel className="flex flex-col gap-4" aria-labelledby="admin-edit-heading">
          <h2 id="admin-edit-heading" className="font-serif text-panel font-semibold text-text">
            Edit book
          </h2>
          <BookForm
            existingBook={view.book}
            onSubmit={(data) => handleUpdateSubmit(data, view.book.id)}
            onCancel={() => setView({ type: "library" })}
            isSubmitting={updateBook.isPending}
          />
          {updateBook.isError && (
            <p role="alert" className="text-body font-bold text-brass">{updateBook.error.message}</p>
          )}
        </Panel>
      )}
    </div>
  );
}
