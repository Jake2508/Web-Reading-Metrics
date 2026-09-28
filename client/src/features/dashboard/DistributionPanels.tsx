import type { ReactNode } from "react";
import type { Book } from "../../../../shared/src/schemas";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Skeleton } from "../../components/ui/Skeleton";
import { Histogram } from "../charts/Histogram";
import { plural } from "../../lib/format";
import { bookLengthDistribution, ratingDistribution } from "./distributions";

const CHART_HEIGHT = 200;

interface DistributionPanelsProps {
  books: Book[] | undefined;
  isLoading: boolean;
  error: Error | null;
  averageRating: number | null;
}

function Unavailable({ children }: { children: ReactNode }) {
  return <p className="flex h-[200px] items-center justify-center text-meta text-text-muted">{children}</p>;
}

/** Book length and rating spread — the two metrics built from per-book data. */
export function DistributionPanels({ books, isLoading, error, averageRating }: DistributionPanelsProps) {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-[270px]" />
        <Skeleton className="h-[270px]" />
      </>
    );
  }

  if (error || !books) {
    return (
      <Panel className="lg:col-span-2">
        <Unavailable>Couldn’t load the book list{error ? `: ${error.message}` : ""}</Unavailable>
      </Panel>
    );
  }

  const length = bookLengthDistribution(books);
  const rating = ratingDistribution(books);

  return (
    <>
      <Panel className="flex flex-col gap-[18px]" aria-labelledby="length-heading">
        <PanelHeader
          id="length-heading"
          title="Book length"
          context={
            <>
              {plural(length.counted, "book")}
              {length.missing > 0 && ` · ${length.missing} without a page count`}
            </>
          }
        />
        {length.counted > 0 ? (
          <Histogram
            bins={length.bins}
            colour="sage"
            total={length.counted}
            ariaLabel="Books by page count"
            height={CHART_HEIGHT}
          />
        ) : (
          <Unavailable>No page counts yet</Unavailable>
        )}
      </Panel>

      <Panel className="flex flex-col gap-[18px]" aria-labelledby="rating-heading">
        <PanelHeader
          id="rating-heading"
          title="Rating spread"
          context={
            <>
              {averageRating != null && (
                <>
                  avg <span className="font-bold text-brass">{averageRating.toFixed(1)}</span>
                </>
              )}
              {rating.missing > 0 && ` · ${rating.missing} unrated`}
            </>
          }
        />
        {rating.counted > 0 ? (
          <Histogram
            bins={rating.bins}
            colour="brass"
            total={rating.counted}
            ariaLabel="Books by rating"
            height={CHART_HEIGHT}
          />
        ) : (
          <Unavailable>No ratings yet</Unavailable>
        )}
      </Panel>
    </>
  );
}
