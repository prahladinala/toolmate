import React from "react";
import { cn } from "@/lib/utils/cn";

interface ToolToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ToolToolbar({ className, children, ...props }: ToolToolbarProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 p-3 sm:p-4 rounded-2xl border border-[rgb(var(--border))]",
        "bg-[rgb(var(--card))] shadow-sm flex flex-wrap items-center justify-between gap-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
