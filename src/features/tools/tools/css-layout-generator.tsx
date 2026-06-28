"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

export function CssLayoutGeneratorTool({ tool }: { tool: ToolDef }) {
  const [layoutType, setLayoutType] = useState<"flex" | "grid">("flex");

  // Flex settings
  const [flexDir, setFlexDir] = useState("row");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [gap, setGap] = useState(16);

  // Grid settings
  const [gridCols, setGridCols] = useState(3);
  const [gridRows, setGridRows] = useState(2);
  const [gridGap, setGridGap] = useState(16);

  const [copied, setCopied] = useState(false);

  const items = Array.from({ length: layoutType === "flex" ? 5 : gridCols * gridRows }, (_, i) => i + 1);

  const cssString = layoutType === "flex"
    ? `.container {\n  display: flex;\n  flex-direction: ${flexDir};\n  flex-wrap: ${flexWrap};\n  justify-content: ${justifyContent};\n  align-items: ${alignItems};\n  gap: ${gap}px;\n}`
    : `.container {\n  display: grid;\n  grid-template-columns: repeat(${gridCols}, 1fr);\n  grid-template-rows: repeat(${gridRows}, 1fr);\n  gap: ${gridGap}px;\n}`;

  const copyToClipboard = async () => {
    if (!cssString) return;
    try {
      await navigator.clipboard.writeText(cssString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CSS Layout Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Visually build CSS Flexbox and Grid layouts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Controls */}
        <Card className="p-6 lg:col-span-4 space-y-6">
          <div className="flex gap-2">
            <Button className="flex-1" variant={layoutType === "flex" ? "primary" : "secondary"} onClick={() => setLayoutType("flex")}>Flexbox</Button>
            <Button className="flex-1" variant={layoutType === "grid" ? "primary" : "secondary"} onClick={() => setLayoutType("grid")}>Grid</Button>
          </div>

          {layoutType === "flex" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">flex-direction</label>
                <select value={flexDir} onChange={(e) => setFlexDir(e.target.value)} className="mt-1 w-full rounded border p-2 text-sm">
                  <option value="row">row</option>
                  <option value="row-reverse">row-reverse</option>
                  <option value="column">column</option>
                  <option value="column-reverse">column-reverse</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">flex-wrap</label>
                <select value={flexWrap} onChange={(e) => setFlexWrap(e.target.value)} className="mt-1 w-full rounded border p-2 text-sm">
                  <option value="nowrap">nowrap</option>
                  <option value="wrap">wrap</option>
                  <option value="wrap-reverse">wrap-reverse</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">justify-content</label>
                <select value={justifyContent} onChange={(e) => setJustifyContent(e.target.value)} className="mt-1 w-full rounded border p-2 text-sm">
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="space-between">space-between</option>
                  <option value="space-around">space-around</option>
                  <option value="space-evenly">space-evenly</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">align-items</label>
                <select value={alignItems} onChange={(e) => setAlignItems(e.target.value)} className="mt-1 w-full rounded border p-2 text-sm">
                  <option value="stretch">stretch</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">gap ({gap}px)</label>
                <input type="range" min={0} max={64} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="mt-2 w-full" />
              </div>
            </div>
          )}

          {layoutType === "grid" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Columns ({gridCols})</label>
                <input type="range" min={1} max={12} value={gridCols} onChange={(e) => setGridCols(Number(e.target.value))} className="mt-2 w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">Rows ({gridRows})</label>
                <input type="range" min={1} max={12} value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} className="mt-2 w-full" />
              </div>
              <div>
                <label className="text-sm font-medium">gap ({gridGap}px)</label>
                <input type="range" min={0} max={64} value={gridGap} onChange={(e) => setGridGap(Number(e.target.value))} className="mt-2 w-full" />
              </div>
            </div>
          )}
        </Card>

        {/* Preview & Code */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="p-6 flex-1 min-h-[300px] overflow-hidden bg-[rgb(var(--card-2))]">
            <div className="font-medium mb-4">Live Preview</div>
            <div
              className="border border-dashed border-[rgb(var(--border))] rounded h-full min-h-[400px] w-full p-2 bg-[rgb(var(--card))]"
              style={{
                display: layoutType,
                ...(layoutType === "flex" ? {
                  flexDirection: flexDir as any,
                  flexWrap: flexWrap as any,
                  justifyContent,
                  alignItems,
                  gap: `${gap}px`,
                } : {
                  gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                  gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                  gap: `${gridGap}px`,
                })
              }}
            >
              {items.map(item => (
                <div key={item} className="bg-[rgb(var(--accent))] bg-opacity-20 border border-[rgb(var(--accent))] rounded flex items-center justify-center font-bold text-[rgb(var(--accent))] min-h-[60px] min-w-[60px] p-4 transition-all">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))]">
              <div className="font-medium">CSS Code</div>
              <Button size="sm" variant="secondary" onClick={copyToClipboard}>
                <motion.span
                  key={copied ? "copied" : "copy"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </motion.span>
              </Button>
            </div>
            <CodeEditor
              className="h-[200px]"
              value={cssString}
              language="css"
              options={{ readOnly: true }}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
