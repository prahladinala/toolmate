"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function adjustColor(color: string, amount: number) {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }
  let R = parseInt(color.substring(0, 2), 16);
  let G = parseInt(color.substring(2, 4), 16);
  let B = parseInt(color.substring(4, 6), 16);

  R = Math.max(0, Math.min(255, R + amount));
  G = Math.max(0, Math.min(255, G + amount));
  B = Math.max(0, Math.min(255, B + amount));

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

  return (usePound ? "#" : "") + RR + GG + BB;
}

export function NeumorphismGeneratorTool({ tool }: { tool: ToolDef }) {
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(36);
  const [distance, setDistance] = useState(16);
  const [intensity, setIntensity] = useState(16);
  const [blur, setBlur] = useState(32);
  const [shape, setShape] = useState<"flat" | "concave" | "convex" | "pressed">("flat");
  const [color, setColor] = useState("#e2e8f0");
  const [copied, setCopied] = useState(false);

  const lightColor = adjustColor(color, intensity);
  const darkColor = adjustColor(color, -intensity);

  let boxShadow = "";
  let background = color;

  if (shape === "flat") {
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === "pressed") {
    boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === "concave") {
    background = `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  } else if (shape === "convex") {
    background = `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
    boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
  }

  const cssOutput = `border-radius: ${radius}px;
background: ${background};
box-shadow: ${boxShadow};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Neumorphic CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setSize(200);
    setRadius(36);
    setDistance(16);
    setIntensity(16);
    setBlur(32);
    setShape("flat");
    setColor("#e2e8f0");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Create soft UI surfaces with realistic embossed and debossed shadows
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
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[rgb(var(--border))]">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Base Color
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

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Shape Model
              </label>
              <Select
                value={shape}
                onChange={(e) => setShape(e.target.value as any)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="flat">Flat</option>
                <option value="pressed">Pressed (Inset)</option>
                <option value="concave">Concave</option>
                <option value="convex">Convex</option>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Element Size", val: size, set: setSize, min: 80, max: 280, unit: "px" },
              { label: "Corner Radius", val: radius, set: setRadius, min: 0, max: 140, unit: "px" },
              { label: "Shadow Distance", val: distance, set: setDistance, min: 2, max: 40, unit: "px" },
              { label: "Light Intensity", val: intensity, set: setIntensity, min: 4, max: 40, unit: "" },
              { label: "Blur Radius", val: blur, set: setBlur, min: 4, max: 80, unit: "px" },
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
          <div
            className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] flex items-center justify-center p-8 transition-colors overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <div
              className="max-w-full max-h-full transition-all duration-150 flex items-center justify-center text-xs font-semibold select-none text-slate-600 dark:text-slate-400"
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                background,
                boxShadow,
              }}
            >
              Soft UI
            </div>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated Neumorphic CSS
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
