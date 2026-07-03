import type { Stats } from "../../../../shared/src/schemas";
import { MetricCard } from "../../components/ui/MetricCard";

interface HeroStatsProps {
  stats: Stats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <MetricCard
        label="Books Read"
        value={stats.totalBooks}
        subtitle="in your library"
        color="yellow"
        size="sm"
        to="/books"
      />
      <MetricCard
        label="Pages Read"
        value={formatNumber(stats.totalPages)}
        subtitle="total pages"
        color="white"
        size="sm"
      />
      <MetricCard
        label="Words Read"
        value={formatNumber(stats.estimatedWords)}
        subtitle="estimated"
        color="blue"
        size="sm"
      />
      <MetricCard
        label="Top Author"
        value={stats.topAuthor?.name.split(" ").pop() ?? "—"}
        subtitle={stats.topAuthor ? `${stats.topAuthor.bookCount} books · ${stats.topAuthor.percentage}%` : "No data"}
        color="red"
        size="sm"
        to={stats.topAuthor ? `/books?author=${encodeURIComponent(stats.topAuthor.name)}` : undefined}
      />
      <MetricCard
        label="Top Genre"
        value={stats.topGenre?.name ?? "—"}
        subtitle={stats.topGenre ? `${stats.topGenre.bookCount} books` : "No data"}
        color="white"
        size="sm"
        to={stats.topGenre ? `/books?filter=${encodeURIComponent(`genre:${stats.topGenre.name}`)}` : undefined}
      />
    </div>
  );
}
