"use client";

import React, { useState, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Sparkles,
  Upload,
  Download,
  Code2,
  Sliders,
  TrendingDown,
  RotateCcw,
  Eye,
  FileCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In . SVG Version: 1.2.0 Build 709)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve">
  <defs>
    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="12.384918237" y1="18.928472918" x2="108.472918274" y2="101.492847192">
      <stop offset="0" style="stop-color:#6366F1"/>
      <stop offset="1" style="stop-color:#8B5CF6"/>
    </linearGradient>
  </defs>
  <g id="Background_Group">
    <rect x="5.12345678" y="5.87654321" rx="24.49182749" width="109.84729182" height="109.49281749" fill="url(#SVGID_1_)"/>
  </g>
  <g id="Icon_Group">
    <!-- Star Path -->
    <path fill="#FFFFFF" d="M60.12384729,22.48291749 L72.48291847,47.84928174 L100.49281749,51.84928174 L80.12384729,71.49281749 L84.84928174,99.49281749 L60.12384729,86.49281749 L35.49281749,99.49281749 L40.12384729,71.49281749 L20.12384729,51.84928174 L48.12384729,47.84928174 Z"/>
  </g>
</svg>`;

// Pure client-side SVG optimization algorithm
function optimizeSvg(
  raw: string,
  precision: number,
  stripMetadata: boolean,
  stripComments: boolean,
  stripEmptyGroups: boolean
): string {
  let out = raw;

  // 1. Strip XML declaration
  out = out.replace(/<\?xml[^>]*\?>/gi, "");

  // 2. Strip DOCTYPE
  out = out.replace(/<!DOCTYPE[^>]*>/gi, "");

  // 3. Strip HTML / XML comments
  if (stripComments) {
    out = out.replace(/<!--[\s\S]*?-->/g, "");
  }

  // 4. Strip Illustrator / Inkscape / Sketch metadata attributes
  if (stripMetadata) {
    out = out.replace(/\s*xmlns:(sketch|inkscape|sodipodi|i)="[^"]*"/gi, "");
    out = out.replace(/\s*(sketch:type|inkscape:version|sodipodi:docname)="[^"]*"/gi, "");
    out = out.replace(/\s*xml:space="[^"]*"/gi, "");
    out = out.replace(/\s*version="1\.[012]"/gi, "");
    out = out.replace(/\s*id="(Layer_[^"]+|Background_Group|Icon_Group)"/gi, "");
  }

  // 5. Strip empty <g></g> groups
  if (stripEmptyGroups) {
    out = out.replace(/<g\s*>\s*<\/g>/gi, "");
  }

  // 6. Round floating point numbers in paths and coordinates to `precision` decimals
  if (precision >= 0) {
    const numRegex = /([0-9]+\.[0-9]{3,})/g;
    out = out.replace(numRegex, (match) => {
      const num = parseFloat(match);
      return Number(num.toFixed(precision)).toString();
    });
  }

  // 7. Collapse unnecessary whitespace and redundant newlines
  out = out
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}

export function SvgOptimizerTool({ tool }: { tool: ToolDef }) {
  const [svgInput, setSvgInput] = useState(SAMPLE_SVG);
  const [precision, setPrecision] = useState(2);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [stripComments, setStripComments] = useState(true);
  const [stripEmptyGroups, setStripEmptyGroups] = useState(true);
  const [previewBg, setPreviewBg] = useState<"checker" | "white" | "dark">("checker");

  // Run optimization
  const optimizedSvg = useMemo(() => {
    return optimizeSvg(
      svgInput,
      precision,
      stripMetadata,
      stripComments,
      stripEmptyGroups
    );
  }, [svgInput, precision, stripMetadata, stripComments, stripEmptyGroups]);

  // File size metrics
  const originalBytes = new Blob([svgInput]).size;
  const optimizedBytes = new Blob([optimizedSvg]).size;
  const bytesSaved = Math.max(0, originalBytes - optimizedBytes);
  const percentSaved =
    originalBytes > 0 ? (bytesSaved / originalBytes) * 100 : 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text.includes("<svg")) {
        setSvgInput(text);
      } else {
        alert("The uploaded file does not appear to be an SVG file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([optimizedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity">
            <Upload className="w-3.5 h-3.5" />
            Upload SVG File
            <input
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-xs text-muted-foreground hidden md:inline">
            100% in-browser SVG geometry cleaner (zero server uploads)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSvgInput(SAMPLE_SVG)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Sample
          </Button>
        </div>
      </div>

      {/* Impact KPI Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Reduction Percentage */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Size Reduction
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-mono gap-1">
              <TrendingDown className="w-3 h-3" />
              {percentSaved.toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            -{(bytesSaved / 1024).toFixed(2)} KB
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            {bytesSaved} bytes saved
          </span>
        </Card>

        {/* Original File Size */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Original Size
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Unoptimized</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {(originalBytes / 1024).toFixed(2)} KB
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block font-mono">
            {originalBytes} bytes
          </span>
        </Card>

        {/* Optimized File Size */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Optimized Size
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
              Ready
            </Badge>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
            {(optimizedBytes / 1024).toFixed(2)} KB
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block font-mono">
            {optimizedBytes} bytes
          </span>
        </Card>

        {/* Precision Decimal Bound */}
        <Card className="p-4 bg-card/80 border-border/70 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Coordinate Precision
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Decimals</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-foreground">
            {precision} Places
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Sub-pixel rounding
          </span>
        </Card>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optimization Controls & Preview Canvas (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Optimization Options
            </span>

            {/* Precision Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider">
                  Float Precision
                </label>
                <span className="font-mono text-foreground font-bold">{precision} decimals</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Checkbox Options */}
            <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripMetadata}
                  onChange={(e) => setStripMetadata(e.target.checked)}
                  className="rounded border-border text-primary h-4 w-4"
                />
                <span>Strip XML Prolog, DOCTYPE & Editor Namespaces</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripComments}
                  onChange={(e) => setStripComments(e.target.checked)}
                  className="rounded border-border text-primary h-4 w-4"
                />
                <span>Remove Comments & Generator Tags</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripEmptyGroups}
                  onChange={(e) => setStripEmptyGroups(e.target.checked)}
                  className="rounded border-border text-primary h-4 w-4"
                />
                <span>Collapse Empty Groups & Collapse Whitespace</span>
              </label>
            </div>
          </Card>

          {/* Live Render Canvas */}
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" /> Visual Output Preview
              </span>

              {/* Background Theme Switcher */}
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setPreviewBg("checker")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold transition-all",
                    previewBg === "checker" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  Checker
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg("white")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold transition-all",
                    previewBg === "white" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg("dark")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-semibold transition-all",
                    previewBg === "dark" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
                  )}
                >
                  Dark
                </button>
              </div>
            </div>

            <div
              className={cn(
                "p-8 rounded-xl border border-dashed border-border flex items-center justify-center min-h-[220px] overflow-hidden",
                previewBg === "checker"
                  ? "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)]"
                  : previewBg === "white"
                  ? "bg-white"
                  : "bg-slate-950"
              )}
            >
              <div
                className="max-w-[180px] max-h-[180px] [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: optimizedSvg }}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Code Editor & Output (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-primary" /> Optimized SVG Code
            </span>

            <div className="flex items-center gap-2">
              <CopyButton value={optimizedSvg} text="Copy SVG" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                Download .SVG
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs min-h-[460px]">
            <div className="px-4 py-2 bg-muted/40 border-b border-border/70 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>optimized.svg</span>
              <span>{optimizedSvg.length} characters</span>
            </div>

            <Textarea
              value={optimizedSvg}
              readOnly
              rows={18}
              className="p-4 flex-1 overflow-auto bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre border-0 rounded-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
