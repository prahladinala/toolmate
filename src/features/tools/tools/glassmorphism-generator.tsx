"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) || 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) || 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) || 255;
  return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
}

export function GlassmorphismGeneratorTool({ tool }: { tool: ToolDef }) {
  const [blur, setBlur] = useState(16);
  const [transparency, setTransparency] = useState(20);
  const [outline, setOutline] = useState(25);
  const [color, setColor] = useState("#ffffff");
  const [radius, setRadius] = useState(24);
  const [copied, setCopied] = useState(false);

  const bgColor = hexToRgba(color, transparency);
  const outlineColor = hexToRgba("#ffffff", outline);

  const cssOutput = `background: ${bgColor};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid ${outlineColor};
border-radius: ${radius}px;
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Glassmorphic CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setBlur(16);
    setTransparency(20);
    setOutline(25);
    setColor("#ffffff");
    setRadius(24);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Create frosted glass effects with dynamic backdrop filters, specular borders, and blur
        </span>
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
          <div className="pb-3 border-b border-[rgb(var(--border))]">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
              Glass Tint Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
              />
              <span className="text-xs font-mono">{color}</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Backdrop Blur", val: blur, set: setBlur, min: 0, max: 40, unit: "px" },
              { label: "Opacity / Transparency", val: transparency, set: setTransparency, min: 5, max: 80, unit: "%" },
              { label: "Border Opacity", val: outline, set: setOutline, min: 0, max: 100, unit: "%" },
              { label: "Border Radius", val: radius, set: setRadius, min: 0, max: 48, unit: "px" },
            ].map((slider) => (
              <div key={slider.label} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[rgb(var(--fg))]">{slider.label}</span>
                  <span className="font-mono text-[rgb(var(--muted))]">
                    {slider.val}{slider.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={slider.val}
                  onChange={(e) => slider.set(Number(e.target.value))}
                  className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Canvas & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 relative flex items-center justify-center p-8 overflow-hidden select-none">
            {/* Colorful background shapes */}
            <div className="absolute top-8 left-8 w-36 h-36 bg-amber-400 rounded-full mix-blend-screen filter blur-lg opacity-80" />
            <div className="absolute bottom-8 right-8 w-44 h-44 bg-cyan-400 rounded-full mix-blend-screen filter blur-xl opacity-75" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400 rounded-full mix-blend-screen filter blur-lg opacity-60" />

            {/* Glass panel */}
            <div
              className="relative z-10 w-64 max-w-full p-6 text-white flex flex-col items-center justify-center text-center shadow-xl transition-all duration-150"
              style={{
                background: bgColor,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                border: `1px solid ${outlineColor}`,
                borderRadius: radius,
              }}
            >
              <span className="font-semibold text-lg tracking-tight">Frosted Glass</span>
              <p className="text-xs text-white/80 mt-1">Real-time backdrop refraction</p>
            </div>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated Glassmorphic CSS
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyCss}
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
                    Copy CSS
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={cssOutput}
              language="css"
              editable={false}
              minHeight="min-h-[140px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
