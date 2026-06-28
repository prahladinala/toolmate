"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.";

export function LoremIpsumGeneratorTool({ tool }: { tool: ToolDef }) {
  const [output, setOutput] = useState("");
  const [count, setCount] = useState(3);
  const [type, setType] = useState("paragraphs");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (type === "words") {
      const words = LOREM.split(" ");
      let selected = [];
      for(let i=0; i<count; i++) {
        selected.push(words[i % words.length].replace(/[.,]/g, ""));
      }
      result = selected.join(" ");
    } else if (type === "sentences") {
      const sentences = LOREM.split(". ").map(s => s.trim() + ".");
      let selected = [];
      for(let i=0; i<count; i++) {
        selected.push(sentences[i % sentences.length]);
      }
      result = selected.join(" ");
    } else {
      let selected = [];
      for(let i=0; i<count; i++) {
        selected.push(LOREM);
      }
      result = selected.join("\n\n");
    }
    setOutput(result);
  };

  useEffect(() => {
    generate();
  }, [count, type]);

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
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            Count
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="w-20 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>
          <Button onClick={generate}>Regenerate</Button>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Output</div>
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
          className="mt-3 min-h-[420px]"
          value={output}
          language="plaintext"
          options={{ readOnly: true, wordWrap: "on" }}
        />
      </div>
    </main>
  );
}
