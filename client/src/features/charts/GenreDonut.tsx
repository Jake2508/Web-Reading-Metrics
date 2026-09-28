import { useState } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import type { GenreBreakdownItem } from "../../../../shared/src/schemas";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { formatInt, plural } from "../../lib/format";
import { ChartTooltip } from "./ChartTooltip";
import { assignGenreColours, OTHER_GENRES_COLOUR } from "./palette";

const SHOWN_GENRES = 7;
const SIZE = 180;
const HOLE = 116;

interface Slice {
  key: string;
  label: string;
  count: number;
  percentage: number;
  colour: string;
  genre?: string;
}

interface GenreDonutProps {
  data: GenreBreakdownItem[];
  totalBooks: number;
}

function buildSlices(data: GenreBreakdownItem[], totalBooks: number): Slice[] {
  const top = data.slice(0, SHOWN_GENRES);
  const rest = data.slice(SHOWN_GENRES);
  const colours = assignGenreColours(top.map((g) => g.genre));
  const slices: Slice[] = top.map((g) => ({
    key: g.genre,
    label: g.genre,
    genre: g.genre,
    count: g.count,
    percentage: g.percentage,
    colour: colours.get(g.genre)!,
  }));
  if (rest.length > 0) {
    const count = rest.reduce((sum, g) => sum + g.count, 0);
    slices.push({
      key: "other",
      label: `${rest.length} other ${rest.length === 1 ? "genre" : "genres"}`,
      count,
      percentage: Math.round((count / totalBooks) * 100),
      colour: OTHER_GENRES_COLOUR,
    });
  }
  return slices;
}

export function GenreDonut({ data, totalBooks }: GenreDonutProps) {
  const [active, setActive] = useState<number | null>(null);
  const slices = buildSlices(data, totalBooks);
  const dim = (i: number) => (active === null || active === i ? 1 : 0.5);
  const summary = slices.map((s) => `${s.label} ${s.count} (${s.percentage}%)`).join(", ");

  return (
    <Panel className="flex flex-col gap-[18px]" aria-labelledby="genre-heading">
      <PanelHeader id="genre-heading" title="Genre distribution" context={plural(data.length, "genre")} />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div
          role="img"
          aria-label={`Books by genre: ${summary}`}
          className="relative shrink-0 select-none"
          onMouseDown={(e) => e.preventDefault()}
        >
          <PieChart width={SIZE} height={SIZE} accessibilityLayer={false} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="label"
              innerRadius={HOLE / 2}
              outerRadius={SIZE / 2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
              rootTabIndex={-1}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {slices.map((s, i) => (
                <Cell
                  key={s.key}
                  fill={s.colour}
                  fillOpacity={dim(i)}
                  className="transition-[fill-opacity] duration-150 ease-out"
                />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              isAnimationActive={false}
              wrapperStyle={{ outline: "none", zIndex: 10 }}
              content={({ active: shown, payload }) => {
                const slice = shown ? (payload?.[0]?.payload as Slice | undefined) : undefined;
                return slice ? (
                  <ChartTooltip label={slice.label} value={plural(slice.count, "book")} detail={`${slice.percentage}% of library`} />
                ) : null;
              }}
            />
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-title text-text tabular-nums">{formatInt(totalBooks)}</span>
            <Eyebrow>books</Eyebrow>
          </div>
        </div>

        <ul className="flex w-full min-w-0 flex-1 flex-col" onMouseLeave={() => setActive(null)}>
          {slices.map((s, i) => {
            const row = (
              <>
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-[2px] transition-opacity duration-150 ease-out"
                  style={{ backgroundColor: s.colour, opacity: dim(i) }}
                />
                <span className="truncate text-body text-text transition-colors duration-150 ease-out group-hover:text-brass">
                  {s.label}
                </span>
                <span className="text-meta font-bold text-text tabular-nums">{s.count}</span>
                <span className="text-right text-meta text-text-muted tabular-nums">{s.percentage}%</span>
              </>
            );
            const rowClass =
              "grid grid-cols-[10px_minmax(0,1fr)_auto_2.75rem] items-center gap-3 rounded-md px-2 py-[5px] transition-colors duration-150 ease-out";
            return (
              <li key={s.key} className="-mx-2" onMouseEnter={() => setActive(i)}>
                {s.genre ? (
                  <Link
                    to={`/books?filter=${encodeURIComponent(`genre:${s.genre}`)}`}
                    aria-label={`${s.label}: ${plural(s.count, "book")}, ${s.percentage}%. Show in library`}
                    className={`group ${rowClass} hover:bg-surface-hover`}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                  >
                    {row}
                  </Link>
                ) : (
                  <div className={rowClass}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}
