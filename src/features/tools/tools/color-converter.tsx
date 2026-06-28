"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";

export function ColorConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "#3b82f6");
  
  const [hex, setHex] = useState("");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");

  useEffect(() => {
    const val = input.value.trim();
    if (!val) return;
    
    // Very basic parsing for demo
    let ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = val;
    const computed = ctx.fillStyle; // usually returns hex or rgba
    setHex(computed);

    // To get RGB, we can do a trick
    ctx.clearRect(0,0,1,1);
    ctx.fillRect(0,0,1,1);
    const data = ctx.getImageData(0,0,1,1).data;
    setRgb(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);

    // convert to hsl
    let r = data[0]/255, g = data[1]/255, b = data[2]/255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);

  }, [input.value]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
        <h2 className="mb-4 text-xl font-medium">Color Picker & Converter</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <input
            type="color"
            value={hex}
            onChange={(e) => input.setValue(e.target.value)}
            className="w-24 h-24 cursor-pointer border-none bg-transparent rounded-lg"
          />
          <input
            type="text"
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-4 py-3 font-mono text-xl uppercase"
            placeholder="#FFFFFF or rgb(255,255,255)"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 text-center">
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">HEX</div>
          <div className="font-mono text-lg">{hex.toUpperCase()}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">RGB</div>
          <div className="font-mono text-lg">{rgb}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">HSL</div>
          <div className="font-mono text-lg">{hsl}</div>
        </div>
      </div>
    </main>
  );
}
