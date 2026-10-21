"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Dices } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
// @ts-ignore
import blobshape from "blobshape";

export function BlobGeneratorTool({ tool }: { tool: ToolDef }) {
  const [edges, setEdges] = useState(6);
  const [growth, setGrowth] = useState(5);
  const [color, setColor] = useState("#3b82f6");
  const [seed, setSeed] = useState<string | null>(null);
  const [path, setPath] = useState("");
  const [copied, setCopied] = useState(false);

  const generateBlob = useCallback(() => {
    try {
      const res = blobshape({ size: 400, growth, edges, seed });
      setPath(res.path);
    } catch {
      // fallback
    }
  }, [edges, growth, seed]);

  useEffect(() => {
    generateBlob();
  }, [generateBlob]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(2, 8));
  };

  const svgCode = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <path fill="${color}" d="${path}" />
</svg>`;

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      toast.success("SVG Blob copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Create smooth, organic, mathematical vector SVG blobs with randomized seeds
        </span>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={handleRandomize}
          className="text-xs"
        >
          <Dices className="w-3.5 h-3.5 mr-1" />
          Randomize Shape
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="pb-3 border-b border-[rgb(var(--border))]">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
              Fill Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
              />
              <span className="text-xs font-mono">{color}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Edges (Complexity)</span>
                <span className="font-mono text-[rgb(var(--muted))]">{edges}</span>
              </div>
              <input
                type="range"
                min="3"
                max="18"
                value={edges}
                onChange={(e) => setEdges(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Growth (Smoothness)</span>
                <span className="font-mono text-[rgb(var(--muted))]">{growth}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[300px] sm:min-h-[340px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-6 overflow-hidden">
            <div className="w-60 h-60 sm:w-72 sm:h-72 max-w-full max-h-full flex items-center justify-center">
              <motion.svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d={path}
                  fill={color}
                  animate={{ d: path, fill: color }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              </motion.svg>
            </div>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated SVG Markup
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copySvg}
                className="text-xs h-7 px-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy SVG
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={svgCode}
              language="html"
              editable={false}
              minHeight="min-h-[140px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
