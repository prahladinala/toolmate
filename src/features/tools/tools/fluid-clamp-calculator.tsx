"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Slider } from "@/components/ui/slider";
import {
  Sparkles,
  Type,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Code2,
  Layers,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const PRESETS = [
  {
    name: "Hero Title (H1)",
    minWidth: 375,
    maxWidth: 1280,
    minSize: 32,
    maxSize: 64,
  },
  {
    name: "Section Heading (H2)",
    minWidth: 375,
    maxWidth: 1280,
    minSize: 24,
    maxSize: 42,
  },
  {
    name: "Subheading (H3)",
    minWidth: 375,
    maxWidth: 1280,
    minSize: 18,
    maxSize: 26,
  },
  {
    name: "Body Text",
    minWidth: 375,
    maxWidth: 1280,
    minSize: 15,
    maxSize: 18,
  },
  {
    name: "Fluid Container Padding",
    minWidth: 375,
    maxWidth: 1440,
    minSize: 16,
    maxSize: 64,
  },
];

export function FluidClampCalculatorTool({ tool }: { tool: ToolDef }) {
  const [minWidth, setMinWidth] = useState(375);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [minSize, setMinSize] = useState(24);
  const [maxSize, setMaxSize] = useState(48);
  const [rootBase, setRootBase] = useState(16);
  const [simulatedWidth, setSimulatedWidth] = useState(768);
  const [codeType, setCodeType] = useState<"css" | "tailwind" | "var">("css");

  // Mathematical clamp calculation
  const calculation = useMemo(() => {
    // slope = (maxSize - minSize) / (maxWidth - minWidth)
    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const yAxisIntersection = -minWidth * slope + minSize;

    // Convert to rem
    const minRem = (minSize / rootBase).toFixed(4).replace(/\.?0+$/, "");
    const maxRem = (maxSize / rootBase).toFixed(4).replace(/\.?0+$/, "");
    const slopeVw = (slope * 100).toFixed(4).replace(/\.?0+$/, "");
    const intersectionRem = (yAxisIntersection / rootBase)
      .toFixed(4)
      .replace(/\.?0+$/, "");

    const sign = yAxisIntersection >= 0 ? "+" : "-";
    const absIntersectionRem = Math.abs(Number(intersectionRem))
      .toFixed(4)
      .replace(/\.?0+$/, "");

    const clampFormula = `clamp(${minRem}rem, ${slopeVw}vw ${sign} ${absIntersectionRem}rem, ${maxRem}rem)`;

    // Calculate simulated current size in px
    let currentPx = minSize;
    if (simulatedWidth <= minWidth) {
      currentPx = minSize;
    } else if (simulatedWidth >= maxWidth) {
      currentPx = maxSize;
    } else {
      currentPx = minSize + slope * (simulatedWidth - minWidth);
    }

    return {
      clampFormula,
      minRem,
      maxRem,
      slopeVw,
      intersectionRem,
      currentPx: Math.round(currentPx * 10) / 10,
      currentRem: (currentPx / rootBase).toFixed(2),
    };
  }, [minWidth, maxWidth, minSize, maxSize, rootBase, simulatedWidth]);

  // Code formats
  const codeSnippet = useMemo(() => {
    if (codeType === "css") {
      return `/* Fluid responsive sizing */
font-size: ${calculation.clampFormula};`;
    }
    if (codeType === "tailwind") {
      return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'fluid-custom': '${calculation.clampFormula}',
      },
    },
  },
};`;
    }
    if (codeType === "var") {
      return `:root {
  --fluid-size: ${calculation.clampFormula};
}`;
    }
    return calculation.clampFormula;
  }, [codeType, calculation]);

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => {
              setMinWidth(preset.minWidth);
              setMaxWidth(preset.maxWidth);
              setMinSize(preset.minSize);
              setMaxSize(preset.maxSize);
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Parameters on Left, Output & Simulation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dimension Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-primary" /> Viewport & Value Bounds
            </span>

            {/* Target Value Size (px) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Min Size (Mobile)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={minSize}
                    onChange={(e) => setMinSize(Number(e.target.value))}
                    min={8}
                    max={200}
                    className="font-mono text-sm pr-8"
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  ={(minSize / rootBase).toFixed(2)}rem
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Max Size (Desktop)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={maxSize}
                    onChange={(e) => setMaxSize(Number(e.target.value))}
                    min={8}
                    max={300}
                    className="font-mono text-sm pr-8"
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  ={(maxSize / rootBase).toFixed(2)}rem
                </span>
              </div>
            </div>

            {/* Viewport Range (px) */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Min Viewport Width
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={minWidth}
                    onChange={(e) => setMinWidth(Number(e.target.value))}
                    min={280}
                    max={2560}
                    className="font-mono text-sm pr-8"
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Default mobile
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Max Viewport Width
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    min={320}
                    max={3840}
                    className="font-mono text-sm pr-8"
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground">
                    px
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  Default desktop
                </span>
              </div>
            </div>

            {/* Base root px */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-foreground block">
                  Root Rem Base
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Browser standard: 16px = 1rem
                </span>
              </div>
              <div className="w-24 relative">
                <Input
                  type="number"
                  value={rootBase}
                  onChange={(e) => setRootBase(Number(e.target.value) || 16)}
                  min={10}
                  max={24}
                  className="font-mono text-xs pr-8 h-8"
                />
                <span className="absolute right-2.5 top-2 text-xs text-muted-foreground">
                  px
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Breakpoints Matrix */}
          <Card className="p-4 bg-card/60 border-border/80 shadow-xs space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Calculated Sizes at Common Screens:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div
                className="p-2 rounded bg-muted/40 cursor-pointer hover:bg-muted"
                onClick={() => setSimulatedWidth(375)}
              >
                <span className="text-muted-foreground block text-[10px]">Mobile (375px)</span>
                <span className="font-bold text-foreground">
                  {minSize}px ({(minSize / rootBase).toFixed(2)}rem)
                </span>
              </div>
              <div
                className="p-2 rounded bg-muted/40 cursor-pointer hover:bg-muted"
                onClick={() => setSimulatedWidth(768)}
              >
                <span className="text-muted-foreground block text-[10px]">Tablet (768px)</span>
                <span className="font-bold text-foreground">
                  {Math.round((minSize + ((maxSize - minSize) / (maxWidth - minWidth)) * (768 - minWidth)) * 10) / 10}px
                </span>
              </div>
              <div
                className="p-2 rounded bg-muted/40 cursor-pointer hover:bg-muted"
                onClick={() => setSimulatedWidth(1024)}
              >
                <span className="text-muted-foreground block text-[10px]">Laptop (1024px)</span>
                <span className="font-bold text-foreground">
                  {Math.round((minSize + ((maxSize - minSize) / (maxWidth - minWidth)) * (1024 - minWidth)) * 10) / 10}px
                </span>
              </div>
              <div
                className="p-2 rounded bg-muted/40 cursor-pointer hover:bg-muted"
                onClick={() => setSimulatedWidth(1280)}
              >
                <span className="text-muted-foreground block text-[10px]">Desktop (1280px)</span>
                <span className="font-bold text-foreground">
                  {maxSize}px ({(maxSize / rootBase).toFixed(2)}rem)
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Interactive Resizing Simulator & Code Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Output Code Card */}
          <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
                <Button
                  type="button"
                  variant={codeType === "css" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCodeType("css")}
                  className="h-7 px-2.5 text-xs"
                >
                  CSS
                </Button>
                <Button
                  type="button"
                  variant={codeType === "tailwind" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCodeType("tailwind")}
                  className="h-7 px-2.5 text-xs"
                >
                  Tailwind
                </Button>
                <Button
                  type="button"
                  variant={codeType === "var" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCodeType("var")}
                  className="h-7 px-2.5 text-xs"
                >
                  CSS Var
                </Button>
              </div>

              <CopyButton value={calculation.clampFormula} text="Copy clamp()" />
            </div>

            <div className="p-4 bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto">
              {codeSnippet}
            </div>
          </Card>

          {/* Interactive Screen Width Simulator */}
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-primary" /> Live Viewport Simulator
              </span>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  Width: {simulatedWidth}px
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                  Computed: {calculation.currentPx}px ({calculation.currentRem}rem)
                </Badge>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <Slider
                value={simulatedWidth}
                onChange={(e) => setSimulatedWidth(Number(e.target.value))}
                min={320}
                max={1920}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>320px (Small Mobile)</span>
                <span>768px (Tablet)</span>
                <span>1280px (Laptop)</span>
                <span>1920px (Desktop)</span>
              </div>
            </div>

            {/* Live Rendered Canvas */}
            <div className="p-6 rounded-xl border border-dashed border-border bg-background/50 flex flex-col items-center justify-center min-h-[140px] text-center overflow-hidden transition-all">
              <p
                style={{ fontSize: `${calculation.currentPx}px`, lineHeight: 1.2 }}
                className="font-bold text-foreground transition-all duration-75 max-w-full truncate"
              >
                Responsive Typography
              </p>
              <span className="text-xs text-muted-foreground mt-2 font-mono">
                Simulated rendered size at {simulatedWidth}px screen width
              </span>
            </div>
          </Card>
        </div>
      </div>
    </ToolWorkspace>
  );
}
