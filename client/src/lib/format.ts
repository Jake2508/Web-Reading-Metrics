/** 33309 → "33,309" */
export function formatInt(n: number): string {
  return Math.round(n).toLocaleString("en-GB");
}

/** Compact large totals for tight spaces: 9159975 → "9.2M", 33309 → "33.3K". */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${formatInt(count)} ${count === 1 ? one : many}`;
}
