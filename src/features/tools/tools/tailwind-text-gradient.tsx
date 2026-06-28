"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

const DIRECTIONS = [
  { label: "Right", value: "to-r" },
  { label: "Left", value: "to-l" },
  { label: "Top", value: "to-t" },
  { label: "Bottom", value: "to-b" },
  { label: "Top Right", value: "to-tr" },
  { label: "Top Left", value: "to-tl" },
  { label: "Bottom Right", value: "to-br" },
  { label: "Bottom Left", value: "to-bl" },
];

export function TailwindTextGradientTool({ tool }: { tool: ToolDef }) {
  const [direction, setDirection] = useState("to-r");
  const [from, setFrom] = useState("#3b82f6");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("#8b5cf6");
  const [text, setText] = useState("Tailwind Gradients");

  const buildClass = () => {
    let cls = `bg-gradient-${direction}`;
    cls += ` from-[${from}]`;
    if (via) cls += ` via-[${via}]`;
    cls += ` to-[${to}]`;
    cls += ` bg-clip-text text-transparent`;
    return cls;
  };

  const cssClass = buildClass();

  const copyClass = async () => {
    try {
      await navigator.clipboard.writeText(cssClass);
      alert("Tailwind class copied!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tailwind Text Gradient Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Visually build stunning text gradients utilizing Tailwind CSS arbitrary values.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">Preview Text</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="w-full rounded border p-2 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Direction</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
              {DIRECTIONS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">From</label>
              <input type="color" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Via (Optional)</label>
              <input type="color" value={via || "#ffffff"} onChange={(e) => setVia(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
              <Button size="sm" variant="ghost" onClick={() => setVia("")} className="mt-1 w-full text-xs h-6">Clear</Button>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">To</label>
              <input type="color" value={to} onChange={(e) => setTo(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
            </div>
          </div>
          
          <Button onClick={copyClass} className="w-full">Copy Tailwind Classes</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8 bg-[rgb(var(--card-2))]">
            <h2 
              className="text-5xl sm:text-7xl font-extrabold text-center"
              style={{
                backgroundImage: `linear-gradient(${
                  direction === 'to-r' ? 'to right' :
                  direction === 'to-l' ? 'to left' :
                  direction === 'to-t' ? 'to top' :
                  direction === 'to-b' ? 'to bottom' :
                  direction === 'to-tr' ? 'to top right' :
                  direction === 'to-br' ? 'to bottom right' :
                  direction === 'to-tl' ? 'to top left' :
                  'to bottom left'
                }, ${from}, ${via ? via + ',' : ''} ${to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {text || "Sample"}
            </h2>
          </div>
          <div className="p-4 border-t border-[rgb(var(--border))] font-mono text-sm text-[rgb(var(--accent))] break-all bg-[rgba(var(--accent),0.05)]">
            {cssClass}
          </div>
        </Card>
      </div>
    </main>
  );
}
