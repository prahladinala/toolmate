"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, ShieldCheck, Zap, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ConfigPreset } from "./types";

interface ConfigPresetsBarProps {
  presets: ConfigPreset[];
  activePresetId?: string | null;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedCount: number;
  totalCount: number;
}

export function ConfigPresetsBar({
  presets,
  activePresetId,
  onSelectPreset,
  onReset,
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedCount,
  totalCount,
}: ConfigPresetsBarProps) {
  const getPresetIcon = (id: string) => {
    switch (id) {
      case "recommended":
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case "strict":
        return <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />;
      case "minimal":
        return <Zap className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Presets Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Presets:
          </span>

          {presets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <Button
                key={preset.id}
                variant={isActive ? "primary" : "secondary"}
                size="sm"
                onClick={() => onSelectPreset(preset.id)}
                className={cn(
                  "h-8 text-xs gap-1.5 px-3 transition-all",
                  isActive && "shadow-sm"
                )}
                title={preset.description}
              >
                {getPresetIcon(preset.id)}
                <span>{preset.name}</span>
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs gap-1 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            title="Deselect all options"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="sm" className="font-mono text-[11px]">
            {selectedCount} of {totalCount} active
          </Badge>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search rules, keywords, or descriptions..."
            className="pl-8 pr-8 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  isCatActive
                    ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))]"
                    : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] border border-[rgb(var(--border))]"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
