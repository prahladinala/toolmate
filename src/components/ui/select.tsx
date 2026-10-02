"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "error" | "success";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  size?: Size;
  variant?: Variant;
};

export function Select({
  className,
  size = "md",
  variant = "default",
  children,
  disabled,
  ...props
}: SelectProps) {
  const sizeClasses: Record<Size, string> = {
    sm: "h-9 text-xs px-3 pr-8 rounded-lg",
    md: "h-10 text-sm px-3.5 pr-9 rounded-xl",
    lg: "h-12 text-base px-4 pr-10 rounded-xl",
  };

  const variantClasses: Record<Variant, string> = {
    default:
      "border-[rgb(var(--border))] focus-visible:ring-[rgb(var(--ring))] hover:border-[rgba(var(--accent),0.4)]",
    error:
      "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
    success: "border-emerald-500 focus-visible:ring-emerald-500",
  };

  return (
    <div className="relative w-full group">
      <select
        disabled={disabled}
        className={cn(
          "w-full appearance-none border bg-[rgb(var(--card))] text-[rgb(var(--fg))]",
          "font-medium shadow-sm transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          // Explicit option styling for dark mode readability & modern look
          "[&_option]:bg-[rgb(var(--card))] [&_option]:text-[rgb(var(--fg))] [&_option]:py-2",
          "dark:[&_option]:bg-[#181818] dark:[&_option]:text-[#f5f5f5]",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[rgb(var(--muted))] transition-colors duration-200 group-hover:text-[rgb(var(--fg))]">
        <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
