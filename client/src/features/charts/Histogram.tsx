import { useState } from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { plural } from "../../lib/format";
import { ChartTooltip } from "./ChartTooltip";

export interface HistogramBin {
  /** Short axis label, e.g. "300s". */
  label: string;
  /** Full range for the tooltip, e.g. "300–399 pages". */
  range: string;
  count: number;
}

interface HistogramProps {
  bins: HistogramBin[];
  colour: "sage" | "brass";
  /** Books counted, for the tooltip share. */
  total: number;
  ariaLabel: string;
  height?: number;
}

/** Single-series column chart: one flat colour, value above each bar, labels below. */
export function Histogram({ bins, colour, total, ariaLabel, height = 200 }: HistogramProps) {
  const [active, setActive] = useState<number | null>(null);
  const fill = `var(--${colour})`;
  const summary = bins.map((b) => `${b.range}: ${b.count}`).join(", ");

  return (
    <div
      role="img"
      aria-label={`${ariaLabel}. ${summary}`}
      className="select-none tabular-nums"
      onMouseDown={(e) => e.preventDefault()}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={bins}
          margin={{ top: 24, right: 0, bottom: 0, left: 0 }}
          barCategoryGap="16%"
          accessibilityLayer={false}
          onMouseMove={(state) => {
            const i = state?.activeTooltipIndex;
            setActive(i == null ? null : Number(i));
          }}
          onMouseLeave={() => setActive(null)}
        >
          <XAxis
            dataKey="label"
            interval={0}
            tickLine={false}
            tickMargin={8}
            axisLine={{ stroke: "var(--axis)" }}
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }}
          />
          <YAxis hide allowDecimals={false} domain={[0, "dataMax"]} />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            wrapperStyle={{ outline: "none" }}
            content={({ active: shown, payload }) => {
              const bin = shown ? (payload?.[0]?.payload as HistogramBin | undefined) : undefined;
              return bin ? (
                <ChartTooltip
                  label={bin.range}
                  value={plural(bin.count, "book")}
                  detail={total > 0 ? `${Math.round((bin.count / total) * 100)}% of books` : undefined}
                />
              ) : null;
            }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {bins.map((b, i) => (
              <Cell
                key={b.label}
                fill={fill}
                fillOpacity={active === null || active === i ? 1 : 0.5}
                className="transition-[fill-opacity] duration-150 ease-out"
              />
            ))}
            <LabelList dataKey="count" position="top" offset={8} fill="var(--text)" fontSize={13} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
