"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

// Helper to lighten/darken hex color
function adjustColor(color: string, amount: number) {
  let usePound = false;
  if (color[0] == "#") {
      color = color.slice(1);
      usePound = true;
  }
  let R = parseInt(color.substring(0,2),16);
  let G = parseInt(color.substring(2,4),16);
  let B = parseInt(color.substring(4,6),16);

  R = R + amount;
  G = G + amount;
  B = B + amount;

  if (R > 255) R = 255;
  else if (R < 0) R = 0;

  if (G > 255) G = 255;
  else if (G < 0) G = 0;

  if (B > 255) B = 255;
  else if (B < 0) B = 0;

  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return (usePound?"#":"") + RR + GG + BB;
}

export function NeumorphismGeneratorTool({ tool }: { tool: ToolDef }) {
  const [size, setSize] = useState(250);
  const [radius, setRadius] = useState(50);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(40);
  const [shape, setShape] = useState<"flat" | "concave" | "convex" | "pressed">("flat");
  const [color, setColor] = useState("#e0e5ec");

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
      alert("CSS copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Neumorphism Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Generate soft-UI CSS shadows and highlights (Neumorphism / Soft UI).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Shape</label>
              <select value={shape} onChange={(e) => setShape(e.target.value as any)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                <option value="flat">Flat</option>
                <option value="pressed">Pressed</option>
                <option value="concave">Concave</option>
                <option value="convex">Convex</option>
              </select>
            </div>
          </div>

          {[
            { label: "Size", val: size, set: setSize, min: 50, max: 400 },
            { label: "Radius", val: radius, set: setRadius, min: 0, max: 200 },
            { label: "Distance", val: distance, set: setDistance, min: 1, max: 50 },
            { label: "Intensity", val: intensity, set: setIntensity, min: 1, max: 60 },
            { label: "Blur", val: blur, set: setBlur, min: 0, max: 100 },
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

        <Card className="p-0 flex flex-col items-center justify-center min-h-[400px] overflow-hidden" style={{ backgroundColor: color }}>
          <div className="flex-1 w-full flex items-center justify-center p-8">
            <div style={{ width: size, height: size, borderRadius: radius, background: background, boxShadow: boxShadow }} />
          </div>
          <div className="w-full h-40 relative border-t border-[rgba(0,0,0,0.1)]">
             <CodeEditor value={cssOutput} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
