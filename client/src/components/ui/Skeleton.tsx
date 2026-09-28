/** Placeholder block while data loads. Breathes gently; static under reduced motion. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-breathe rounded-lg border border-border bg-surface ${className}`} />;
}
