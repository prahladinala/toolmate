"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Keyboard, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function KeyCodeInfoTool({ tool }: { tool: ToolDef }) {
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't prevent default on F12/developer tools or page reload
      if (e.key !== "F12" && !(e.ctrlKey && e.key === "r")) {
        e.preventDefault();
      }
      setKeyEvent(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Press any keyboard key to inspect JavaScript Event properties, Unicode, and modifier states
        </span>
      </ToolToolbar>

      {!keyEvent ? (
        <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border-2 border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] flex flex-col items-center justify-center p-8 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-500">
            <Keyboard className="w-8 h-8" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-[rgb(var(--fg))]">
            Press any key on your keyboard
          </span>
          <p className="text-xs text-[rgb(var(--muted))] mt-1 max-w-sm">
            Works with letters, symbols, numbers, function keys, and modifiers.
          </p>
        </div>
      ) : (
        <div className="space-y-6 w-full min-w-0">
          {/* Main Key Code Hero */}
          <div className="p-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm text-center flex flex-col items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))] mb-1">
              JavaScript KeyCode (which)
            </span>
            <div className="text-7xl sm:text-8xl font-mono font-extrabold tracking-tight text-indigo-500 my-2 select-all">
              {keyEvent.keyCode}
            </div>
            <span className="text-sm font-semibold text-[rgb(var(--fg))]">
              Key: {keyEvent.key === " " ? "(Spacebar)" : keyEvent.key}
            </span>
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              { label: "event.key", val: keyEvent.key === " " ? "Space" : keyEvent.key },
              { label: "event.code", val: keyEvent.code },
              { label: "event.which", val: String(keyEvent.which) },
              { label: "event.location", val: String(keyEvent.location) },
            ].map((prop) => (
              <div
                key={prop.label}
                className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                    {prop.label}
                  </span>
                  <div className="text-lg font-mono font-bold text-[rgb(var(--fg))] truncate mt-1 select-all">
                    {prop.val}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyVal(prop.label, prop.val)}
                  className="self-end p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors"
                  title={`Copy ${prop.label}`}
                >
                  {copiedKey === prop.label ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Modifier Keys Row */}
          <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
              Active Modifier Keys:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: "Ctrl", active: keyEvent.ctrlKey },
                { name: "Shift", active: keyEvent.shiftKey },
                { name: "Alt", active: keyEvent.altKey },
                { name: "Meta (Cmd/Win)", active: keyEvent.metaKey },
              ].map((mod) => (
                <span
                  key={mod.name}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    mod.active
                      ? "bg-indigo-500 text-white shadow-xs"
                      : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))]"
                  }`}
                >
                  {mod.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
