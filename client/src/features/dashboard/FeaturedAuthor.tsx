import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { Panel } from "../../components/ui/Panel";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Meter } from "../../components/ui/Meter";
import { formatInt } from "../../lib/format";
import { useReducedMotion } from "../../lib/useReducedMotion";

interface FeaturedAuthorProps {
  stats: Stats;
}

const AUTO_ADVANCE_MS = 4000;

function Chevron({ direction }: { direction: "left" | "right" }) {
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
    >
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

const pagerButton =
  "flex size-7 cursor-pointer items-center justify-center rounded-md text-text-muted transition-colors duration-150 ease-out hover:text-brass";

export function FeaturedAuthor({ stats }: FeaturedAuthorProps) {
  const authors = stats.authorBreakdown.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  // Auto-advance pauses while the panel is hovered or focused, and is off under reduced motion.
  const paused = hovered || focused || reducedMotion;

  useEffect(() => {
    if (paused || authors.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % authors.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, authors.length]);

  if (authors.length === 0) return null;

  const author = authors[index];
  const percentage = Math.round((author.count / stats.totalBooks) * 100);
  const avgPages = Math.round(author.pages / author.count);
  const goTo = (i: number) => setIndex(((i % authors.length) + authors.length) % authors.length);
  const libraryLink = `/books?author=${encodeURIComponent(author.author)}`;

  return (
    <Panel
      className="flex flex-col justify-between gap-[18px]"
      aria-labelledby="top-author-heading"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="top-author-heading">
          <Eyebrow tone="brass">Top author · No. {index + 1}</Eyebrow>
        </h2>
        {authors.length > 1 && (
          <div className="-my-1 -mr-1.5 flex items-center gap-1 text-meta text-text-muted tabular-nums">
            <button type="button" aria-label="Previous author" onClick={() => goTo(index - 1)} className={pagerButton}>
              <Chevron direction="left" />
            </button>
            <span>
              {index + 1} / {authors.length}
            </span>
            <button type="button" aria-label="Next author" onClick={() => goTo(index + 1)} className={pagerButton}>
              <Chevron direction="right" />
            </button>
          </div>
        )}
      </div>

      <div key={author.author} className="flex animate-fade-in flex-col gap-[18px]" aria-live={paused ? "polite" : "off"}>
        <Link
          to={libraryLink}
          className="self-start rounded-sm font-serif text-display text-text transition-colors duration-150 ease-out hover:text-brass"
        >
          {author.author}
        </Link>

        <dl className="grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div className="flex flex-col gap-1">
            <dt>
              <Eyebrow>Books</Eyebrow>
            </dt>
            <dd className="font-serif text-metric text-text tabular-nums">
              <Link to={libraryLink} className="rounded-sm transition-colors duration-150 ease-out hover:text-brass">
                {author.count}
              </Link>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt>
              <Eyebrow>Of library</Eyebrow>
            </dt>
            <dd className="font-serif text-metric text-text tabular-nums">{percentage}%</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt>
              <Eyebrow>Avg pages</Eyebrow>
            </dt>
            <dd className="font-serif text-metric text-text tabular-nums">{formatInt(avgPages)}</dd>
          </div>
        </dl>

        <Meter value={percentage / 100} fill="brass" track="border" size={6} />
      </div>
    </Panel>
  );
}
