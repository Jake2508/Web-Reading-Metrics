interface ChartTooltipProps {
  label: string;
  value: string;
  detail?: string;
}

/** Hover tooltip shared by every chart: surface-2, 1px border, radius 6. */
export function ChartTooltip({ label, value, detail }: ChartTooltipProps) {
  return (
    <div className="rounded-md border border-border bg-surface-2 px-3 py-2 tabular-nums">
      <p className="text-label font-medium text-text-muted">{label}</p>
      <p className="text-meta font-bold text-text">{value}</p>
      {detail && <p className="text-label text-text-muted">{detail}</p>}
    </div>
  );
}
