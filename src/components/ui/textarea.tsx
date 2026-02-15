"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Size = "sm" | "md" | "lg";
type Variant = "default" | "error" | "success";

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  size?: Size;
  variant?: Variant;
  autoResize?: boolean;
  showCount?: boolean;
  maxLength?: number;
};

export function Textarea({
  className,
  size = "md",
  variant = "default",
  autoResize = false,
  showCount = false,
  maxLength,
  value,
  disabled,
  ...props
}: TextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value, autoResize]);

  const sizeClasses: Record<Size, string> = {
    sm: "text-sm px-2 py-2 min-h-[80px]",
    md: "text-sm px-3 py-2 min-h-[120px]",
    lg: "text-base px-4 py-3 min-h-[160px]",
  };

  const variantClasses: Record<Variant, string> = {
    default:
      "border-[rgb(var(--border))] focus-visible:ring-[rgb(var(--ring))]",
    error:
      "border-[rgb(var(--danger))] focus-visible:ring-[rgb(var(--danger))]",
    success: "border-green-500 focus-visible:ring-green-500",
  };

  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "w-full rounded-[var(--radius)] border bg-[rgb(var(--card))] text-[rgb(var(--fg))]",
          "placeholder:opacity-50 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
          "disabled:opacity-50 disabled:pointer-events-none resize-y",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      />

      {showCount && maxLength && (
        <div className="absolute bottom-2 right-3 text-xs text-[rgb(var(--muted))]">
          {currentLength}/{maxLength}
        </div>
      )}
    </div>
  );
}
