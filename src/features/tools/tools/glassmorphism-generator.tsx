"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

export function GlassmorphismGeneratorTool({ tool }: { tool: ToolDef }) {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(25);
  const [outline, setOutline] = useState(10);
  const [color, setColor] = useState("#ffffff");

  const bgColor = hexToRgba(color, transparency);
  const outlineColor = hexToRgba("#ffffff", outline);

  const cssOutput = `background: ${bgColor};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid ${outlineColor};
border-radius: 16px;`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      alert("CSS copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Glassmorphism Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Generate frosted glass (backdrop-filter) CSS effects.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium block mb-1">Glass Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
          </div>

          {[
            { label: "Blur", val: blur, set: setBlur, min: 0, max: 40 },
            { label: "Transparency", val: transparency, set: setTransparency, min: 0, max: 100 },
            { label: "Outline", val: outline, set: setOutline, min: 0, max: 100 },
          ].map((slider) => (
            <div key={slider.label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-xs text-[rgb(var(--muted))]">{slider.val}</span>
              </div>
              <input type="range" min={slider.min} max={slider.max} value={slider.val} onChange={(e) => slider.set(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
          ))}
          
          <Button onClick={copyCss} className="w-full">Copy CSS</Button>
        </Card>

        {/* Preview Area */}
        <Card className="p-0 flex flex-col items-center justify-center min-h-[400px] overflow-hidden bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 relative">
          
          {/* Decorative shapes behind glass */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="flex-1 w-full flex items-center justify-center p-8 z-10">
            <div className="p-8 shadow-lg flex items-center justify-center text-xl font-semibold text-white/80" 
                 style={{ 
                   width: 250, 
                   height: 250, 
                   borderRadius: 16, 
                   background: bgColor, 
                   backdropFilter: `blur(${blur}px)`,
                   WebkitBackdropFilter: `blur(${blur}px)`,
                   border: `1px solid ${outlineColor}` 
                 }}>
               Glass
            </div>
          </div>
          <div className="w-full h-40 relative z-10 border-t border-[rgba(255,255,255,0.2)]">
             <CodeEditor value={cssOutput} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
