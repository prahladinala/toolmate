"use client";
import { Label } from "@/components/ui/label";

import { Select } from "@/components/ui/select";


import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import * as yaml from "js-yaml";
import { toast } from "sonner";

export function YamlFormatterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = yaml.load(input.value);
      const formatted = yaml.dump(parsed, { indent });
      setOutput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid YAML");
    }
  }, [input.value, indent]);

  useEffect(() => {
    format();
  }, [format]);

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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Label className="text-sm font-medium">Indent:</Label>
        <Select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="rounded border p-1 text-sm bg-[rgb(var(--card-2))]"
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </Select>
        <Button size="sm" onClick={format}>Format</Button>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm text-red-500 whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col h-full">
          <div className="font-medium mb-3">Input YAML</div>
          <CodeEditor
            className="min-h-[500px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="yaml"
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Formatted Output</div>
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
            language="yaml"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
