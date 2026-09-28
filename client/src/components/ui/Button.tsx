import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}

const variants = {
  primary: "bg-brass text-on-brass hover:opacity-90",
  secondary: "border border-border bg-surface text-text hover:bg-surface-2",
  // One accent only, so destructive actions read through brass text and their label.
  danger: "border border-brass text-brass hover:bg-surface-2",
  ghost: "text-text-muted hover:bg-surface-2 hover:text-text",
};

const sizes = {
  sm: "px-3 py-1.5 text-meta",
  md: "px-4 py-2.5 text-body",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`cursor-pointer rounded-md font-bold transition-[color,background-color,border-color,opacity] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
