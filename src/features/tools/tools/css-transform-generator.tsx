"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function CssTransformGeneratorTool({ tool }: { tool: ToolDef }) {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [copied, setCopied] = useState(false);

  const transforms: string[] = [];
  if (translateX !== 0 || translateY !== 0) transforms.push(`translate(${translateX}px, ${translateY}px)`);
  if (scaleX !== 1 || scaleY !== 1) transforms.push(`scale(${scaleX}, ${scaleY})`);
  if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);
  if (skewX !== 0 || skewY !== 0) transforms.push(`skew(${skewX}deg, ${skewY}deg)`);

  const transformValue = transforms.length > 0 ? transforms.join(" ") : "none";
  const cssOutput = `transform: ${transformValue};
-webkit-transform: ${transformValue};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Transform CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setTranslateX(0);
    setTranslateY(0);
    setScaleX(1);
    setScaleY(1);
    setRotate(0);
    setSkewX(0);
    setSkewY(0);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Visually compose 2D translation, rotation, scaling, and skewing transforms
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
        {/* Sliders */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          {[
            { label: "Translate X", val: translateX, set: setTranslateX, min: -100, max: 100, unit: "px" },
            { label: "Translate Y", val: translateY, set: setTranslateY, min: -100, max: 100, unit: "px" },
            { label: "Rotate Angle", val: rotate, set: setRotate, min: -180, max: 180, unit: "deg" },
            { label: "Scale X", val: scaleX, set: setScaleX, min: 0.2, max: 2, step: 0.05, unit: "x" },
            { label: "Scale Y", val: scaleY, set: setScaleY, min: 0.2, max: 2, step: 0.05, unit: "x" },
            { label: "Skew X", val: skewX, set: setSkewX, min: -45, max: 45, unit: "deg" },
            { label: "Skew Y", val: skewY, set: setSkewY, min: -45, max: 45, unit: "deg" },
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
                step={slider.step || 1}
                value={slider.val}
                onChange={(e) => slider.set(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Live Canvas & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-8 overflow-hidden">
            <div
              className="w-40 h-40 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 shadow-xl flex items-center justify-center text-white font-semibold text-sm select-none transition-transform duration-75"
              style={{ transform: transformValue }}
            >
              Transformed Box
            </div>
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
