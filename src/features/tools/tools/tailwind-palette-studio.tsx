"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  Sliders,
  Eye,
  RotateCcw,
  Layers,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Color math utilities
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  }
  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Math.round(((brightest + 0.05) / (darkest + 0.05)) * 10) / 10;
}

type ShadeStep = {
  stop: number;
  hex: string;
  rgb: [number, number, number];
  contrastWhite: number;
  contrastBlack: number;
  bestTextColor: "#ffffff" | "#0f172a";
  wcagWhite: "AAA" | "AA" | "FAIL";
  wcagBlack: "AAA" | "AA" | "FAIL";
};

const PRESET_COLORS = [
  { name: "ToolMate Indigo", hex: "#4f46e5" },
  { name: "Emerald Mint", hex: "#10b981" },
  { name: "Sunset Coral", hex: "#f43f5e" },
  { name: "Cyber Violet", hex: "#8b5cf6" },
  { name: "Amber Spark", hex: "#f59e0b" },
  { name: "Ocean Sky", hex: "#0ea5e9" },
  { name: "Deep Charcoal", hex: "#334155" },
];

export function TailwindPaletteStudioTool({ tool }: { tool: ToolDef }) {
  const [baseColor, setBaseColor] = useState("#4f46e5");
  const [paletteName, setPaletteName] = useState("brand");
  const [exportFormat, setExportFormat] = useState<"tailwind" | "css-vars" | "json">("tailwind");

  // Generate 50-950 scale
  const palette = useMemo<ShadeStep[]>(() => {
    const [r, g, b] = hexToRgb(baseColor);
    const [h, s, baseL] = rgbToHsl(r, g, b);

    // Lightness targets for stops: 50 -> 950
    const stopsMap: { stop: number; targetL: number; satFactor: number }[] = [
      { stop: 50, targetL: 97, satFactor: 0.35 },
      { stop: 100, targetL: 93, satFactor: 0.5 },
      { stop: 200, targetL: 85, satFactor: 0.7 },
      { stop: 300, targetL: 74, satFactor: 0.85 },
      { stop: 400, targetL: 62, satFactor: 0.95 },
      { stop: 500, targetL: baseL, satFactor: 1.0 }, // exact anchor
      { stop: 600, targetL: Math.max(12, baseL * 0.82), satFactor: 1.05 },
      { stop: 700, targetL: Math.max(10, baseL * 0.65), satFactor: 1.0 },
      { stop: 800, targetL: Math.max(8, baseL * 0.48), satFactor: 0.9 },
      { stop: 900, targetL: Math.max(6, baseL * 0.32), satFactor: 0.8 },
      { stop: 950, targetL: Math.max(4, baseL * 0.2), satFactor: 0.75 },
    ];

    return stopsMap.map(({ stop, targetL, satFactor }) => {
      const stepSat = Math.min(100, Math.round(s * satFactor));
      const [stepR, stepG, stepB] = hslToRgb(h, stepSat, targetL);
      const hex = rgbToHex(stepR, stepG, stepB);

      const contrastWhite = getContrastRatio(hex, "#ffffff");
      const contrastBlack = getContrastRatio(hex, "#0f172a");
      const bestTextColor = contrastWhite >= contrastBlack ? "#ffffff" : "#0f172a";

      const getWcag = (ratio: number): "AAA" | "AA" | "FAIL" => {
        if (ratio >= 7.0) return "AAA";
        if (ratio >= 4.5) return "AA";
        return "FAIL";
      };

      return {
        stop,
        hex,
        rgb: [stepR, stepG, stepB],
        contrastWhite,
        contrastBlack,
        bestTextColor,
        wcagWhite: getWcag(contrastWhite),
        wcagBlack: getWcag(contrastBlack),
      };
    });
  }, [baseColor]);

  // Code Export generator
  const exportCode = useMemo(() => {
    if (exportFormat === "tailwind") {
      const entries = palette
        .map((p) => `        ${p.stop}: '${p.hex}',`)
        .join("\n");

      return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${paletteName}': {
${entries}
        },
      },
    },
  },
};`;
    }

    if (exportFormat === "css-vars") {
      const entries = palette
        .map((p) => `  --color-${paletteName}-${p.stop}: ${p.hex};`)
        .join("\n");

      return `:root {\n${entries}\n}`;
    }

    if (exportFormat === "json") {
      const obj: Record<string, string> = {};
      palette.forEach((p) => {
        obj[p.stop] = p.hex;
      });
      return JSON.stringify({ [paletteName]: obj }, null, 2);
    }

    return "";
  }, [exportFormat, palette, paletteName]);

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Preset Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => setBaseColor(preset.hex)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: preset.hex }}
            />
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Studio Controls */}
      <Card className="p-5 bg-card/90 border-border/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Base Color Picker */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Base Color (500 Anchor)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer p-0 border border-border bg-transparent shrink-0"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#4f46e5"
                className="font-mono text-sm h-10 flex-1 uppercase"
              />
            </div>
          </div>

          {/* Palette Variable Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Color Token Name
            </label>
            <Input
              type="text"
              value={paletteName}
              onChange={(e) =>
                setPaletteName(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                )
              }
              placeholder="brand"
              className="font-mono text-sm h-10"
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-col justify-center border-l border-border/70 pl-4 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Generated Scale
            </span>
            <span className="text-sm font-mono font-bold text-foreground">
              11 Shade Steps (50 → 950)
            </span>
            <span className="text-xs text-muted-foreground">
              Perceptual WCAG Contrast Verified
            </span>
          </div>
        </div>
      </Card>

      {/* Full 11-Step Palette Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary" /> Palette Swatches & Contrast Auditor
          </span>
          <span className="text-xs text-muted-foreground">
            Click any swatch to copy HEX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
          {palette.map((step) => {
            return (
              <Card
                key={step.stop}
                className="p-3 border-border/80 shadow-xs flex flex-col justify-between h-44 cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden relative group"
                style={{ backgroundColor: step.hex }}
              >
                {/* Top: Stop label & text contrast badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-sm"
                    style={{
                      color: step.bestTextColor,
                      backgroundColor:
                        step.bestTextColor === "#ffffff"
                          ? "rgba(0,0,0,0.25)"
                          : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {step.stop}
                  </span>

                  <span
                    className="text-[10px] font-mono px-1 py-0.2 rounded-xs font-bold"
                    style={{
                      color: step.bestTextColor,
                      backgroundColor:
                        step.bestTextColor === "#ffffff"
                          ? "rgba(0,0,0,0.25)"
                          : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {step.bestTextColor === "#ffffff"
                      ? `${step.contrastWhite}:1`
                      : `${step.contrastBlack}:1`}
                  </span>
                </div>

                {/* Bottom: Hex code & copy icon */}
                <div
                  className="pt-2 border-t mt-auto space-y-1"
                  style={{
                    borderColor:
                      step.bestTextColor === "#ffffff"
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.15)",
                  }}
                >
                  <span
                    className="font-mono text-xs font-bold block uppercase"
                    style={{ color: step.bestTextColor }}
                  >
                    {step.hex}
                  </span>

                  <div className="flex items-center gap-1">
                    <span
                      className="text-[9px] font-mono font-semibold px-1 rounded-xs"
                      style={{
                        color: step.bestTextColor,
                        backgroundColor:
                          step.bestTextColor === "#ffffff"
                            ? "rgba(0,0,0,0.3)"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      On {step.bestTextColor === "#ffffff" ? "White" : "Dark"}:{" "}
                      {step.bestTextColor === "#ffffff"
                        ? step.wcagWhite
                        : step.wcagBlack}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Interactive UI Component Playground */}
      <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-primary" /> Live UI Component Test
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-dashed border-border bg-muted/20">
          {/* Primary Button */}
          <div className="space-y-1.5 text-center">
            <span className="text-[11px] text-muted-foreground block font-mono">
              Primary (500)
            </span>
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg font-medium text-xs shadow-xs transition-opacity hover:opacity-90"
              style={{
                backgroundColor: palette.find((p) => p.stop === 500)?.hex,
                color: palette.find((p) => p.stop === 500)?.bestTextColor,
              }}
            >
              Action Button
            </button>
          </div>

          {/* Subtle Button */}
          <div className="space-y-1.5 text-center">
            <span className="text-[11px] text-muted-foreground block font-mono">
              Subtle (100 / 700)
            </span>
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg font-medium text-xs transition-opacity hover:opacity-90"
              style={{
                backgroundColor: palette.find((p) => p.stop === 100)?.hex,
                color: palette.find((p) => p.stop === 700)?.hex,
              }}
            >
              Subtle Button
            </button>
          </div>

          {/* Badge */}
          <div className="space-y-1.5 text-center">
            <span className="text-[11px] text-muted-foreground block font-mono">
              Badge (50 / 600)
            </span>
            <div
              className="py-1.5 px-3 rounded-full text-xs font-semibold inline-block border"
              style={{
                backgroundColor: palette.find((p) => p.stop === 50)?.hex,
                borderColor: palette.find((p) => p.stop === 200)?.hex,
                color: palette.find((p) => p.stop === 700)?.hex,
              }}
            >
              Featured Tag
            </div>
          </div>

          {/* Alert / Callout */}
          <div className="space-y-1.5 text-center">
            <span className="text-[11px] text-muted-foreground block font-mono">
              Banner (50 / 800)
            </span>
            <div
              className="py-2 px-3 rounded-lg text-xs font-medium border"
              style={{
                backgroundColor: palette.find((p) => p.stop === 50)?.hex,
                borderColor: palette.find((p) => p.stop === 300)?.hex,
                color: palette.find((p) => p.stop === 900)?.hex,
              }}
            >
              Status notification banner
            </div>
          </div>
        </div>
      </Card>

      {/* Code Export Pane */}
      <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
            <Button
              type="button"
              variant={exportFormat === "tailwind" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setExportFormat("tailwind")}
              className="h-7 px-2.5 text-xs"
            >
              Tailwind Config
            </Button>
            <Button
              type="button"
              variant={exportFormat === "css-vars" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setExportFormat("css-vars")}
              className="h-7 px-2.5 text-xs"
            >
              CSS Variables
            </Button>
            <Button
              type="button"
              variant={exportFormat === "json" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setExportFormat("json")}
              className="h-7 px-2.5 text-xs"
            >
              JSON
            </Button>
          </div>

          <CopyButton value={exportCode} text="Copy Config" />
        </div>

        <div className="p-4 bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto">
          {exportCode}
        </div>
      </Card>
    </ToolWorkspace>
  );
}
