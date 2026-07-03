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
import type { AuthorBreakdownItem } from "../../../../shared/src/schemas";

interface AuthorBarChartProps {
  data: AuthorBreakdownItem[];
  height?: number;
}

const COLORS = ["#FF5252", "#FFEB3B", "#2196F3", "#4CAF50", "#FF9800", "#9C27B0"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-2 border-black bg-white p-3" style={{ boxShadow: "3px 3px 0 #000" }}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="text-sm font-bold">{payload[0].value} {payload[0].value === 1 ? "book" : "books"}</p>
    </div>
  );
}

function shortName(name: string) {
  const parts = name.split(" ");
  if (parts.length <= 1) return name;
  return parts[0][0] + ". " + parts[parts.length - 1];
}

export function AuthorBarChart({ data, height = 220 }: AuthorBarChartProps) {
  const top = data.slice(0, 6).map((d) => ({ ...d, shortName: shortName(d.author) }));
  return (
    <div
      className="border-3 border-black bg-white p-5 select-none"
      style={{ borderWidth: "3px", boxShadow: "4px 4px 0 #000" }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <h3 className="text-base font-black text-black mb-3 uppercase tracking-wide">Top Authors</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={top} layout="vertical" margin={{ top: 4, right: 16, left: 20, bottom: 0 }} accessibilityLayer={false}>
          <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={1} opacity={0.1} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontWeight: 700, fontSize: 11, fill: "#000" }}
            tickLine={{ stroke: "#000" }}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            tick={{ fontWeight: 700, fontSize: 11, fill: "#000" }}
            tickLine={false}
            axisLine={{ stroke: "#000", strokeWidth: 2 }}
            width={64}
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
