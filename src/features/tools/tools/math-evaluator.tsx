"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { evaluate } from "mathjs";
import { toast } from "sonner";

const DEFAULT_MATH = `1.2 * (2 + 4.5)
100 cm to m
sin(45 deg) ^ 2
sqrt(144) + 2^4
5.08 cm to inch
det([[-1, 2], [3, 1]])`;

export function MathEvaluatorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_MATH);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const calculate = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      return;
    }

    const lines = input.value.split("\n");
    const results = lines.map((line) => {
      if (!line.trim()) return "";
      try {
        const res = evaluate(line);
        if (typeof res === "function") return "Function";
        return String(res);
      } catch (err: any) {
        return `Error: ${err.message}`;
      }
    });

    setOutput(results.join("\n"));
  }, [input.value]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Evaluated results copied!");
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
          Real-time multi-line mathematical expression evaluation, units conversion, trigonometry, and matrices
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(DEFAULT_MATH)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Samples
        </Button>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Expressions (One per line)
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Evaluated Results
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
            language="plaintext"
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="plaintext"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
