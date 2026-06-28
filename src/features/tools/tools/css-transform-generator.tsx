"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

export function CssTransformGeneratorTool({ tool }: { tool: ToolDef }) {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const transforms = [];
  if (translateX !== 0 || translateY !== 0) transforms.push(`translate(${translateX}px, ${translateY}px)`);
  if (scaleX !== 1 || scaleY !== 1) transforms.push(`scale(${scaleX}, ${scaleY})`);
  if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);
  if (skewX !== 0 || skewY !== 0) transforms.push(`skew(${skewX}deg, ${skewY}deg)`);

  const transformValue = transforms.length > 0 ? transforms.join(" ") : "none";
  const cssOutput = `transform: ${transformValue};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      alert("CSS copied to clipboard!");
    } catch (e) {}
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CSS Transform Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Visually generate CSS transform properties including translation, rotation, scale, and skew.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={handleReset}>Reset All</Button>
          </div>

          {[
            { label: "Translate X", val: translateX, set: setTranslateX, min: -200, max: 200, step: 1, unit: "px" },
            { label: "Translate Y", val: translateY, set: setTranslateY, min: -200, max: 200, step: 1, unit: "px" },
            { label: "Scale X", val: scaleX, set: setScaleX, min: -3, max: 3, step: 0.1, unit: "" },
            { label: "Scale Y", val: scaleY, set: setScaleY, min: -3, max: 3, step: 0.1, unit: "" },
            { label: "Rotate", val: rotate, set: setRotate, min: -360, max: 360, step: 1, unit: "°" },
            { label: "Skew X", val: skewX, set: setSkewX, min: -90, max: 90, step: 1, unit: "°" },
            { label: "Skew Y", val: skewY, set: setSkewY, min: -90, max: 90, step: 1, unit: "°" },
          ].map((slider) => (
            <div key={slider.label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-xs text-[rgb(var(--muted))]">{slider.val}{slider.unit}</span>
              </div>
              <input type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.val} onChange={(e) => slider.set(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
          ))}
          
          <Button onClick={copyCss} className="w-full mt-4">Copy CSS</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8 bg-[rgb(var(--card-2))] overflow-hidden">
             <div 
               className="w-32 h-32 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl shadow-lg flex items-center justify-center text-white font-bold transition-transform duration-100"
               style={{ transform: transformValue }}
             >
               Transform Me
             </div>
          </div>
          <div className="h-40 relative border-t border-[rgb(var(--border))]">
             <CodeEditor value={cssOutput} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
