"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

export function CssBoxShadowTool({ tool }: { tool: ToolDef }) {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [color, setColor] = useState("rgba(0,0,0,0.15)");
  const [inset, setInset] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#ffffff");

  const cssStr = `${inset ? "inset " : ""}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}`;
  const cssOutput = `box-shadow: ${cssStr};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      alert("CSS copied to clipboard!");
    } catch (e) {}
  };

  const addLayer = () => {
    // Advanced: multi-layered box shadow could be added here, but keeping it simple for now as requested.
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Box Shadow Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Visually build perfect CSS box shadows with live preview.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-[rgb(var(--border))]">
             <div>
              <label className="text-sm font-medium block mb-1">Canvas Color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 rounded cursor-pointer p-0 border-0" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Box Color</label>
              <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-full h-8 rounded cursor-pointer p-0 border-0" />
            </div>
          </div>

          {[
            { label: "Horizontal Offset", val: hOffset, set: setHOffset, min: -100, max: 100 },
            { label: "Vertical Offset", val: vOffset, set: setVOffset, min: -100, max: 100 },
            { label: "Blur Radius", val: blur, set: setBlur, min: 0, max: 150 },
            { label: "Spread Radius", val: spread, set: setSpread, min: -50, max: 100 },
          ].map((slider) => (
            <div key={slider.label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-xs text-[rgb(var(--muted))]">{slider.val}px</span>
              </div>
              <input type="range" min={slider.min} max={slider.max} value={slider.val} onChange={(e) => slider.set(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
          ))}

          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-1">Shadow Color (RGBA/Hex)</label>
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="inset" checked={inset} onChange={(e) => setInset(e.target.checked)} className="w-4 h-4 accent-[rgb(var(--accent))]" />
              <label htmlFor="inset" className="text-sm font-medium cursor-pointer">Inset</label>
            </div>
          </div>
          
          <Button onClick={copyCss} className="w-full mt-4">Copy CSS</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div 
             className="flex-1 flex items-center justify-center p-8 overflow-hidden transition-colors"
             style={{ backgroundColor: bgColor }}
          >
             <div 
               className="w-48 h-48 rounded-xl flex items-center justify-center text-sm font-medium opacity-90 transition-all duration-200"
               style={{ 
                 backgroundColor: boxColor, 
                 boxShadow: cssStr,
                 color: boxColor === "#ffffff" ? "#000" : "#fff" 
               }}
             >
               Preview
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
