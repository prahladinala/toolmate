"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import Papa from "papaparse";
import { toast } from "sonner";
import { Copy, Check, Play, AlertCircle, Sparkles, Trash2, Download } from "lucide-react";

const SAMPLE_CSV = `id,name,role,department,location
1,Prahlad Inala,Senior Architect,Engineering,India
2,Sarah Connor,DevOps Engineer,Infrastructure,USA
3,Alex Murphy,Product Designer,UX,UK`;

export function CsvToJsonTool({ tool }: { tool: ToolDef }) {
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
      const parsed = Papa.parse(input.value, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
      if (parsed.errors.length > 0) {
        throw new Error(parsed.errors[0].message);
      }
      setOutput(JSON.stringify(parsed.data, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to convert CSV to JSON.");
    }
  }, [input.value]);

  useEffect(() => {
    run();
  }, [run]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("JSON copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  };

  return (
    <ToolWorkspace>
      {/* TOOLBAR */}
      <ToolToolbar>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button onClick={run} size="sm" className="gap-1.5 shadow-sm">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Convert to JSON</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => input.setValue(SAMPLE_CSV)}
            className="text-xs sm:text-sm gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample CSV</span>
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
          Auto Type-Inference Enabled
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
              Input CSV Data
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input.value ? `${input.value.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Parsed JSON Array
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                onClick={downloadJson}
                disabled={!output}
                className="h-7 text-xs px-2 gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </Button>
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
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="plaintext"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="json"
            options={{ readOnly: true }}
          />
        }
      />
    </ToolWorkspace>
  );
}
