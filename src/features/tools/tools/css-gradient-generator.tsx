"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function CssGradientGeneratorTool({ tool }: { tool: ToolDef }) {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#9333ea");
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [copied, setCopied] = useState(false);

  const cssStr =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const cssOutput = `background: ${cssStr};
background: -webkit-${cssStr};`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Gradient CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setColor1("#3b82f6");
    setColor2("#9333ea");
    setAngle(90);
    setType("linear");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={type === "linear" ? "primary" : "secondary"}
            onClick={() => setType("linear")}
            className="text-xs"
          >
            Linear Gradient
          </Button>
          <Button
            type="button"
            size="sm"
            variant={type === "radial" ? "primary" : "secondary"}
            onClick={() => setType("radial")}
            className="text-xs"
          >
            Radial Gradient
          </Button>
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
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-5">
          {/* Colors */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[rgb(var(--border))]">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Start Color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{color1}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                End Color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{color2}</span>
              </div>
            </div>
          </div>

          {/* Angle Slider (if Linear) */}
          {type === "linear" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                  Gradient Angle
                </span>
                <span className="font-mono text-[rgb(var(--fg))]">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}

          {/* Quick presets */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-2">
              Popular Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { c1: "#3b82f6", c2: "#9333ea" },
                { c1: "#ec4899", c2: "#f43f5e" },
                { c1: "#06b6d4", c2: "#3b82f6" },
                { c1: "#10b981", c2: "#059669" },
                { c1: "#f59e0b", c2: "#ea580c" },
                { c1: "#8b5cf6", c2: "#ec4899" },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setColor1(p.c1);
                    setColor2(p.c2);
                  }}
                  className="h-9 rounded-xl border border-[rgb(var(--border))] shadow-xs transition-transform hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                  title={`${p.c1} → ${p.c2}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div
            className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] shadow-sm transition-all duration-200"
            style={{ background: cssStr }}
          />

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated CSS
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyToClipboard}
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
