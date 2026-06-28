"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

const ANIMATIONS = {
  fadeIn: {
    keyframes: `@keyframes fadeIn {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}`,
    class: "fadeIn"
  },
  slideUp: {
    keyframes: `@keyframes slideUp {\n  0% { transform: translateY(100px); opacity: 0; }\n  100% { transform: translateY(0); opacity: 1; }\n}`,
    class: "slideUp"
  },
  zoomIn: {
    keyframes: `@keyframes zoomIn {\n  0% { transform: scale(0); opacity: 0; }\n  100% { transform: scale(1); opacity: 1; }\n}`,
    class: "zoomIn"
  },
  bounce: {
    keyframes: `@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }\n  40% { transform: translateY(-30px); }\n  60% { transform: translateY(-15px); }\n}`,
    class: "bounce"
  },
  pulse: {
    keyframes: `@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}`,
    class: "pulse"
  },
  spin: {
    keyframes: `@keyframes spin {\n  100% { transform: rotate(360deg); }\n}`,
    class: "spin"
  }
};

type AnimKey = keyof typeof ANIMATIONS;

export function CssAnimationGeneratorTool({ tool }: { tool: ToolDef }) {
  const [type, setType] = useState<AnimKey>("slideUp");
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState("ease-out");
  const [iteration, setIteration] = useState("1");
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("forwards");
  
  const [key, setKey] = useState(0); // to retrigger animation

  const anim = ANIMATIONS[type];
  
  const cssClass = `.animate-${anim.class} {
  animation: ${anim.class} ${duration}s ${easing} ${delay}s ${iteration} ${direction} ${fillMode};
}`;

  const fullCss = `${anim.keyframes}\n\n${cssClass}`;

  // Inline style for actual preview
  const previewStyle: React.CSSProperties = {
    animationName: anim.class,
    animationDuration: `${duration}s`,
    animationTimingFunction: easing,
    animationDelay: `${delay}s`,
    animationIterationCount: iteration,
    animationDirection: direction as any,
    animationFillMode: fillMode as any,
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(fullCss);
      alert("CSS copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* We need to inject the keyframes into the document for the preview to work properly if we want custom ones,
          but since these are hardcoded, we can just inject a global style block here. */}
      <style>{anim.keyframes}</style>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CSS Animation Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Create and export beautiful CSS keyframe animations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Animation Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as AnimKey)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
              {Object.keys(ANIMATIONS).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Duration</label>
                <span className="text-xs text-[rgb(var(--muted))]">{duration}s</span>
              </div>
              <input type="range" min="0.1" max="5" step="0.1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Delay</label>
                <span className="text-xs text-[rgb(var(--muted))]">{delay}s</span>
              </div>
              <input type="range" min="0" max="5" step="0.1" value={delay} onChange={(e) => setDelay(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Timing Function</label>
              <select value={easing} onChange={(e) => setEasing(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
                <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">bouncy bezier</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Iteration Count</label>
              <select value={iteration} onChange={(e) => setIteration(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="infinite">infinite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Direction</label>
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                <option value="normal">normal</option>
                <option value="reverse">reverse</option>
                <option value="alternate">alternate</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Fill Mode</label>
              <select value={fillMode} onChange={(e) => setFillMode(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                <option value="none">none</option>
                <option value="forwards">forwards</option>
                <option value="backwards">backwards</option>
                <option value="both">both</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setKey(k => k + 1)} className="flex-1">Replay</Button>
            <Button onClick={copyCss} className="flex-1">Copy CSS</Button>
          </div>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="flex-1 flex items-center justify-center bg-[rgb(var(--card-2))] p-8 overflow-hidden">
            <div 
              key={key} 
              className="w-32 h-32 bg-[rgb(var(--accent))] rounded-[var(--radius-lg)] shadow-lg flex items-center justify-center text-white font-bold"
              style={previewStyle}
            >
              Element
            </div>
          </div>
          <div className="w-full h-48 relative border-t border-[rgb(var(--border))]">
             <CodeEditor value={fullCss} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
