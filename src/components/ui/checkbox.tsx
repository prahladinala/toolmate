"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "accent" | "subtle";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: Size;
  variant?: Variant;
  className?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  size = "md",
  variant = "default",
  className,
}: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const variants: Record<Variant, string> = {
    default: "border border-[rgb(var(--border))] bg-[rgb(var(--card-2))]",
    accent:
      "border border-[rgba(var(--accent),0.5)] bg-[rgba(var(--accent),0.08)]",
    subtle: "border border-transparent bg-[rgba(var(--fg),0.06)]",
  };

  return (
    <label
      className={cn(
        "flex items-center gap-2 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          aria-checked={checked}
        />

        <div
          className={cn(
            "flex items-center justify-center rounded-[var(--radius)] transition-all duration-150",
            "focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[rgb(var(--ring))]",
            "peer-checked:border-[rgb(var(--accent))]",
            "peer-checked:bg-[rgba(var(--accent),0.15)]",
            variants[variant],
            sizeClasses[size],
          )}
        />

        {/* Checkmark */}
        <svg
          className={cn(
            "absolute opacity-0 peer-checked:opacity-100 transition duration-150",
            "text-[rgb(var(--accent))]",
            sizeClasses[size],
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>

        {/* Indeterminate line */}
        {indeterminate && (
          <div
            className={cn(
              "absolute h-[2px] bg-[rgb(var(--accent))]",
              size === "sm" && "w-3",
              size === "md" && "w-4",
              size === "lg" && "w-5",
            )}
          />
        )}
      </div>

      {label && <span className="text-sm text-[rgb(var(--fg))]">{label}</span>}
    </label>
  );
}
