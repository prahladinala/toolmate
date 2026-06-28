"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
// @ts-ignore
import blobshape from "blobshape";

export function BlobGeneratorTool({ tool }: { tool: ToolDef }) {
  const [edges, setEdges] = useState(6);
  const [growth, setGrowth] = useState(5);
  const [color, setColor] = useState("#3b82f6");
  const [seed, setSeed] = useState<string | null>(null);
  
  const [path, setPath] = useState("");
  
  const generateBlob = useCallback(() => {
    // blobshape takes size, growth (1-10), edges (3-20), seed (string|null)
    const res = blobshape({ size: 400, growth, edges, seed });
    setPath(res.path);
  }, [edges, growth, seed]);

  useEffect(() => {
    generateBlob();
  }, [generateBlob]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(2, 8));
  };

  const svgCode = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">\n  <path fill="${color}" d="${path}" />\n</svg>`;

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      alert("SVG copied to clipboard!");
    } catch (e) {
      // ignore
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">SVG Blob Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Create smooth, organic, and random SVG blob shapes for your next web design.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Edges (Complexity)</label>
              <span className="text-xs text-[rgb(var(--muted))]">{edges}</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              value={edges}
              onChange={(e) => setEdges(Number(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Growth (Smoothness)</label>
              <span className="text-xs text-[rgb(var(--muted))]">{growth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={growth}
              onChange={(e) => setGrowth(Number(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer p-0 border-0"
              />
              <span className="text-sm font-mono">{color}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleRandomize} variant="secondary" className="flex-1">Randomize Shape</Button>
            <Button onClick={copySvg} className="flex-1">Copy SVG</Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 flex flex-col items-center justify-center bg-[rgb(var(--card-2))] min-h-[400px]">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center bg-white rounded-xl shadow-sm border border-[rgba(var(--border),0.5)] overflow-hidden">
            <motion.svg
              viewBox="0 0 400 400"
              className="w-full h-full p-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d={path}
                fill={color}
                animate={{ d: path, fill: color }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            </motion.svg>
          </div>
        </Card>
      </div>
    </main>
  );
}
