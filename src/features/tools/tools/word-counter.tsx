"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_TEXT = `ToolMate provides free, private, browser-based utilities designed for developers, designers, and digital creators.

Write or paste your article, blog post, code snippet, or essay here to inspect exact word count, character count (with and without spaces), lines, and payload size in bytes.`;

export function WordCounterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const [stats, setStats] = useState({
    chars: 0,
    words: 0,
    lines: 0,
    bytes: 0,
    charsNoSpace: 0,
    readingTimeMinutes: 0,
  });

  useEffect(() => {
    const val = input.value || "";
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    setStats({
      chars: val.length,
      words: words,
      lines: val === "" ? 0 : val.split(/\r\n|\r|\n/).length,
      bytes: new Blob([val]).size,
      charsNoSpace: val.replace(/\s+/g, "").length,
      readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    });
  }, [input.value]);

  const copyText = async () => {
    if (!input.value) return;
    try {
      await navigator.clipboard.writeText(input.value);
      toast.success("Text copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const statCards = [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Characters", value: stats.chars.toLocaleString() },
    { label: "No Spaces", value: stats.charsNoSpace.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Size (Bytes)", value: stats.bytes.toLocaleString() },
    { label: "Est. Read Time", value: `${stats.readingTimeMinutes} min` },
  ];

  return (
    <ToolWorkspace maxWidth="wide">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm text-center flex flex-col justify-center transition-transform hover:-translate-y-0.5"
          >
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[rgb(var(--muted))] mb-1">
              {card.label}
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[rgb(var(--fg))]">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Editor Controls */}
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Live real-time text metrics updated on every keystroke
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyText}
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
                Copy Text
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue("")}
            className="text-xs"
          >
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue(SAMPLE_TEXT)}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </ToolToolbar>

      {/* Text Area */}
      <div className="flex flex-col min-w-0 w-full space-y-2">
        <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
          Document Content
        </span>
        <CodeEditor
          value={input.value}
          onChange={(val) => input.setValue(val || "")}
          language="plaintext"
          minHeight="min-h-[350px] sm:min-h-[460px]"
          options={{ wordWrap: "on" }}
        />
      </div>
    </ToolWorkspace>
  );
}
