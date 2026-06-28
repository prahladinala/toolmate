"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CssGradientGeneratorTool({ tool }: { tool: ToolDef }) {
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#9333ea");
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [copied, setCopied] = useState(false);

  const cssStr = type === "linear" 
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`background: ${cssStr};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              Type
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </label>
            {type === "linear" && (
              <label className="flex items-center gap-2 text-sm font-medium">
                Angle ({angle}deg)
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-32"
                />
              </label>
            )}
          </div>

          <div className="flex gap-6 mb-8">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Color 1</span>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-16 h-16 cursor-pointer border-none rounded bg-transparent"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Color 2</span>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-16 h-16 cursor-pointer border-none rounded bg-transparent"
              />
            </label>
          </div>

          <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-4 font-mono text-sm">
            background: {cssStr};
          </div>
          <Button className="mt-4 w-full" onClick={copyToClipboard}>
            {copied ? "Copied CSS!" : "Copy CSS"}
          </Button>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] shadow-inner" style={{ background: cssStr, minHeight: "300px" }}>
        </div>
      </div>
    </main>
  );
}
