"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const PRESETS = [
  {
    name: "Polka Dots",
    pattern: `<pattern id="pattern" x="0" y="0" width="\${size}" height="\${size}" patternUnits="userSpaceOnUse">\n  <circle fill="\${color}" cx="\${size/2}" cy="\${size/2}" r="\${size/8}"></circle>\n</pattern>`,
  },
  {
    name: "Subtle Grid",
    pattern: `<pattern id="pattern" width="\${size}" height="\${size}" patternUnits="userSpaceOnUse">\n  <path d="M \${size} 0 L 0 0 0 \${size}" fill="none" stroke="\${color}" stroke-width="1.5"/>\n</pattern>`,
  },
  {
    name: "Diagonal Stripes",
    pattern: `<pattern id="pattern" width="\${size}" height="\${size}" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">\n  <line x1="0" y1="0" x2="0" y2="\${size}" stroke="\${color}" stroke-width="\${size/4}" />\n</pattern>`,
  },
];

export function SvgBackgroundGeneratorTool({ tool }: { tool: ToolDef }) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [patternColor, setPatternColor] = useState("#94a3b8");
  const [size, setSize] = useState(32);
  const [opacity, setOpacity] = useState(40);
  const [copied, setCopied] = useState(false);

  const currentPreset = PRESETS[presetIdx];

  const parsedPattern = currentPreset.pattern
    .replace(/\$\{size\}/g, String(size))
    .replace(/\$\{size\/2\}/g, String(size / 2))
    .replace(/\$\{size\/4\}/g, String(size / 4))
    .replace(/\$\{size\/8\}/g, String(Math.max(1, size / 8)))
    .replace(/\$\{color\}/g, patternColor);

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    ${parsedPattern.split("\n").join("\n    ")}
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}" />
  <rect width="100%" height="100%" fill="url(#pattern)" opacity="${opacity / 100}" />
</svg>`;

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      toast.success("SVG background markup copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setPresetIdx(0);
    setBgColor("#ffffff");
    setPatternColor("#94a3b8");
    setSize(32);
    setOpacity(40);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Patterns:
          </span>
          {PRESETS.map((p, i) => (
            <Button
              key={p.name}
              type="button"
              size="sm"
              variant={i === presetIdx ? "primary" : "secondary"}
              onClick={() => setPresetIdx(i)}
              className="text-xs h-7 px-2.5"
            >
              {p.name}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Defaults
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[rgb(var(--border))]">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Background Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Pattern Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={patternColor}
                  onChange={(e) => setPatternColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{patternColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Pattern Tile Size</span>
                <span className="font-mono text-[rgb(var(--muted))]">{size}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="128"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Pattern Opacity</span>
                <span className="font-mono text-[rgb(var(--muted))]">{opacity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div
            className="w-full h-64 sm:h-72 rounded-2xl border border-[rgb(var(--border))] overflow-hidden shadow-sm transition-all"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated SVG Markup
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copySvg}
                className="text-xs h-7 px-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy SVG
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={svgCode}
              language="html"
              editable={false}
              minHeight="min-h-[140px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
