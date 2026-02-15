import React from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border bg-[rgb(var(--card))] border-[rgb(var(--border))] " +
          "rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    />
  );
}
