"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { CodeEditor } from "@/components/ui/code-editor";

export function WordCounterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "");
  
  const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0, bytes: 0, charsNoSpace: 0 });

  useEffect(() => {
    const val = input.value || "";
    setStats({
      chars: val.length,
      words: val.trim() ? val.trim().split(/\s+/).length : 0,
      lines: val === "" ? 0 : val.split(/\r\n|\r|\n/).length,
      bytes: new Blob([val]).size,
      charsNoSpace: val.replace(/\s+/g, "").length,
    });
  }, [input.value]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-4 sm:grid-cols-5 mb-8">
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Words</div>
          <div className="text-4xl font-bold">{stats.words}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Characters</div>
          <div className="text-4xl font-bold">{stats.chars}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">No Spaces</div>
          <div className="text-4xl font-bold">{stats.charsNoSpace}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Lines</div>
          <div className="text-4xl font-bold">{stats.lines}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
          <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Bytes</div>
          <div className="text-4xl font-bold">{stats.bytes}</div>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
        <div className="font-medium">Input Text</div>
        <CodeEditor
          className="mt-3 min-h-[420px]"
          value={input.value}
          onChange={(value) => input.setValue(value || "")}
          language="plaintext"
          options={{ wordWrap: "on" }}
        />
      </div>
    </main>
  );
}
