"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

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
  
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?auto=format&fit=crop&w=800&q=80");

  const filters = [];
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
  const cssOutput = `filter: ${filterValue};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      alert("CSS copied to clipboard!");
    } catch (e) {}
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CSS Filter Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Apply visual effects like blur, brightness, and contrast to images via CSS filters.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Test Image URL</label>
            <input 
              type="text" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button size="sm" variant="ghost" onClick={handleReset}>Reset Filters</Button>
          </div>

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
            <div key={slider.label}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-xs text-[rgb(var(--muted))]">{slider.val}{slider.unit}</span>
              </div>
              <input type="range" min={slider.min} max={slider.max} value={slider.val} onChange={(e) => slider.set(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
            </div>
          ))}
          
          <Button onClick={copyCss} className="w-full mt-4">Copy CSS</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-6 bg-[rgb(var(--card-2))] overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={imageUrl} 
               alt="Test" 
               className="max-w-full max-h-[400px] object-cover rounded-lg shadow-md"
               style={{ filter: filterValue }}
             />
          </div>
          <div className="h-40 relative border-t border-[rgb(var(--border))]">
             <CodeEditor value={cssOutput} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
