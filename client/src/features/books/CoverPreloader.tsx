import { useEffect } from "react";
import { useBooks } from "./hooks/useBooks";
import { preloadCovers } from "../../lib/covers";

/**
 * Warms the cover cache in the background on whichever page loads first, so
 * the Library (and Author view) open with their covers already downloaded.
 * Renders nothing.
 */
export function CoverPreloader() {
  const { data: books } = useBooks();

  useEffect(() => {
    if (!books) return;
    // Library order first, so the rows at the top of the table are ready soonest.
    return preloadCovers(books.map((b) => b.coverUrl));
  }, [books]);

  return null;
}
