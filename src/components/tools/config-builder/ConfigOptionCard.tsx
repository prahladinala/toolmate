"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, HelpCircle, Lightbulb, Code2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ConfigOption } from "./types";

interface ConfigOptionCardProps {
  option: ConfigOption;
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
  className?: string;
}

export function ConfigOptionCard({
  option,
  checked,
  onToggle,
  className,
}: ConfigOptionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "group relative rounded-xl border transition-all duration-200",
        checked
          ? "border-[rgba(var(--accent),0.35)] bg-[rgba(var(--accent),0.03)] shadow-sm"
          : "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:border-[rgba(var(--fg),0.2)]",
        className
      )}
    >
      {/* Header / Interactive Area */}
      <div className="flex items-start gap-3.5 p-3.5 sm:p-4">
        <div className="pt-0.5 shrink-0">
          <Checkbox
            checked={checked}
            onChange={(val) => onToggle(option.id, val)}
            aria-label={`Toggle ${option.name}`}
          />
        </div>

        <div
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => onToggle(option.id, !checked)}
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={cn(
                "text-sm font-semibold tracking-tight transition-colors",
                checked ? "text-[rgb(var(--fg))]" : "text-[rgb(var(--fg))]/90"
              )}
            >
              {option.name}
            </span>

            {option.key && (
              <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[rgba(var(--fg),0.06)] text-[rgb(var(--muted))] border border-[rgb(var(--border))]">
                {option.key}
              </code>
            )}

            <Badge
              variant="outline"
              size="sm"
              className="text-[10px] text-[rgb(var(--muted))]"
            >
              {option.category}
            </Badge>
          </div>

          <p className="text-xs text-[rgb(var(--muted))] leading-relaxed">
            {option.description}
          </p>
        </div>

        {/* Accordion / Help Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className={cn(
            "shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors",
            expanded
              ? "bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
              : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgba(var(--fg),0.06)]"
          )}
          title={expanded ? "Hide explanation" : "Why use this rule?"}
          aria-expanded={expanded}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Why?</span>
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Expandable Help / Accordion Drawer */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[rgb(var(--border))]/60 bg-[rgba(var(--card-2),0.5)] rounded-b-xl space-y-2.5 animate-in fade-in-50 duration-150">
          <div className="flex items-start gap-2 pt-2 text-xs text-[rgb(var(--fg))]/90">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[rgb(var(--fg))]">Why it helps: </span>
              <span className="text-[rgb(var(--muted))]">{option.whyItHelps}</span>
            </div>
          </div>

          {option.example && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-medium text-[rgb(var(--muted))]">
                <Code2 className="w-3 h-3" />
                <span>Example</span>
              </div>
              <pre className="text-[11px] font-mono p-2.5 rounded-lg bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] text-[rgb(var(--fg))] overflow-x-auto whitespace-pre leading-relaxed">
                {option.example}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
