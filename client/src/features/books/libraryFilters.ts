import type { Book } from "../../../../shared/src/schemas";

export function applyFilter(books: Book[], filter: string): Book[] {
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

export function applySearch(books: Book[], search: string): Book[] {
  const q = search.trim().toLowerCase();
  if (!q) return books;
  return books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q)
  );
}

export type AuthorGroup = {
  author: string;
  books: Book[];
  totalPages: number;
  avgRating: number | null;
  genres: string[];
};

export function authorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function groupByAuthor(books: Book[], order: "most" | "least" = "most"): AuthorGroup[] {
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
