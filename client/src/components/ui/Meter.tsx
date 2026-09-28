interface MeterProps {
  /** 0–1 share of the track to fill. */
  value: number;
  fill?: "brass" | "sage";
  track?: "border" | "border-subtle";
  size?: 6 | 8;
  className?: string;
}

/** Flat horizontal bar: rounded ends, no outline. */
export function Meter({ value, fill = "sage", track = "border-subtle", size = 6, className = "" }: MeterProps) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`;
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-full ${size === 8 ? "h-2" : "h-1.5"} ${
        track === "border" ? "bg-border" : "bg-border-subtle"
      } ${className}`}
    >
      <div
        className={`h-full rounded-full ${fill === "brass" ? "bg-brass" : "bg-sage"}`}
        style={{ width }}
      />
    </div>
  );
}
