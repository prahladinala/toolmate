"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "default" | "elevated" | "outline" | "ghost";
type Padding = "none" | "sm" | "md" | "lg";

export function Card({
  className,
  variant = "default",
  padding = "md",
  hover = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
}) {
  const base = "rounded-[var(--radius-lg)] transition-all duration-200";

  const variants: Record<Variant, string> = {
    default:
      "border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-[var(--shadow-sm)]",
    elevated:
      "border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-[var(--shadow-lg)]",
    outline: "border border-[rgb(var(--border))] bg-transparent",
    ghost: "bg-[rgb(var(--card-2))]",
  };

  const paddings: Record<Padding, string> = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        base,
        variants[variant],
        paddings[padding],
        hover && "hover:shadow-[var(--shadow-md)] hover:-translate-y-[1px]",
        className,
      )}
      {...props}
    />
  );
}
