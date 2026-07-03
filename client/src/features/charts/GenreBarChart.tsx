import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { GenreBreakdownItem } from "../../../../shared/src/schemas";

interface GenreBarChartProps {
  data: GenreBreakdownItem[];
  height?: number;
}

const COLORS = ["#FFEB3B", "#FF5252", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-black bg-white p-3 shadow-brutal-sm" style={{ boxShadow: "3px 3px 0 #000" }}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="text-sm font-bold">{payload[0].value} books</p>
      {payload[1] && <p className="text-xs font-semibold text-black/60">{payload[1].value.toLocaleString()} pages</p>}
    </div>
  );
}

export function GenreBarChart({ data, height = 260 }: GenreBarChartProps) {
  const top = data.slice(0, 7);
  return (
    <div
      className="border-3 border-black bg-white p-5 select-none"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <h3 className="text-base font-black text-black mb-3 uppercase tracking-wide">Genre Distribution</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={top} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} accessibilityLayer={false}>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={1} opacity={0.1} />
          <XAxis
            dataKey="genre"
            tick={{ fontWeight: 700, fontSize: 10, fill: "#000" }}
            tickLine={{ stroke: "#000" }}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
            angle={-35}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            tick={{ fontWeight: 700, fontSize: 11, fill: "#000" }}
            tickLine={{ stroke: "#000" }}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="count" stroke="#000" strokeWidth={2} radius={0}>
            {top.map((_entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
