"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-[rgb(var(--bg))] disabled:opacity-50 disabled:pointer-events-none " +
    "active:scale-[0.97]";

  const variants: Record<Variant, string> = {
    primary:
      "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))] hover:bg-[rgb(var(--accent-2))] shadow-[var(--shadow-sm)]",
    secondary:
      "bg-[rgb(var(--card-2))] text-[rgb(var(--fg))] border border-[rgb(var(--border))] hover:border-[rgba(var(--accent),0.5)] hover:bg-[rgba(var(--accent),0.08)]",
    ghost:
      "bg-transparent text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.06)]",
    destructive:
      "bg-[rgb(var(--danger))] text-white hover:opacity-90 shadow-[var(--shadow-sm)]",
  };

  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-sm rounded-[var(--radius-sm)]",
    md: "h-10 px-4 text-sm rounded-[var(--radius)]",
    lg: "h-12 px-5 text-base rounded-[var(--radius-lg)]",
  };

  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
