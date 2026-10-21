"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const PERM_TYPES = ["Owner", "Group", "Public"] as const;

export function ChmodCalculatorTool({ tool }: { tool: ToolDef }) {
  const [perms, setPerms] = useState({
    Owner: { read: true, write: true, execute: false },
    Group: { read: true, write: false, execute: false },
    Public: { read: true, write: false, execute: false },
  });

  const [octal, setOctal] = useState("644");
  const [symbolic, setSymbolic] = useState("-rw-r--r--");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    let o = 0;
    let s = "-";
    PERM_TYPES.forEach((t) => {
      let val = 0;
      let sym = "";
      const p = perms[t];
      if (p.read) {
        val += 4;
        sym += "r";
      } else sym += "-";
      if (p.write) {
        val += 2;
        sym += "w";
      } else sym += "-";
      if (p.execute) {
        val += 1;
        sym += "x";
      } else sym += "-";

      o = o * 10 + val;
      s += sym;
    });
    setOctal(o.toString());
    setSymbolic(s);
  }, [perms]);

  const toggle = (type: (typeof PERM_TYPES)[number], perm: "read" | "write" | "execute") => {
    setPerms((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [perm]: !prev[type][perm],
      },
    }));
  };

  const copyVal = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedKey(key);
      toast.success(`Copied ${key}!`);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const setPreset = (oct: string) => {
    const digits = oct.split("").map(Number);
    const parseDigit = (d: number) => ({
      read: (d & 4) === 4,
      write: (d & 2) === 2,
      execute: (d & 1) === 1,
    });
    setPerms({
      Owner: parseDigit(digits[0] || 0),
      Group: parseDigit(digits[1] || 0),
      Public: parseDigit(digits[2] || 0),
    });
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Presets:
          </span>
          {["777", "755", "644", "600", "400"].map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={octal === p ? "primary" : "secondary"}
              onClick={() => setPreset(p)}
              className="text-xs h-7 px-2.5 font-mono"
            >
              {p}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setPreset("644")}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Default 644
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-w-0">
        {/* Permission Checkboxes Table */}
        <div className="md:col-span-7 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))]">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Permission Matrix
            </span>
          </div>

          <div className="p-4 overflow-x-auto scrollbar-refined">
            <table className="w-full text-left min-w-[280px]">
              <thead>
                <tr className="border-b border-[rgb(var(--border))] text-xs text-[rgb(var(--muted))] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Scope</th>
                  <th className="pb-3 font-semibold text-center">Read (4)</th>
                  <th className="pb-3 font-semibold text-center">Write (2)</th>
                  <th className="pb-3 font-semibold text-center">Exec (1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--border))]">
                {PERM_TYPES.map((type) => (
                  <tr key={type} className="hover:bg-[rgb(var(--card-2))]/50 transition-colors">
                    <td className="py-3.5 text-xs sm:text-sm font-semibold text-[rgb(var(--fg))]">
                      {type}
                    </td>
                    <td className="py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={perms[type].read}
                        onChange={() => toggle(type, "read")}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={perms[type].write}
                        onChange={() => toggle(type, "write")}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={perms[type].execute}
                        onChange={() => toggle(type, "execute")}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Output Displays */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Octal Notation
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[rgb(var(--fg))] my-2">
              {octal}
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copyVal("Octal", octal)}
              className="text-xs h-8 w-full"
            >
              {copiedKey === "Octal" ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied Octal
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Octal ({octal})
                </>
              )}
            </Button>
          </div>

          <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
              Symbolic Notation
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-semibold text-indigo-500 my-2 tracking-wider">
              {symbolic}
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copyVal("Symbolic", symbolic)}
              className="text-xs h-8 w-full"
            >
              {copiedKey === "Symbolic" ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied Symbolic
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Symbolic ({symbolic})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
