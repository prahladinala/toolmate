"use client";
import { Label } from "@/components/ui/label";

import { Select } from "@/components/ui/select";


import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import * as he from "html-entities";
import { toast } from "sonner";

export function HtmlEntityEncoderTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    if (mode === "encode") {
      setOutput(he.encode(input.value));
    } else {
      setOutput(he.decode(input.value));
    }
  }, [input.value, mode]);

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
      <div className="mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center gap-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            Mode
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            >
              <option value="encode">Encode to HTML Entities</option>
              <option value="decode">Decode HTML Entities</option>
            </Select>
          </Label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col h-full">
          <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Input text</div>
          <CodeEditor
            className="min-h-[420px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="html"
            options={{ wordWrap: "on" }}
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Output</div>
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
            className="min-h-[420px]"
            value={output}
            language="html"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </div>
      </div>
    </main>
  );
}
