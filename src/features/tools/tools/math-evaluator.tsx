"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import { evaluate } from "mathjs";

export function MathEvaluatorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "1.2 * (2 + 4.5)\n100 cm to m\nsin(45 deg) ^ 2");
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
        // Format functions or arrays to string
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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Math Expression Evaluator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Evaluate mathematical expressions, unit conversions, and functions line-by-line using <strong>mathjs</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium mb-3">Input Expressions</div>
          <CodeEditor
            className="min-h-[500px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="plaintext"
            options={{ lineNumbers: "on" }}
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Output Results</div>
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
            className="min-h-[500px]"
            value={output}
            language="plaintext"
            options={{ readOnly: true, lineNumbers: "on" }}
          />
        </div>
      </div>
    </main>
  );
}
