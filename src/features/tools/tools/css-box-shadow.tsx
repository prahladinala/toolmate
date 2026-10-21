"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function CssBoxShadowTool({ tool }: { tool: ToolDef }) {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("rgba(0, 0, 0, 0.2)");
  const [inset, setInset] = useState(false);
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const cssStr = `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}`;
  const cssOutput = `box-shadow: ${cssStr};
-webkit-box-shadow: ${cssStr};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Box shadow CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setHOffset(10);
    setVOffset(10);
    setBlur(25);
    setSpread(-5);
    setColor("rgba(0, 0, 0, 0.2)");
    setInset(false);
    setBgColor("#f8fafc");
    setBoxColor("#ffffff");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Visually build layered, inset, or soft elevation CSS box shadows
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
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-5">
          {/* Colors Row */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[rgb(var(--border))]">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Canvas Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono text-[rgb(var(--fg))]">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Element Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono text-[rgb(var(--fg))]">{boxColor}</span>
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {[
              { label: "Horizontal Offset", val: hOffset, set: setHOffset, min: -100, max: 100 },
              { label: "Vertical Offset", val: vOffset, set: setVOffset, min: -100, max: 100 },
              { label: "Blur Radius", val: blur, set: setBlur, min: 0, max: 150 },
              { label: "Spread Radius", val: spread, set: setSpread, min: -50, max: 100 },
            ].map((slider) => (
              <div key={slider.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-[rgb(var(--fg))]">{slider.label}</span>
                  <span className="font-mono text-[rgb(var(--muted))]">{slider.val}px</span>
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

          {/* Shadow Color & Inset */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex-1 min-w-0">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Shadow Color (HEX/RGBA)
              </label>
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] select-none">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
              />
              <span>Inset Shadow</span>
            </label>
          </div>
        </div>

        {/* Live Preview & CSS Output Column */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          {/* Visual Canvas */}
          <div
            className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] flex items-center justify-center p-8 transition-colors overflow-hidden"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-48 h-48 max-w-full max-h-full rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-150 select-none shadow-sm"
              style={{
                backgroundColor: boxColor,
                boxShadow: cssStr,
                color: boxColor === "#ffffff" ? "#0f172a" : "#ffffff",
              }}
            >
              Box Element
            </div>
          </div>

          {/* Generated CSS Box */}
          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated CSS
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
