"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Columns2, Smartphone } from "lucide-react";

interface ToolSplitPaneProps {
  input: React.ReactNode;
  output: React.ReactNode;
  inputHeader?: React.ReactNode;
  outputHeader?: React.ReactNode;
  className?: string;
  defaultMobileView?: "input" | "output" | "both";
  hasOutput?: boolean;
}

export function ToolSplitPane({
  input,
  output,
  inputHeader,
  outputHeader,
  className,
  defaultMobileView = "both",
  hasOutput = false,
}: ToolSplitPaneProps) {
  const [mobileView, setMobileView] = useState<"input" | "output" | "both">(
    defaultMobileView
  );

  return (
    <div className={cn("w-full min-w-0 space-y-4", className)}>
      {/* Mobile View Switcher (Visible only below lg) */}
      <div className="flex lg:hidden items-center justify-between p-1.5 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
        <div className="flex items-center gap-1 w-full">
          <button
            type="button"
            onClick={() => setMobileView("input")}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 text-center select-none",
              mobileView === "input"
                ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm border border-[rgb(var(--border))]"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            )}
          >
            Input
          </button>
          <button
            type="button"
            onClick={() => setMobileView("output")}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 text-center select-none relative",
              mobileView === "output"
                ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm border border-[rgb(var(--border))]"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            )}
          >
            Output
            {hasOutput && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5 align-middle" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileView("both")}
            className={cn(
              "py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 text-center select-none",
              mobileView === "both"
                ? "bg-[rgb(var(--card))] text-[rgb(var(--fg))] shadow-sm border border-[rgb(var(--border))]"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            )}
            title="Show both input and output"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* Input Panel */}
        <div
          className={cn(
            "flex flex-col min-w-0 w-full",
            mobileView === "output" ? "hidden lg:flex" : "flex"
          )}
        >
          {inputHeader && (
            <div className="mb-2 min-w-0 flex items-center justify-between">
              {inputHeader}
            </div>
          )}
          <div className="flex-1 min-w-0 w-full">{input}</div>
        </div>

        {/* Output Panel */}
        <div
          className={cn(
            "flex flex-col min-w-0 w-full",
            mobileView === "input" ? "hidden lg:flex" : "flex"
          )}
        >
          {outputHeader && (
            <div className="mb-2 min-w-0 flex items-center justify-between">
              {outputHeader}
            </div>
          )}
          <div className="flex-1 min-w-0 w-full">{output}</div>
        </div>
      </div>
    </div>
  );
}
