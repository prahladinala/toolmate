"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Variant =
  | "default"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

type Size = "sm" | "md";

export function Badge({
  className,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  size?: Size;
  removable?: boolean;
  onRemove?: () => void;
}) {
  const base =
    "inline-flex items-center gap-1 font-medium transition select-none";

  const variants: Record<Variant, string> = {
    default:
      "border border-[rgb(var(--border))] bg-[rgba(var(--fg),0.04)] text-[rgb(var(--fg))]",
    secondary:
      "border border-[rgb(var(--border))] bg-[rgba(var(--card-2))] text-[rgb(var(--fg))]",
    accent:
      "border border-[rgba(var(--accent),0.4)] bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]",
    success: "border border-green-500/40 bg-green-500/10 text-green-600",
    warning: "border border-yellow-500/40 bg-yellow-500/10 text-yellow-600",
    destructive:
      "border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.15)] text-[rgb(var(--danger))]",
    outline:
      "border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--fg))]",
  };

  const sizes: Record<Size, string> = {
    sm: "text-xs px-2 py-0.5 rounded-[var(--radius-sm)]",
    md: "text-xs px-2.5 py-1 rounded-[var(--radius)]",
  };

  return (
    <span
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}

      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 text-xs opacity-70 hover:opacity-100 focus:outline-none"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </span>
  );
}
