"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function BaseConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "255");
  const [fromBase, setFromBase] = useState(10);

  const [dec, setDec] = useState("255");
  const [hex, setHex] = useState("FF");
  const [bin, setBin] = useState("11111111");
  const [oct, setOct] = useState("377");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!input.value.trim()) {
      setDec("");
      setHex("");
      setBin("");
      setOct("");
      return;
    }
    try {
      const parsed = parseInt(input.value.trim(), fromBase);
      if (isNaN(parsed)) throw new Error("Invalid number format");
      setDec(parsed.toString(10));
      setHex(parsed.toString(16).toUpperCase());
      setBin(parsed.toString(2));
      setOct(parsed.toString(8));
    } catch {
      setDec("Error");
      setHex("Error");
      setBin("Error");
      setOct("Error");
    }
  }, [input.value, fromBase]);

  const copyVal = async (key: string, val: string) => {
    if (!val || val === "Error") return;
    try {
      await navigator.clipboard.writeText(val);
      setCopiedKey(key);
      toast.success(`Copied ${key}!`);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Convert numeric bases seamlessly across Binary, Octal, Decimal, and Hexadecimal
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            setFromBase(10);
            input.setValue("255");
          }}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </ToolToolbar>

      {/* Input Group */}
      <div className="w-full p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
        <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
          Source Value & Base
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="sm:w-44 h-11 text-xs font-medium bg-[rgb(var(--card-2))]"
          >
            <option value={10}>Base 10 (Decimal)</option>
            <option value={16}>Base 16 (Hexadecimal)</option>
            <option value={2}>Base 2 (Binary)</option>
            <option value={8}>Base 8 (Octal)</option>
          </Select>

          <Input
            type="text"
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            className="flex-1 font-mono text-sm sm:text-base h-11 bg-[rgb(var(--card-2))]"
            placeholder="Enter value in selected base..."
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {[
          { label: "Decimal (Base 10)", val: dec },
          { label: "Hexadecimal (Base 16)", val: hex },
          { label: "Binary (Base 2)", val: bin },
          { label: "Octal (Base 8)", val: oct },
        ].map((item) => (
          <div
            key={item.label}
            className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                {item.label}
              </span>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-[rgb(var(--fg))] break-all select-all">
                {item.val || "—"}
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copyVal(item.label, item.val)}
              disabled={!item.val || item.val === "Error"}
              className="text-xs h-8 self-end sm:self-start px-3"
            >
              {copiedKey === item.label ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </ToolWorkspace>
  );
}
