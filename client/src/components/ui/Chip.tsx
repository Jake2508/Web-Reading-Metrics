import type { ReactNode } from "react";

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block max-w-full truncate rounded-full bg-border px-2.5 py-[3px] text-label font-medium text-text-muted ${className}`}
    >
      {children}
    </span>
  );
}
