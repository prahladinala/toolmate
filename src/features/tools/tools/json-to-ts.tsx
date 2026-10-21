"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import JsonToTS from "json-to-ts";
import { parseRobustJSON } from "@/lib/json/json-utils";
import { toast } from "sonner";
import { Copy, Check, Play, AlertCircle, Sparkles, Trash2 } from "lucide-react";

const SAMPLE_JSON = `{
  "userId": 101,
  "username": "prahladinala",
  "profile": {
    "displayName": "Prahlad Inala",
    "avatarUrl": "https://toolmate.co.in/avatar.png",
    "isVerified": true
  },
  "roles": ["admin", "developer"],
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}`;

export function JsonToTsTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = parseRobustJSON(input.value);
      const tsInterfaces = JsonToTS(parsed).join("\n\n");
      setOutput(tsInterfaces);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to generate TypeScript interfaces.");
    }
  }, [input.value]);

  useEffect(() => {
    run();
  }, [run]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("TypeScript interfaces copied!");
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
            <span>Generate Types</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => input.setValue(SAMPLE_JSON)}
            className="text-xs sm:text-sm gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample JSON</span>
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
          Strict TypeScript Type-Generation Engine
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
              Input JSON Payload
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input.value ? `${input.value.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Generated TypeScript Interfaces
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
            language="json"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="typescript"
            options={{ readOnly: true }}
          />
        }
      />
    </ToolWorkspace>
  );
}
