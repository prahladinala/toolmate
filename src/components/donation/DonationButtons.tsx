import React from "react";
import { QrCode, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DONATION_CONFIG } from "@/config/donation";

interface DonationButtonsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onButtonClick?: () => void;
}

export function DonationButtons({
  className,
  size = "md",
  onButtonClick,
}: DonationButtonsProps) {
  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs gap-2 rounded-[var(--radius-sm)]",
    md: "px-5 py-2.5 text-sm gap-2.5 rounded-[var(--radius)]",
    lg: "px-6 py-3.5 text-base gap-3 rounded-[var(--radius-lg)]",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto",
        className
      )}
    >
      {/* Razorpay / UPI Button */}
      <a
        href={DONATION_CONFIG.razorpayUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onButtonClick}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none",
          "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white",
          "shadow-lg shadow-emerald-950/20 hover:shadow-emerald-900/30",
          "border border-emerald-400/20 hover:border-emerald-400/40",
          "active:scale-[0.98]",
          sizeClasses[size]
        )}
      >
        <QrCode className={cn("text-emerald-200 shrink-0", iconSizes[size])} />
        <span>Support via UPI</span>
        <span className="text-[10px] tracking-widest font-bold uppercase py-0.5 px-1.5 bg-white/20 rounded-full ml-1 text-emerald-100">
          India
        </span>
      </a>

      {/* Buy Me a Coffee / Card Button */}
      <a
        href={DONATION_CONFIG.buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onButtonClick}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none",
          "bg-[rgb(var(--card-2))] text-[rgb(var(--fg))] hover:text-[rgb(var(--fg))]",
          "border border-[rgb(var(--border))] hover:border-[rgba(var(--accent),0.6)] hover:bg-[rgba(var(--accent),0.08)]",
          "shadow-sm hover:shadow-md",
          "active:scale-[0.98]",
          sizeClasses[size]
        )}
      >
        <CreditCard className={cn("text-amber-500 shrink-0", iconSizes[size])} />
        <span>Support via Card</span>
        <span className="text-[10px] tracking-widest font-bold uppercase py-0.5 px-1.5 bg-[rgba(var(--fg),0.06)] rounded-full ml-1 text-[rgb(var(--muted))]">
          Global
        </span>
      </a>
    </div>
  );
}
