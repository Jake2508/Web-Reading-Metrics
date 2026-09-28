import type { ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

/** Native select (keeps keyboard and screen-reader behaviour) with a Forest Night skin. */
export function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className="w-full cursor-pointer appearance-none rounded-md border border-border bg-surface py-3 pr-10 pl-4 text-body text-text transition-colors duration-150 ease-out hover:bg-surface-2 focus:border-brass"
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-text-muted"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
