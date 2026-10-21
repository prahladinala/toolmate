"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { parseRobustJSON } from "@/lib/json/json-utils";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Mode = "stringify" | "parse";

const SAMPLE_JSON = JSON.stringify(
  {
    message: "Hello World!",
    status: "success",
    timestamp: 1711000000,
    features: ["fast", "safe"],
  },
  null,
  2
);

export function JsonStringifierTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, SAMPLE_JSON);
  const [mode, setMode] = useState<Mode>("stringify");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processJson = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      if (mode === "stringify") {
        const parsed = parseRobustJSON(input.value);
        setOutput(JSON.stringify(JSON.stringify(parsed)));
      } else {
        let parsed = parseRobustJSON(input.value);
        if (typeof parsed === "string") {
          try {
            parsed = parseRobustJSON(parsed);
          } catch {
            // Keep as string
          }
        }
        setOutput(JSON.stringify(parsed, null, 2));
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} JSON.`);
    }
  }, [input.value, mode]);

  useEffect(() => {
    processJson();
  }, [processJson]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "stringify" ? "primary" : "secondary"}
            onClick={() => setMode("stringify")}
            className="text-xs"
          >
            Escape & Stringify
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "parse" ? "primary" : "secondary"}
            onClick={() => setMode("parse")}
            className="text-xs"
          >
            Unescape & Format
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(SAMPLE_JSON)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Sample
        </Button>
      </ToolToolbar>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Input {mode === "stringify" ? "JSON Object" : "Escaped JSON String"}
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              {mode === "stringify" ? "Escaped String" : "Parsed JSON Object"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
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
                  Copy
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language={mode === "stringify" ? "json" : "plaintext"}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language={mode === "stringify" ? "plaintext" : "json"}
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
