"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";

export function HashGeneratorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [algorithm, setAlgorithm] = useState("MD5");

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    let hash = "";
    switch (algorithm) {
      case "MD5":
        hash = CryptoJS.MD5(input.value).toString();
        break;
      case "SHA1":
        hash = CryptoJS.SHA1(input.value).toString();
        break;
      case "SHA256":
        hash = CryptoJS.SHA256(input.value).toString();
        break;
      case "SHA512":
        hash = CryptoJS.SHA512(input.value).toString();
        break;
    }
    setOutput(hash);
  }, [input.value, algorithm]);

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
      <div className="mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            Algorithm
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            >
              <option value="MD5">MD5</option>
              <option value="SHA1">SHA-1</option>
              <option value="SHA256">SHA-256</option>
              <option value="SHA512">SHA-512</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium">Input Text</div>
          <CodeEditor
            className="mt-3 min-h-[220px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="plaintext"
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Hash Output</div>
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
            className="mt-3 min-h-[220px]"
            value={output}
            language="plaintext"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </div>
      </div>
    </main>
  );
}
