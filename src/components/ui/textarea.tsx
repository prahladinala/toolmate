import React from "react";
import { cn } from "@/lib/utils/cn";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 text-sm min-h-32 " +
          "rounded-[var(--radius)] border border-[rgb(var(--border))] " +
          "bg-[rgb(var(--card))] text-[rgb(var(--fg))] " +
          "placeholder:opacity-50 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 " +
          "focus-visible:ring-offset-[rgb(var(--bg))]",
        className,
      )}
      {...props}
    />
  );
}
