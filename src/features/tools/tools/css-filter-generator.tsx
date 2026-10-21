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

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?auto=format&fit=crop&w=800&q=80";

export function CssFilterGeneratorTool({ tool }: { tool: ToolDef }) {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [copied, setCopied] = useState(false);

  const filters: string[] = [];
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`);
  if (hueRotate > 0) filters.push(`hue-rotate(${hueRotate}deg)`);
  if (invert > 0) filters.push(`invert(${invert}%)`);
  if (opacity < 100) filters.push(`opacity(${opacity}%)`);
  if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
  if (sepia > 0) filters.push(`sepia(${sepia}%)`);

  const filterValue = filters.length > 0 ? filters.join(" ") : "none";
  const cssOutput = `filter: ${filterValue};
-webkit-filter: ${filterValue};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Filter CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setBlur(0);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setHueRotate(0);
    setInvert(0);
    setOpacity(100);
    setSaturate(100);
    setSepia(0);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Visually stack blur, brightness, contrast, hue, and sepia CSS filters
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Filters
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Sliders Column */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Sample Image URL
            </label>
            <Input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-3.5 pt-2 border-t border-[rgb(var(--border))]">
            {[
              { label: "Blur", val: blur, set: setBlur, min: 0, max: 20, unit: "px" },
              { label: "Brightness", val: brightness, set: setBrightness, min: 0, max: 200, unit: "%" },
              { label: "Contrast", val: contrast, set: setContrast, min: 0, max: 200, unit: "%" },
              { label: "Grayscale", val: grayscale, set: setGrayscale, min: 0, max: 100, unit: "%" },
              { label: "Hue Rotate", val: hueRotate, set: setHueRotate, min: 0, max: 360, unit: "deg" },
              { label: "Invert", val: invert, set: setInvert, min: 0, max: 100, unit: "%" },
              { label: "Opacity", val: opacity, set: setOpacity, min: 0, max: 100, unit: "%" },
              { label: "Saturate", val: saturate, set: setSaturate, min: 0, max: 200, unit: "%" },
              { label: "Sepia", val: sepia, set: setSepia, min: 0, max: 100, unit: "%" },
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

        {/* Live Preview & CSS Code */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Filter Preview Target"
              className="max-w-full max-h-[360px] object-cover rounded-xl shadow-md transition-all duration-100"
              style={{ filter: filterValue }}
              onError={(e) => {
                // fallback to default image if user enters invalid url
                (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
              }}
            />
          </div>

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
              minHeight="min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
