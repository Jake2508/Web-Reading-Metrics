/*
 * Cover images come from Open Library, which serves S / M / L renditions of
 * each cover. Stored URLs all point at -L (≈290×475), which is redirected
 * through archive.org and takes 2s+ per image. -M (180×~290) is usually served
 * straight from covers.openlibrary.org with a long cache lifetime, and is sharp
 * enough for every cover in the UI up to ~90px wide on a 2x screen.
 */

const OPEN_LIBRARY = /^(https?:\/\/covers\.openlibrary\.org\/.+)-[SML](\.jpg)$/i;

/** Width of each Open Library rendition, for srcset. */
const WIDTHS = { M: 180, L: 475 } as const;

function rendition(url: string, size: keyof typeof WIDTHS): string | null {
  const match = url.match(OPEN_LIBRARY);
  return match ? `${match[1]}-${size}${match[2]}` : null;
}

/** The URL small covers load: the -M rendition when available, else the stored URL. */
export function coverSrc(url: string): string {
  return rendition(url, "M") ?? url;
}

/** srcset letting the browser pick -M or -L for the rendered size, or undefined for other hosts. */
export function coverSrcSet(url: string): string | undefined {
  const medium = rendition(url, "M");
  const large = rendition(url, "L");
  return medium && large ? `${medium} ${WIDTHS.M}w, ${large} ${WIDTHS.L}w` : undefined;
}

const warmed = new Set<string>();
const CONCURRENCY = 4;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Quietly warm the browser cache with covers the user hasn't seen yet: waits
 * for an idle moment, then fetches a few at a time so on-screen images keep
 * priority. Returns a cancel function.
 */
export function preloadCovers(urls: (string | null | undefined)[]): () => void {
  const queue = [...new Set(urls.filter((u): u is string => !!u).map(coverSrc))].filter((u) => !warmed.has(u));
  if (queue.length === 0) return () => {};

  let cancelled = false;
  const w = window as IdleWindow;

  const next = () => {
    if (cancelled) return;
    const url = queue.shift();
    if (!url) return;
    warmed.add(url);
    const img = new Image();
    img.decoding = "async";
    img.onload = img.onerror = next;
    img.src = url;
  };

  const start = () => {
    for (let i = 0; i < CONCURRENCY; i++) next();
  };

  const idleId = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 2000 }) : window.setTimeout(start, 300);

  return () => {
    cancelled = true;
    if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
    else window.clearTimeout(idleId);
  };
}
