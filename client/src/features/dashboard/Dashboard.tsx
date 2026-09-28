import type { ReactNode } from "react";
import { useStats } from "./hooks/useStats";
import { useBooks } from "../books/hooks/useBooks";
import { HeadlineTotals } from "./HeadlineTotals";
import { FeaturedAuthor } from "./FeaturedAuthor";
import { FeaturedBook } from "./FeaturedBook";
import { DistributionPanels } from "./DistributionPanels";
import { QuickInsights } from "./QuickInsights";
import { GenreDonut } from "../charts/GenreDonut";
import { TopAuthors } from "../charts/TopAuthors";
import { Panel } from "../../components/ui/Panel";
import { Skeleton } from "../../components/ui/Skeleton";
import { plural } from "../../lib/format";

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === "true";

const row = "grid gap-4 lg:grid-cols-2";

function Message({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel className="mx-auto mt-16 max-w-md text-center">
      <h1 className="font-serif text-title text-text">{title}</h1>
      <p className="mt-2 text-body text-text-muted">{children}</p>
    </Panel>
  );
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useStats();
  const books = useBooks();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <Skeleton className="mb-2 h-10 w-48 border-0" />
        <div className={row}>
          <Skeleton className="h-[240px]" />
          <Skeleton className="h-[240px]" />
        </div>
        <div className={row}>
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
        <Skeleton className="h-[104px]" />
      </div>
    );
  }

  if (error) {
    return <Message title="Couldn’t load the dashboard">{error.message}</Message>;
  }

  if (!stats || stats.totalBooks === 0) {
    return (
      <Message title="No books yet">
        {IS_STATIC
          ? "Nothing has been added to this library yet."
          : "Head to Admin to add your first book and start tracking your reading."}
      </Message>
    );
  }

  const ratedCount = books.data?.filter((b) => b.rating != null).length;

  return (
    <div className="flex flex-col gap-4">
      <header className="mb-2 flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="font-serif text-title text-text">Overview</h1>
          <p className="text-body text-text-muted tabular-nums">
            {plural(stats.totalBooks, "book")} · {plural(stats.authorBreakdown.length, "author")} ·{" "}
            {plural(stats.genresExplored, "genre")}
          </p>
        </div>
        {/* Under 800px the sidebar becomes a top bar, so the totals move here. */}
        <div className="border-y border-border-subtle py-4 md:hidden">
          <HeadlineTotals stats={stats} layout="row" />
        </div>
      </header>

      <div className={row}>
        <FeaturedAuthor stats={stats} />
        <FeaturedBook stats={stats} />
      </div>

      <div className={row}>
        <GenreDonut data={stats.genreBreakdown} totalBooks={stats.totalBooks} />
        <TopAuthors data={stats.authorBreakdown} />
      </div>

      <div className={row}>
        <DistributionPanels
          books={books.data}
          isLoading={books.isLoading}
          error={books.error}
          averageRating={stats.averageRating}
        />
      </div>

      <QuickInsights stats={stats} ratedCount={ratedCount} />
    </div>
  );
}
