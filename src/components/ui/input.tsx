import React from "react";
import { cn } from "@/lib/utils/cn";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-10 px-3 text-sm " +
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
