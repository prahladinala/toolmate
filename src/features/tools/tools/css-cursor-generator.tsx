"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, MousePointer } from "lucide-react";
import { toast } from "sonner";

const CURSORS = [
  "pointer", "default", "crosshair", "move", "grab", "grabbing", "text", "wait",
  "not-allowed", "zoom-in", "zoom-out", "help", "all-scroll", "col-resize", "row-resize",
  "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize"
];

export function CssCursorGeneratorTool({ tool }: { tool: ToolDef }) {
  const [cursor, setCursor] = useState("pointer");
  const [customUrl, setCustomUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const cssVal = customUrl ? `url('${customUrl}'), auto` : cursor;
  const cssOutput = `cursor: ${cssVal};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      toast.success("Cursor CSS copied!");
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
          Inspect native browser cursors or test custom graphic URLs live
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={copyCss}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy CSS
            </>
          )}
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Cursor Selection */}
        <div className="lg:col-span-6 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-2">
              Standard Cursors
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURSORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  style={{ cursor: c }}
                  onClick={() => {
                    setCursor(c);
                    setCustomUrl("");
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all text-left truncate ${
                    !customUrl && cursor === c
                      ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] shadow-sm"
                      : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[rgb(var(--border))] space-y-2">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Custom Cursor URL
            </label>
            <Input
              type="text"
              placeholder="https://example.com/cursor.png"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            />
            <p className="text-[11px] text-[rgb(var(--muted))]">
              Recommended: 32×32px PNG or SVG with transparent background.
            </p>
          </div>
        </div>

        {/* Hover Playground */}
        <div className="lg:col-span-6 flex flex-col min-w-0 space-y-6">
          <div
            className="w-full min-h-[260px] sm:min-h-[320px] rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center p-8 text-center transition-colors select-none"
            style={{ cursor: cssVal }}
          >
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
              <MousePointer className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm font-semibold text-[rgb(var(--fg))]">
              Hover over this entire canvas
            </p>
            <p className="text-xs text-[rgb(var(--muted))] mt-1">
              Active cursor: <span className="font-mono font-semibold text-indigo-500">{cssVal}</span>
            </p>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              CSS Code
            </span>
            <CodeEditor
              value={cssOutput}
              language="css"
              editable={false}
              minHeight="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
