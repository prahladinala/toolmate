"use client";

import React, { useEffect, useRef } from "react";
import { X, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DonationButtons } from "./DonationButtons";
import { useEngagementPopup } from "@/hooks/useEngagementPopup";
import { DONATION_CONFIG } from "@/config/donation";

interface EngagementModalProps {
  toolName?: string;
  enabled?: boolean;
}

export function EngagementModal({
  toolName,
  enabled = true,
}: EngagementModalProps) {
  const { isOpen, step, handleFeedback, handleClose } = useEngagementPopup({
    enabled: enabled && DONATION_CONFIG.isEnabled,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  // Accessible Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Click outside listener
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (!isOpen || !DONATION_CONFIG.isEnabled) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="engagement-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-lg rounded-3xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]",
          "p-6 sm:p-8 shadow-2xl shadow-black/30 overflow-hidden",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Dismiss Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.06)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Feedback */}
        {step === "feedback" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h3
              id="engagement-title"
              className="text-xl sm:text-2xl font-black text-[rgb(var(--fg))] tracking-tight mb-2"
            >
              Are you finding this tool useful?
            </h3>

            <p className="text-sm text-[rgb(var(--muted))] mb-7 max-w-sm">
              {toolName ? `You've been working with ${toolName}. ` : ""}
              Your feedback helps us keep everyday developer tools fast, private, and free.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
              {/* Positive Choice */}
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className={cn(
                  "flex-1 py-3 px-5 rounded-[var(--radius)] font-semibold text-sm transition-all duration-150",
                  "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white",
                  "shadow-lg shadow-indigo-950/20 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                )}
              >
                Yes, I love it! ✨
              </button>

              {/* Negative Choice */}
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className={cn(
                  "py-3 px-5 rounded-[var(--radius)] font-semibold text-sm transition-all duration-150",
                  "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]",
                  "border border-[rgb(var(--border))] hover:bg-[rgba(var(--fg),0.04)]",
                  "active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                )}
              >
                Not really
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment / Support Options */}
        {step === "donation" && (
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center mb-4 shadow-sm">
              <Heart className="w-6 h-6 fill-pink-500/20" />
            </div>

            <h3
              id="engagement-title"
              className="text-xl sm:text-2xl font-black text-[rgb(var(--fg))] tracking-tight mb-2"
            >
              Glad to hear it!
            </h3>

            <p className="text-sm text-[rgb(var(--muted))] mb-6 max-w-md leading-relaxed">
              Since this tool is free, consider supporting its maintenance. Even a small tip fuels server uptime and new developer utilities.
            </p>

            {/* Donation Buttons */}
            <div className="w-full mb-6">
              <DonationButtons size="md" />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "py-2 px-6 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors",
                "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.06)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              )}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
