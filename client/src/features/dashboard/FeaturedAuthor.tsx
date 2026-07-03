import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { Badge } from "../../components/ui/Badge";

interface FeaturedAuthorProps {
  stats: Stats;
}

const AUTO_ADVANCE_MS = 4000;

export function FeaturedAuthor({ stats }: FeaturedAuthorProps) {
  const authors = stats.authorBreakdown.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || authors.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % authors.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, authors.length]);

  if (authors.length === 0) {
    return (
      <div
        className="border-3 border-black p-6 bg-[#FFEB3B] flex items-center justify-center h-full"
        style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      >
        <p className="font-bold text-black/60">No author data yet</p>
      </div>
    );
  }

  const author = authors[index];
  const percentage = Math.round((author.count / stats.totalBooks) * 100);
  const avgPages = Math.round(author.pages / author.count);
  const goTo = (i: number) => setIndex(((i % authors.length) + authors.length) % authors.length);
  const libraryLink = `/books?author=${encodeURIComponent(author.author)}`;

  return (
    <div
      className="border-3 border-black bg-[#FFEB3B] p-6 flex flex-col gap-4 h-full"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-black/50">
            Top Authors
          </span>
          <Link
            to={libraryLink}
            className="block text-3xl font-black text-black mt-1 leading-tight hover:underline decoration-2 underline-offset-2"
          >
            {author.author}
          </Link>
        </div>
        <Badge color="black">#{index + 1}</Badge>
      </div>

      <div className="flex gap-3 mt-auto">
        <Link
          to={libraryLink}
          className="border-2 border-black bg-white p-3 flex-1 text-center block hover:bg-[#FFEB3B] transition-colors"
        >
          <div className="text-2xl font-black text-black">{author.count}</div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Books</div>
        </Link>
        <div className="border-2 border-black bg-white p-3 flex-1 text-center">
          <div className="text-2xl font-black text-black">{percentage}%</div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Of Library</div>
        </div>
        <div className="border-2 border-black bg-white p-3 flex-1 text-center">
          <div className="text-2xl font-black text-black">{avgPages}</div>
          <div className="text-xs font-bold text-black/60 uppercase mt-0.5">Avg Pages</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-black/50 uppercase mb-1.5">Library Share</div>
        <div className="h-4 border-2 border-black bg-white overflow-hidden">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {authors.length > 1 && (
        <div className="flex items-center justify-center gap-3 -mb-1">
          <button
            type="button"
            aria-label="Previous author"
            onClick={() => goTo(index - 1)}
            className="text-black/40 hover:text-black font-black text-base leading-none transition-colors px-1"
          >
            ‹
          </button>
          <div className="flex gap-1.5">
            {authors.map((a, i) => (
              <button
                key={a.author}
                type="button"
                aria-label={`Show ${a.author}`}
                onClick={() => goTo(i)}
                className={`w-2 h-2 border border-black transition-colors ${i === index ? "bg-black" : "bg-white"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next author"
            onClick={() => goTo(index + 1)}
            className="text-black/40 hover:text-black font-black text-base leading-none transition-colors px-1"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
