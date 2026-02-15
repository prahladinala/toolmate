"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "error" | "success";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: Size;
  variant?: Variant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
};

export function Input({
  className,
  size = "md",
  variant = "default",
  startIcon,
  endIcon,
  loading = false,
  disabled,
  ...props
}: InputProps) {
  const sizeClasses: Record<Size, string> = {
    sm: "h-8 text-sm px-2",
    md: "h-10 text-sm px-3",
    lg: "h-12 text-base px-4",
  };

  const variantClasses: Record<Variant, string> = {
    default:
      "border-[rgb(var(--border))] focus-visible:ring-[rgb(var(--ring))]",
    error:
      "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
    success: "border-green-500 focus-visible:ring-green-500",
  };

  return (
    <div className="relative w-full">
      {startIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]">
          {startIcon}
        </div>
      )}

      <input
        disabled={disabled || loading}
        className={cn(
          "w-full rounded-[var(--radius)] border bg-[rgb(var(--card))] text-[rgb(var(--fg))]",
          "placeholder:opacity-50 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizeClasses[size],
          variantClasses[variant],
          startIcon && "pl-9",
          endIcon && "pr-9",
          className,
        )}
        {...props}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-[rgb(var(--accent))]" />
      )}

      {!loading && endIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]">
          {endIcon}
        </div>
      )}
    </div>
  );
}
