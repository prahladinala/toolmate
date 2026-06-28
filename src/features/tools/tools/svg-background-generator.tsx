"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

const PRESETS = [
  {
    name: "Polka Dots",
    pattern: `<pattern id="pattern" x="0" y="0" width="\${size}" height="\${size}" patternUnits="userSpaceOnUse">\n  <circle fill="\${color}" cx="\${size/2}" cy="\${size/2}" r="\${size/8}"></circle>\n</pattern>`,
  },
  {
    name: "Grid",
    pattern: `<pattern id="pattern" width="\${size}" height="\${size}" patternUnits="userSpaceOnUse">\n  <path d="M \${size} 0 L 0 0 0 \${size}" fill="none" stroke="\${color}" stroke-width="2"/>\n</pattern>`,
  },
  {
    name: "Diagonal Stripes",
    pattern: `<pattern id="pattern" width="\${size}" height="\${size}" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">\n  <line x1="0" y1="0" x2="0" y2="\${size}" stroke="\${color}" stroke-width="\${size/2}" />\n</pattern>`,
  },
];

export function SvgBackgroundGeneratorTool({ tool }: { tool: ToolDef }) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [patternColor, setPatternColor] = useState("#e5e7eb");
  const [size, setSize] = useState(40);
  const [opacity, setOpacity] = useState(100);

  const currentPreset = PRESETS[presetIdx];
  
  // Safely interpolate math for SVG strings
  const parsedPattern = currentPreset.pattern
    .replace(/\$\{size\}/g, String(size))
    .replace(/\$\{size\/2\}/g, String(size / 2))
    .replace(/\$\{size\/8\}/g, String(size / 8))
    .replace(/\$\{color\}/g, patternColor);

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    ${parsedPattern.split('\\n').join('\\n    ')}
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}" />
  <rect width="100%" height="100%" fill="url(#pattern)" opacity="${opacity / 100}" />
</svg>`;

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      alert("SVG copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">SVG Background Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Generate seamless, lightweight SVG background patterns for websites and apps.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Pattern Type</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p, i) => (
                <Button 
                  key={p.name} 
                  variant={i === presetIdx ? "primary" : "secondary"} 
                  onClick={() => setPresetIdx(i)}
                  size="sm"
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Background Color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Pattern Color</label>
              <input type="color" value={patternColor} onChange={(e) => setPatternColor(e.target.value)} className="w-full h-10 rounded cursor-pointer p-0 border-0" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Pattern Size</label>
              <span className="text-xs text-[rgb(var(--muted))]">{size}px</span>
            </div>
            <input type="range" min="10" max="200" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Pattern Opacity</label>
              <span className="text-xs text-[rgb(var(--muted))]">{opacity}%</span>
            </div>
            <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
          </div>
          
          <Button onClick={copySvg} className="w-full">Copy SVG Background</Button>
        </Card>

        <Card className="p-0 overflow-hidden flex flex-col h-full min-h-[400px] border border-[rgba(var(--border),0.5)]">
          <div className="h-64 sm:h-80 w-full" dangerouslySetInnerHTML={{ __html: svgCode }} />
          <div className="flex-1 relative border-t border-[rgb(var(--border))]">
             <CodeEditor
                value={svgCode}
                language="html"
                options={{ readOnly: true }}
                className="absolute inset-0"
             />
          </div>
        </Card>
      </div>
    </main>
  );
}
