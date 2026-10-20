import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DonationButtons } from "./DonationButtons";

interface DonationBannerProps {
  className?: string;
  variant?: "card" | "minimal";
}

export function DonationBanner({
  className,
  variant = "card",
}: DonationBannerProps) {
  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]",
          className
        )}
      >
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 shrink-0">
            <Heart className="w-5 h-5 fill-pink-500/20" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[rgb(var(--fg))]">
              Enjoying ToolMate?
            </h4>
            <p className="text-xs text-[rgb(var(--muted))]">
              Support development and server maintenance.
            </p>
          </div>
        </div>
        <DonationButtons size="sm" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-8 md:p-10 shadow-xl shadow-black/5 text-center",
        className
      )}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Heart icon badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-500 mb-5 shadow-sm">
          <Heart className="w-6 h-6 fill-pink-500/30 animate-pulse" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
          Community-Driven & 100% Free
        </span>

        <h3 className="text-2xl md:text-3xl font-black text-[rgb(var(--fg))] tracking-tight mb-3">
          Support ToolMate&apos;s Development
        </h3>

        <p className="text-[15px] text-[rgb(var(--muted))] leading-relaxed mb-6 max-w-xl">
          ToolMate is built with love by Prahlad Inala — free, private, and
          completely ad-free. If this tool saves your workflow time, consider
          fueling server costs and future tool development.
        </p>

        {/* Side-by-side buttons */}
        <DonationButtons size="lg" />
      </div>
    </div>
  );
}
