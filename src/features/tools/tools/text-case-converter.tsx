"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function TextCaseConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("lowercase");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    const val = input.value;
    switch(mode) {
      case "lowercase": setOutput(val.toLowerCase()); break;
      case "uppercase": setOutput(val.toUpperCase()); break;
      case "camelCase": 
        setOutput(val.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''));
        break;
      case "snake_case":
        setOutput(val.replace(/\W+/g, " ").split(/ |\B(?=[A-Z])/).map(w => w.toLowerCase()).join('_'));
        break;
      case "kebab-case":
        setOutput(val.replace(/\W+/g, " ").split(/ |\B(?=[A-Z])/).map(w => w.toLowerCase()).join('-'));
        break;
      case "CONSTANT_CASE":
        setOutput(val.replace(/\W+/g, " ").split(/ |\B(?=[A-Z])/).map(w => w.toUpperCase()).join('_'));
        break;
      case "Title Case":
        setOutput(val.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        break;
      default:
        setOutput(val);
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
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)]">
        {[
          "lowercase", "uppercase", "camelCase", "snake_case", "kebab-case", "CONSTANT_CASE", "Title Case"
        ].map(m => (
          <Button
            key={m}
            variant={mode === m ? "primary" : "secondary"}
            onClick={() => setMode(m)}
            className="text-sm"
          >
            {m}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col h-full">
          <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Input Text</div>
          <CodeEditor
            className="min-h-[420px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="plaintext"
            options={{ wordWrap: "on" }}
          />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Output ({mode})</div>
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
            language="plaintext"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </div>
      </div>
    </main>
  );
}
