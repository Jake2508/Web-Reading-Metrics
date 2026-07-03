import { Link } from "react-router-dom";
import type { Stats } from "../../../../shared/src/schemas";

interface InsightCardsProps {
  stats: Stats;
}

interface InsightItemProps {
  label: string;
  value: string;
  sub?: string;
  accent?: "yellow" | "red" | "blue";
  to?: string;
}

function InsightItem({ label, value, sub, accent, to }: InsightItemProps) {
  const accentBg = accent === "yellow" ? "bg-[#FFEB3B]" : accent === "red" ? "bg-[#FF5252]" : accent === "blue" ? "bg-[#2196F3]" : "bg-white";
  const textColor = (accent === "red" || accent === "blue") ? "text-white" : "text-black";
  const isDark = accent === "red" || accent === "blue";

  const className = `border-3 border-black p-4 flex flex-col gap-1 ${accentBg} ${
    to ? "hover:-translate-y-0.5 transition-transform cursor-pointer" : ""
  }`;
  const style = { borderWidth: "3px", boxShadow: "3px 3px 0 #000" };

  const content = (
    <>
      <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/60" : "text-black/50"}`}>
        {label}
      </span>
      <span className={`text-2xl font-black leading-none ${textColor}`}>{value}</span>
      {sub && (
        <span className={`text-xs font-semibold ${isDark ? "text-white/70" : "text-black/60"}`}>
          {sub}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

export function InsightCards({ stats }: InsightCardsProps) {
  const insights: InsightItemProps[] = [];

  if (stats.averagePages) {
    insights.push({
      label: "Avg Pages",
      value: stats.averagePages.toLocaleString(),
      sub: "per book",
    });
  }

  if (stats.longestBook) {
    insights.push({
      label: "Longest Book",
      value: stats.longestBook.pages.toLocaleString(),
      sub: stats.longestBook.title.length > 20 ? stats.longestBook.title.slice(0, 20) + "…" : stats.longestBook.title,
      accent: "red",
      to: "/books?filter=size:largest",
    });
  }

  if (stats.shortestBook) {
    insights.push({
      label: "Shortest Book",
      value: stats.shortestBook.pages.toLocaleString(),
      sub: stats.shortestBook.title.length > 20 ? stats.shortestBook.title.slice(0, 20) + "…" : stats.shortestBook.title,
    });
  }

  if (stats.averageRating) {
    insights.push({
      label: "Avg Rating",
      value: `${stats.averageRating}/5`,
      sub: `${stats.totalBooks} rated books`,
      accent: "yellow",
    });
  }

  insights.push({
    label: "Genres",
    value: stats.genresExplored.toString(),
    sub: "unique genres",
    accent: "blue",
  });

  if (stats.authorBreakdown.length > 0) {
    insights.push({
      label: "Authors",
      value: stats.authorBreakdown.length.toString(),
      sub: "unique authors",
    });
  }

  return (
    <div>
      <h2 className="text-sm font-black text-black uppercase tracking-widest mb-3">Quick Insights</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {insights.map((insight) => (
          <InsightItem key={insight.label} {...insight} />
        ))}
      </div>
    </div>
  );
}
