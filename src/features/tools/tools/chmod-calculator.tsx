"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";

const PERM_TYPES = ["Owner", "Group", "Public"];

export function ChmodCalculatorTool({ tool }: { tool: ToolDef }) {
  const [perms, setPerms] = useState({
    Owner: { read: true, write: true, execute: false },
    Group: { read: true, write: false, execute: false },
    Public: { read: true, write: false, execute: false },
  });

  const [octal, setOctal] = useState("644");
  const [symbolic, setSymbolic] = useState("-rw-r--r--");

  useEffect(() => {
    let o = 0;
    let s = "-";
    PERM_TYPES.forEach((t) => {
      let val = 0;
      let sym = "";
      const p = perms[t as keyof typeof perms];
      if (p.read) { val += 4; sym += "r"; } else sym += "-";
      if (p.write) { val += 2; sym += "w"; } else sym += "-";
      if (p.execute) { val += 1; sym += "x"; } else sym += "-";
      
      o = o * 10 + val;
      s += sym;
    });
    setOctal(o.toString());
    setSymbolic(s);
  }, [perms]);

  const toggle = (type: string, perm: "read" | "write" | "execute") => {
    setPerms((prev) => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [perm]: !prev[type as keyof typeof prev][perm],
      },
    }));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgb(var(--border))]">
                <th className="pb-4 font-medium">Permission</th>
                <th className="pb-4 font-medium">Read (4)</th>
                <th className="pb-4 font-medium">Write (2)</th>
                <th className="pb-4 font-medium">Execute (1)</th>
              </tr>
            </thead>
            <tbody>
              {PERM_TYPES.map((type) => (
                <tr key={type} className="border-b border-[rgb(var(--border))] last:border-0">
                  <td className="py-4 font-medium">{type}</td>
                  <td className="py-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-blue-500"
                      checked={perms[type as keyof typeof perms].read}
                      onChange={() => toggle(type, "read")}
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-blue-500"
                      checked={perms[type as keyof typeof perms].write}
                      onChange={() => toggle(type, "write")}
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-blue-500"
                      checked={perms[type as keyof typeof perms].execute}
                      onChange={() => toggle(type, "execute")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
            <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Octal</div>
            <div className="text-4xl font-mono font-bold text-blue-500">{octal}</div>
          </div>
          <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
            <div className="mb-2 text-sm text-neutral-500 font-medium uppercase tracking-wider">Symbolic</div>
            <div className="text-2xl font-mono font-bold text-blue-500">{symbolic}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
