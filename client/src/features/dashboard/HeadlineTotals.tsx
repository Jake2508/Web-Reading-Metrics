import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { formatCompact, formatInt } from "../../lib/format";

interface HeadlineTotalsProps {
  stats: Stats;
  /** "stack" for the sidebar, "row" for the Overview header on narrow screens. */
  layout: "stack" | "row";
}

export function HeadlineTotals({ stats, layout }: HeadlineTotalsProps) {
  const wordsPerPage = stats.totalPages > 0 ? Math.round(stats.estimatedWords / stats.totalPages) : 0;
  const totals = [
    { label: "Books read", value: formatInt(stats.totalBooks), sub: "in your library", to: "/books" },
    { label: "Pages read", value: formatInt(stats.totalPages), sub: "pages turned" },
    {
      label: "Words read",
      value: formatCompact(stats.estimatedWords),
      sub: wordsPerPage ? `est. at ${wordsPerPage} words a page` : "estimated",
    },
  ];

  const valueClass =
    layout === "stack" ? "font-serif text-total text-text" : "font-serif text-metric text-text sm:text-title";

  return (
    <dl className={layout === "stack" ? "flex flex-col gap-7" : "grid grid-cols-3 gap-4"}>
      {totals.map((t) => (
        <div key={t.label} className="flex min-w-0 flex-col gap-1">
          <dt>
            <Eyebrow>{t.label}</Eyebrow>
          </dt>
          <dd className={`${valueClass} tabular-nums`}>
            {t.to ? (
              <Link to={t.to} className="rounded-sm transition-colors duration-150 ease-out hover:text-brass">
                {t.value}
              </Link>
            ) : (
              t.value
            )}
          </dd>
          <dd className="truncate text-meta text-text-muted">{t.sub}</dd>
        </div>
      ))}
    </dl>
  );
}
