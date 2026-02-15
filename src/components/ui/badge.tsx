import React from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 text-xs " +
          "rounded-full border-[rgb(var(--border))] bg-[rgba(var(--fg),0.04)] text-[rgb(var(--fg))] opacity-90",
        className,
      )}
      {...props}
    />
  );
}
