"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function CssLayoutGeneratorTool({ tool }: { tool: ToolDef }) {
  const [layoutType, setLayoutType] = useState<"flex" | "grid">("flex");

  // Flex settings
  const [flexDir, setFlexDir] = useState("row");
  const [flexWrap, setFlexWrap] = useState("wrap");
  const [justifyContent, setJustifyContent] = useState("space-between");
  const [alignItems, setAlignItems] = useState("center");
  const [gap, setGap] = useState(16);

  // Grid settings
  const [gridCols, setGridCols] = useState(3);
  const [gridRows, setGridRows] = useState(2);
  const [gridGap, setGridGap] = useState(16);

  const [copied, setCopied] = useState(false);

  const itemCount = layoutType === "flex" ? 6 : gridCols * gridRows;
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);

  const cssString =
    layoutType === "flex"
      ? `.flex-container {
  display: flex;
  flex-direction: ${flexDir};
  flex-wrap: ${flexWrap};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  gap: ${gap}px;
}`
      : `.grid-container {
  display: grid;
  grid-template-columns: repeat(${gridCols}, 1fr);
  grid-template-rows: repeat(${gridRows}, 1fr);
  gap: ${gridGap}px;
}`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssString);
      toast.success("Layout CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    if (layoutType === "flex") {
      setFlexDir("row");
      setFlexWrap("wrap");
      setJustifyContent("space-between");
      setAlignItems("center");
      setGap(16);
    } else {
      setGridCols(3);
      setGridRows(2);
      setGridGap(16);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={layoutType === "flex" ? "primary" : "secondary"}
            onClick={() => setLayoutType("flex")}
            className="text-xs"
          >
            Flexbox Layout
          </Button>
          <Button
            type="button"
            size="sm"
            variant={layoutType === "grid" ? "primary" : "secondary"}
            onClick={() => setLayoutType("grid")}
            className="text-xs"
          >
            CSS Grid Layout
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Layout
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          {layoutType === "flex" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Direction
                  </label>
                  <Select
                    value={flexDir}
                    onChange={(e) => setFlexDir(e.target.value)}
                    className="text-xs h-9 bg-[rgb(var(--card-2))]"
                  >
                    <option value="row">row</option>
                    <option value="column">column</option>
                    <option value="row-reverse">row-reverse</option>
                    <option value="column-reverse">column-reverse</option>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Wrap
                  </label>
                  <Select
                    value={flexWrap}
                    onChange={(e) => setFlexWrap(e.target.value)}
                    className="text-xs h-9 bg-[rgb(var(--card-2))]"
                  >
                    <option value="wrap">wrap</option>
                    <option value="nowrap">nowrap</option>
                    <option value="wrap-reverse">wrap-reverse</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Justify Content
                  </label>
                  <Select
                    value={justifyContent}
                    onChange={(e) => setJustifyContent(e.target.value)}
                    className="text-xs h-9 bg-[rgb(var(--card-2))]"
                  >
                    <option value="flex-start">flex-start</option>
                    <option value="center">center</option>
                    <option value="flex-end">flex-end</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="space-evenly">space-evenly</option>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Align Items
                  </label>
                  <Select
                    value={alignItems}
                    onChange={(e) => setAlignItems(e.target.value)}
                    className="text-xs h-9 bg-[rgb(var(--card-2))]"
                  >
                    <option value="stretch">stretch</option>
                    <option value="flex-start">flex-start</option>
                    <option value="center">center</option>
                    <option value="flex-end">flex-end</option>
                    <option value="baseline">baseline</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                    Gap Size
                  </span>
                  <span className="font-mono text-[rgb(var(--fg))]">{gap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={gap}
                  onChange={(e) => setGap(Number(e.target.value))}
                  className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Grid Columns ({gridCols})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={gridCols}
                    onChange={(e) => setGridCols(Number(e.target.value))}
                    className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                    Grid Rows ({gridRows})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={gridRows}
                    onChange={(e) => setGridRows(Number(e.target.value))}
                    className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                    Grid Gap
                  </span>
                  <span className="font-mono text-[rgb(var(--fg))]">{gridGap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={gridGap}
                  onChange={(e) => setGridGap(Number(e.target.value))}
                  className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Visual Container & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-4 sm:p-6 overflow-auto scrollbar-refined flex flex-col justify-center">
            {layoutType === "flex" ? (
              <div
                className="w-full min-h-[220px] rounded-xl border border-dashed border-[rgb(var(--border))] p-4 bg-[rgb(var(--card))] transition-all"
                style={{
                  display: "flex",
                  flexDirection: flexDir as any,
                  flexWrap: flexWrap as any,
                  justifyContent,
                  alignItems,
                  gap: `${gap}px`,
                }}
              >
                {items.map((num) => (
                  <div
                    key={num}
                    className="px-4 py-3 min-w-[70px] rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-semibold text-xs flex items-center justify-center select-none shadow-xs"
                  >
                    #{num}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="w-full min-h-[220px] rounded-xl border border-dashed border-[rgb(var(--border))] p-4 bg-[rgb(var(--card))] transition-all"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                  gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                  gap: `${gridGap}px`,
                }}
              >
                {items.map((num) => (
                  <div
                    key={num}
                    className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 font-semibold text-xs flex items-center justify-center select-none shadow-xs min-h-[60px]"
                  >
                    #{num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated CSS
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyCss}
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
                    Copy CSS
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={cssString}
              language="css"
              editable={false}
              minHeight="min-h-[140px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
