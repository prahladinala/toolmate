"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type Size = "sm" | "md" | "lg";

type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: Size;
  showValue?: boolean;
};

export function Slider({
  className,
  size = "md",
  showValue = false,
  min = 0,
  max = 100,
  value,
  ...props
}: SliderProps) {
  const percentage =
    typeof value === "number"
      ? ((value - Number(min)) / (Number(max) - Number(min))) * 100
      : 0;

  const sizeClasses: Record<Size, string> = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      {showValue && (
        <div className="mb-2 text-sm text-[rgb(var(--muted))]">{value}</div>
      )}

      <div className="relative w-full">
        {/* Track background */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-[rgb(var(--card-2))]",
            sizeClasses[size],
          )}
        />

        {/* Progress track */}
        <div
          className={cn(
            "absolute left-0 top-0 rounded-full bg-[rgb(var(--accent))] transition-all duration-150",
            sizeClasses[size],
          )}
          style={{ width: `${percentage}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className={cn(
            "relative w-full appearance-none bg-transparent cursor-pointer",
            "focus-visible:outline-none",
            className,
          )}
          {...props}
        />

        {/* Thumb styling */}
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgb(var(--accent));
            border: 3px solid rgb(var(--bg));
            transition: transform 0.15s ease;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgb(var(--accent));
            border: 3px solid rgb(var(--bg));
            transition: transform 0.15s ease;
          }
        `}</style>
      </div>
    </div>
  );
}
