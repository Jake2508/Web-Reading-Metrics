import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { BookCover } from "../../components/ui/BookCover";
import { Badge } from "../../components/ui/Badge";

interface FeaturedBookProps {
  stats: Stats;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#000" : "none"}
          stroke="#000"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function FeaturedBook({ stats }: FeaturedBookProps) {
  const book = stats.highestRatedBook ?? stats.mostRecentBook ?? stats.longestBook;
  const label = stats.highestRatedBook
    ? "Highest Rated"
    : stats.mostRecentBook
    ? "Most Recent"
    : "Longest Book";

  if (!book) {
    return (
      <div
        className="border-3 border-black p-6 bg-white flex items-center justify-center h-full"
        style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      >
        <p className="font-bold text-black/40">No books yet</p>
      </div>
    );
  }

  return (
    <Link
      to={`/books?book=${book.id}`}
      className="border-3 border-black bg-white p-6 flex flex-col gap-4 h-full hover:-translate-y-0.5 hover:bg-[#FFEB3B]/10 transition-all"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-black/50">
          Featured Book
        </span>
        <Badge color="yellow">{label}</Badge>
      </div>

      <div className="flex gap-4 flex-1">
        <BookCover
          coverUrl={book.coverUrl}
          title={book.title}
          author={book.author}
          className="w-24 h-36 flex-shrink-0"
        />
        <div className="flex flex-col gap-2 min-w-0">
          <h3 className="font-black text-lg leading-tight text-black line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm font-bold text-black/60">{book.author}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Badge color="black">{book.genre}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="border-2 border-black p-2 bg-[#f5f5f5]">
              <div className="text-sm font-black">{book.pages.toLocaleString()}</div>
              <div className="text-xs text-black/50 font-bold">Pages</div>
            </div>
            {book.rating && (
              <div className="border-2 border-black p-2 bg-[#f5f5f5]">
                <StarRating rating={book.rating} />
                <div className="text-xs text-black/50 font-bold mt-0.5">{book.rating}/5</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {book.description && (
        <p className="text-xs text-black/60 leading-relaxed line-clamp-2 border-t-2 border-black pt-3">
          {book.description}
        </p>
      )}
    </Link>
  );
}
