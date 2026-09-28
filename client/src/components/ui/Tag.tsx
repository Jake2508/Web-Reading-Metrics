import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-[3px] bg-brass px-1.5 py-0.5 text-[10px] leading-none font-bold uppercase tracking-eyebrow text-on-brass">
      {children}
    </span>
  );
}
