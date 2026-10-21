import React from "react";
import { cn } from "@/lib/utils/cn";

interface ToolWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "default" | "wide" | "compact" | "full";
  children: React.ReactNode;
}

export function ToolWorkspace({
  maxWidth = "default",
  className,
  children,
  ...props
}: ToolWorkspaceProps) {
  const maxWidthClasses = {
    default: "max-w-6xl",
    wide: "max-w-7xl",
    compact: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full min-w-0 mx-auto space-y-6",
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
