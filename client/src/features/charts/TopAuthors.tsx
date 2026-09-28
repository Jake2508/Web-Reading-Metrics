import { useState } from "react";
import { Link } from "react-router-dom";
import type { AuthorBreakdownItem } from "../../../../shared/src/schemas";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Meter } from "../../components/ui/Meter";
import { plural } from "../../lib/format";

const SHOWN_AUTHORS = 6;

/** Ranked bars: #1 in brass, the rest in sage. Counts are always visible, so no tooltip. */
export function TopAuthors({ data }: { data: AuthorBreakdownItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const top = data.slice(0, SHOWN_AUTHORS);
  const max = top[0]?.count ?? 1;

  return (
    <Panel className="flex flex-col gap-[18px]" aria-labelledby="top-authors-heading">
      <PanelHeader id="top-authors-heading" title="Top authors" context="by books read" />
      <ol className="flex flex-col" onMouseLeave={() => setActive(null)}>
        {top.map((a, i) => (
          <li key={a.author} className="-mx-2" onMouseEnter={() => setActive(i)}>
            <Link
              to={`/books?author=${encodeURIComponent(a.author)}`}
              aria-label={`${i + 1}. ${a.author}: ${plural(a.count, "book")}. Show in library`}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[1.75rem_minmax(0,10rem)_minmax(3rem,1fr)_2rem] items-center gap-3 rounded-md px-2 py-[7px] transition-colors duration-150 ease-out hover:bg-surface-hover"
            >
              <span className="text-meta font-bold text-text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate text-body font-medium text-text transition-colors duration-150 ease-out group-hover:text-brass">
                {a.author}
              </span>
              <Meter
                value={a.count / max}
                fill={i === 0 ? "brass" : "sage"}
                size={8}
                className={`transition-opacity duration-150 ease-out ${active === null || active === i ? "opacity-100" : "opacity-50"}`}
              />
              <span className="text-right text-meta font-bold text-text tabular-nums">{a.count}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
