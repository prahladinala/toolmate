"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const DIRECTIONS = [
  { label: "to right", value: "to-r", deg: "90deg" },
  { label: "to left", value: "to-l", deg: "270deg" },
  { label: "to top", value: "to-t", deg: "0deg" },
  { label: "to bottom", value: "to-b", deg: "180deg" },
  { label: "to top right", value: "to-tr", deg: "45deg" },
  { label: "to top left", value: "to-tl", deg: "315deg" },
  { label: "to bottom right", value: "to-br", deg: "135deg" },
  { label: "to bottom left", value: "to-bl", deg: "225deg" },
];

export function TailwindTextGradientTool({ tool }: { tool: ToolDef }) {
  const [direction, setDirection] = useState("to-r");
  const [from, setFrom] = useState("#3b82f6");
  const [via, setVia] = useState("");
  const [to, setTo] = useState("#8b5cf6");
  const [text, setText] = useState("Modern Typography Gradient");
  const [copied, setCopied] = useState(false);

  const activeDir = DIRECTIONS.find((d) => d.value === direction) || DIRECTIONS[0];

  const buildClass = () => {
    let cls = `bg-gradient-${direction}`;
    cls += ` from-[${from}]`;
    if (via) cls += ` via-[${via}]`;
    cls += ` to-[${to}]`;
    cls += ` bg-clip-text text-transparent`;
    return cls;
  };

  const cssClass = buildClass();

  // Inline CSS gradient for guaranteed live preview
  const liveGradient = via
    ? `linear-gradient(${activeDir.deg}, ${from}, ${via}, ${to})`
    : `linear-gradient(${activeDir.deg}, ${from}, ${to})`;

  const copyClass = async () => {
    try {
      await navigator.clipboard.writeText(cssClass);
      toast.success("Tailwind CSS classes copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReset = () => {
    setDirection("to-r");
    setFrom("#3b82f6");
    setVia("");
    setTo("#8b5cf6");
    setText("Modern Typography Gradient");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Visually build stunning gradient headings using Tailwind arbitrary value utilities
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Defaults
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Preview Text
            </label>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-xs font-medium h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
              Gradient Direction
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DIRECTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDirection(d.value)}
                  className={`py-1.5 px-2.5 rounded-xl text-xs font-medium transition-all text-center ${
                    direction === d.value
                      ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] shadow-sm"
                      : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[rgb(var(--border))]">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                From
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-[11px] font-mono truncate">{from}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Via (Opt)
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={via || "#ffffff"}
                  onChange={(e) => setVia(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <button
                  type="button"
                  onClick={() => setVia("")}
                  className="text-[10px] text-[rgb(var(--muted))] hover:text-red-500"
                  title="Clear middle color"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                To
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-[11px] font-mono truncate">{to}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Canvas & Output */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-6 sm:p-8 text-center overflow-hidden">
            <h2
              className="text-3xl sm:text-5xl font-extrabold tracking-tight select-none break-words max-w-full"
              style={{
                backgroundImage: liveGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {text || "Sample Heading"}
            </h2>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Tailwind Utility Classes
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyClass}
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
                    Copy Classes
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={cssClass}
              language="html"
              editable={false}
              minHeight="min-h-[100px]"
              options={{ wordWrap: "on" }}
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
