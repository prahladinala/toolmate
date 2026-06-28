"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

const CURSORS = [
  "auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait",
  "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop",
  "not-allowed", "grab", "grabbing", "all-scroll", "col-resize", "row-resize",
  "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize",
  "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out"
];

export function CssCursorGeneratorTool({ tool }: { tool: ToolDef }) {
  const [cursor, setCursor] = useState("pointer");
  const [customUrl, setCustomUrl] = useState("");

  const cssVal = customUrl ? `url('${customUrl}'), auto` : cursor;
  const cssOutput = `cursor: ${cssVal};`;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      alert("CSS copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CSS Cursor Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Test built-in browser cursors or use a custom image to generate CSS cursor properties.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">Standard Cursors</label>
            <select 
              value={customUrl ? "" : cursor} 
              onChange={(e) => {
                setCursor(e.target.value);
                setCustomUrl("");
              }} 
              className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
            >
              {CURSORS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Custom Image URL</label>
            <input 
              type="text" 
              placeholder="https://example.com/cursor.png"
              value={customUrl} 
              onChange={(e) => setCustomUrl(e.target.value)} 
              className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
            />
            <p className="text-xs text-[rgb(var(--muted))] mt-1">Leave blank to use standard cursors. Image must be accessible and ideally 32x32px.</p>
          </div>

          <Button onClick={copyCss} className="w-full">Copy CSS</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 bg-[rgba(var(--accent),0.05)] border-b border-[rgb(var(--border))]"
            style={{ cursor: cssVal }}
          >
            <div className="w-48 h-48 rounded-full border-4 border-dashed border-[rgba(var(--accent),0.5)] flex items-center justify-center pointer-events-none">
               <span className="text-center font-medium text-[rgb(var(--muted))]">Hover here to test!</span>
            </div>
          </div>
          <div className="h-40 relative">
             <CodeEditor value={cssOutput} language="css" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
