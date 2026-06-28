"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";

export function BaseConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "255");
  const [fromBase, setFromBase] = useState(10);
  
  const [dec, setDec] = useState("");
  const [hex, setHex] = useState("");
  const [bin, setBin] = useState("");
  const [oct, setOct] = useState("");

  useEffect(() => {
    if (!input.value.trim()) {
      setDec(""); setHex(""); setBin(""); setOct("");
      return;
    }
    try {
      const parsed = parseInt(input.value, fromBase);
      if (isNaN(parsed)) throw new Error("Invalid number");
      setDec(parsed.toString(10));
      setHex(parsed.toString(16).toUpperCase());
      setBin(parsed.toString(2));
      setOct(parsed.toString(8));
    } catch {
      setDec("Error"); setHex("Error"); setBin("Error"); setOct("Error");
    }
  }, [input.value, fromBase]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
        <label className="flex flex-col gap-2 font-medium">
          Input Number
          <div className="flex items-stretch overflow-hidden rounded-[var(--radius)] border border-[rgb(var(--border))]">
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="bg-[rgb(var(--card-2))] px-4 py-3 outline-none border-r border-[rgb(var(--border))]"
            >
              <option value={10}>Decimal</option>
              <option value={16}>Hexadecimal</option>
              <option value={2}>Binary</option>
              <option value={8}>Octal</option>
            </select>
            <input
              type="text"
              value={input.value}
              onChange={(e) => input.setValue(e.target.value)}
              className="w-full bg-[rgb(var(--card-2))] px-4 py-3 outline-none font-mono text-lg"
            />
          </div>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="mb-2 text-sm text-neutral-500">Decimal (Base 10)</div>
          <div className="font-mono text-xl break-all">{dec}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="mb-2 text-sm text-neutral-500">Hexadecimal (Base 16)</div>
          <div className="font-mono text-xl break-all">{hex}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="mb-2 text-sm text-neutral-500">Binary (Base 2)</div>
          <div className="font-mono text-xl break-all">{bin}</div>
        </div>
        <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="mb-2 text-sm text-neutral-500">Octal (Base 8)</div>
          <div className="font-mono text-xl break-all">{oct}</div>
        </div>
      </div>
    </main>
  );
}
