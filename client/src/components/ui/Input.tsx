import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { fieldClass, labelClass } from "./fieldStyles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
          className={`${fieldClass} ${error ? "border-brass" : ""} ${className}`}
        />
        {error && (
          <span id={errorId} className="text-label font-bold text-brass">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
