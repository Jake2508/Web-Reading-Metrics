import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { formatInt, plural } from "../../lib/format";

interface QuickInsightsProps {
  stats: Stats;
  /** Books with a rating, once the book list has loaded. */
  ratedCount?: number;
}

interface Insight {
  label: string;
  value: string;
  sub: string;
  to?: string;
}

// Cells grow to fill each row, so any count of insights wraps without gaps.
const cellClass = "flex min-w-0 grow basis-[calc(50%-1px)] bg-surface sm:basis-[calc(33.333%-1px)] lg:basis-0";
const innerClass = "flex min-w-0 flex-1 flex-col gap-1 px-5 py-[18px]";

export function QuickInsights({ stats, ratedCount }: QuickInsightsProps) {
  const authorCount = stats.authorBreakdown.length;
  const insights: Insight[] = [];

  if (stats.averagePages) {
    insights.push({ label: "Avg pages", value: formatInt(stats.averagePages), sub: "per book" });
  }
  if (stats.longestBook) {
    insights.push({
      label: "Longest book",
      value: formatInt(stats.longestBook.pages),
      sub: stats.longestBook.title,
      to: "/books?filter=size:largest",
    });
  }
  if (stats.shortestBook) {
    insights.push({
      label: "Shortest book",
      value: formatInt(stats.shortestBook.pages),
      sub: stats.shortestBook.title,
      to: "/books?filter=size:smallest",
    });
  }
  if (stats.averageRating != null) {
    insights.push({
      label: "Avg rating",
      value: stats.averageRating.toFixed(1),
      sub: ratedCount != null ? `from ${plural(ratedCount, "rated book")}` : "out of 5",
    });
  }
  insights.push({
    label: "Genres",
    value: formatInt(stats.genresExplored),
    sub: `diversity score ${stats.diversityScore}/100`,
  });
  if (authorCount > 0) {
    insights.push({
      label: "Authors",
      value: formatInt(authorCount),
      sub: `≈ ${(stats.totalBooks / authorCount).toFixed(1)} books each`,
    });
  }

  return (
    <section aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="sr-only">
        Quick insights
      </h2>
      {/* 1px gaps over a --border background draw the dividers between cells. */}
      <ul className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-border bg-border">
        {insights.map((insight) => {
          const content = (
            <>
              <Eyebrow>{insight.label}</Eyebrow>
              <span className="font-serif text-metric text-text tabular-nums">{insight.value}</span>
              <span className="truncate text-meta text-text-muted" title={insight.sub}>
                {insight.sub}
              </span>
            </>
          );
          return insight.to ? (
            <li key={insight.label} className={cellClass}>
              <Link
                to={insight.to}
                className={`${innerClass} transition-colors duration-150 ease-out hover:bg-surface-hover focus-visible:-outline-offset-2`}
              >
                {content}
              </Link>
            </li>
          ) : (
            <li key={insight.label} className={cellClass}>
              <div className={innerClass}>{content}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
