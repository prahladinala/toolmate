"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className,
}: CheckboxProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <label
      className={cn(
        "flex items-center gap-2 select-none",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />

        <div
          className={cn(
            "rounded-[var(--radius)] border border-[rgb(var(--border))]",
            "bg-[rgb(var(--card-2))]",
            "transition duration-150",
            "peer-checked:border-[rgb(var(--accent))]",
            "peer-checked:bg-[rgba(var(--accent),0.15)]",
            sizeClasses[size],
          )}
        />

        <svg
          className={cn(
            "absolute inset-0 m-auto",
            "opacity-0 peer-checked:opacity-100",
            "text-[rgb(var(--accent))]",
            "transition duration-150",
            sizeClasses[size],
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
