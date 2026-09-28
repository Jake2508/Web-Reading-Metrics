import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  tone?: "muted" | "brass";
  className?: string;
}

export function Eyebrow({ children, tone = "muted", className = "" }: EyebrowProps) {
  return (
    <span
      className={`block text-eyebrow font-bold uppercase tracking-eyebrow ${
        tone === "brass" ? "text-brass" : "text-text-muted"
      } ${className}`}
    >
      {children}
    </span>
  );
}
