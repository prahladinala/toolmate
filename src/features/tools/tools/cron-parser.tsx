"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import cronstrue from "cronstrue";

export function CronParserTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "* * * * *");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = cronstrue.toString(input.value);
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.toString());
      setOutput("");
    }
  }, [input.value]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
        <h2 className="mb-4 text-xl font-medium">Cron Expression Parser</h2>
        <input
          type="text"
          className="w-full max-w-md rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-3 text-center font-mono text-2xl tracking-widest outline-none focus:border-blue-500"
          value={input.value}
          onChange={(e) => input.setValue(e.target.value)}
          placeholder="* * * * *"
        />
        
        <div className="mt-8">
          {error ? (
            <div className="text-lg text-red-500">{error}</div>
          ) : (
            <div className="text-2xl text-blue-500 font-medium">"{output}"</div>
          )}
        </div>
      </div>
    </main>
  );
}
