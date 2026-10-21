"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import * as prettier from "prettier/standalone";
import * as parserHtml from "prettier/plugins/html";
import { toast } from "sonner";
import { Copy, Check, Play, AlertCircle, Sparkles, Trash2 } from "lucide-react";

const SAMPLE_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>ToolMate</title><style>body{font-family:sans-serif;background:#0d1117;color:#fff}</style></head><body><div class="container"><h1>Hello World</h1><p>Fast, client-side developer utilities.</p><button id="btn" onclick="alert('Clicked!')">Click Me</button></div></body></html>`;

export function HtmlFormatterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = useCallback(async () => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const formatted = await prettier.format(input.value, {
        parser: "html",
        plugins: [parserHtml],
        printWidth: 80,
      });
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to format HTML.");
    }
  }, [input.value]);

  useEffect(() => {
    run();
  }, [run]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ToolWorkspace>
      {/* TOOLBAR */}
      <ToolToolbar>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button onClick={run} size="sm" className="gap-1.5 shadow-sm">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Format</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => input.setValue(SAMPLE_HTML)}
            className="text-xs sm:text-sm gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              input.setValue("");
              setOutput("");
              setError(null);
            }}
            className="text-xs sm:text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        <span className="text-xs text-[rgb(var(--muted))]">
          Formatted with Prettier Engine (Client-side)
        </span>
      </ToolToolbar>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-mono break-words-safe">{error}</div>
        </div>
      )}

      {/* SPLIT PANE */}
      <ToolSplitPane
        hasOutput={Boolean(output)}
        inputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Input HTML
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input.value ? `${input.value.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Formatted HTML
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
              className="h-7 text-xs px-2.5 gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="html"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="html"
            options={{ readOnly: true }}
          />
        }
      />
    </ToolWorkspace>
  );
}
