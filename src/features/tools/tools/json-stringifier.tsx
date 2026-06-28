"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

type Mode = "stringify" | "parse";

export function JsonStringifierTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
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
        // Parse the input JSON to ensure it's valid before stringifying
        const parsed = JSON.parse(input.value);
        setOutput(JSON.stringify(JSON.stringify(parsed))); // Double stringify to get the escaped string
      } else {
        // First parse unescapes the string, but we might need to parse twice depending on input
        let parsed = JSON.parse(input.value);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Mode Toggle */}
      <Card className="mb-6 p-4">
        <div className="flex gap-3">
          <Button
            variant={mode === "stringify" ? "primary" : "secondary"}
            onClick={() => setMode("stringify")}
          >
            Stringify Object
          </Button>
          <Button
            variant={mode === "parse" ? "primary" : "secondary"}
            onClick={() => setMode("parse")}
          >
            Parse Stringified
          </Button>
        </div>
      </Card>

      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm text-red-500 whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium mb-3">Input {mode === "stringify" ? "JSON Object" : "Stringified JSON"}</div>
          <CodeEditor
            className="min-h-[400px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language={mode === "stringify" ? "json" : "plaintext"}
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Output {mode === "stringify" ? "Stringified JSON" : "JSON Object"}</div>
            <Button size="sm" variant="secondary" onClick={copyToClipboard} disabled={!output}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </motion.span>
            </Button>
          </div>
          <CodeEditor
            className="min-h-[400px]"
            value={output}
            language={mode === "stringify" ? "plaintext" : "json"}
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
