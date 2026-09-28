import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "section" | "div";
  /** Drop the default padding, e.g. for tables whose rows carry their own. */
  flush?: boolean;
}

export function Panel({ children, className = "", as: Tag = "section", flush = false, ...rest }: PanelProps) {
  return (
    <Tag
      className={`rounded-lg border border-border bg-surface ${flush ? "" : "px-6 py-[22px]"} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

interface PanelHeaderProps {
  title: string;
  id?: string;
  context?: ReactNode;
}

/** Literata title on the left, muted context on the right, baseline-aligned. */
export function PanelHeader({ title, id, context }: PanelHeaderProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 id={id} className="font-serif text-panel font-semibold text-text">
        {title}
      </h2>
      {context && <p className="text-meta text-text-muted tabular-nums">{context}</p>}
    </div>
  );
}
