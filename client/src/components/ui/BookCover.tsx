import { useState } from "react";
import { coverSrc, coverSrcSet } from "../../lib/covers";

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  /** Sizing only, e.g. "w-11". Height follows the 2:3 aspect ratio. */
  className?: string;
  /** Rendered width for srcset, e.g. "112px". Small covers keep the default. */
  sizes?: string;
  /** Small covers show the title's first letter in the fallback instead of the full title. */
  compact?: boolean;
  /** Above-the-fold cover: load eagerly at high fetch priority. */
  priority?: boolean;
}

export function BookCover({
  coverUrl,
  title,
  className = "",
  sizes = "48px",
  compact = false,
  priority = false,
}: BookCoverProps) {
  // Keyed by URL so a new coverUrl (e.g. while editing in Admin) gets a fresh attempt.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const showImage = !!coverUrl && failedUrl !== coverUrl;

  return (
    // A span (display: block) so covers can sit inside buttons and other phrasing content.
    <span
      className={`relative block aspect-[2/3] shrink-0 rounded-cover bg-surface-2 shadow-cover after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:inset-shadow-spine ${className}`}
    >
      {/* The titled fallback doubles as the placeholder while the image loads. */}
      {compact ? (
        <span aria-hidden="true" className="flex size-full items-center justify-center font-serif text-panel text-text-muted">
          {title.trim().charAt(0).toUpperCase() || "?"}
        </span>
      ) : (
        <span
          aria-hidden={showImage || undefined}
          className="flex size-full items-center justify-center overflow-hidden p-2 pl-3 text-center font-serif text-meta font-semibold text-text-muted"
        >
          <span className="line-clamp-5">{title}</span>
        </span>
      )}
      {showImage && (
        <img
          src={coverSrc(coverUrl)}
          srcSet={coverSrcSet(coverUrl)}
          sizes={sizes}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoadedUrl(coverUrl)}
          onError={() => setFailedUrl(coverUrl)}
          className={`absolute inset-0 block size-full rounded-[inherit] object-cover transition-opacity duration-200 ease-out ${
            loadedUrl === coverUrl ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </span>
  );
}
