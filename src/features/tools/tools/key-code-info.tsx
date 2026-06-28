"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";

export function KeyCodeInfoTool({ tool }: { tool: ToolDef }) {
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeyEvent(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {!keyEvent ? (
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))]">
          <div className="text-2xl font-medium text-neutral-500">Press any key</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-8 text-8xl font-bold text-blue-500 font-mono">
            {keyEvent.keyCode}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
              <div className="mb-2 text-sm text-neutral-500 font-medium uppercase">event.key</div>
              <div className="text-2xl font-mono truncate">{keyEvent.key === " " ? "Space" : keyEvent.key}</div>
            </div>
            <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
              <div className="mb-2 text-sm text-neutral-500 font-medium uppercase">event.code</div>
              <div className="text-2xl font-mono truncate">{keyEvent.code}</div>
            </div>
            <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
              <div className="mb-2 text-sm text-neutral-500 font-medium uppercase">event.which</div>
              <div className="text-2xl font-mono truncate">{keyEvent.which}</div>
            </div>
            <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
              <div className="mb-2 text-sm text-neutral-500 font-medium uppercase">event.location</div>
              <div className="text-2xl font-mono truncate">{keyEvent.location}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {keyEvent.ctrlKey && <div className="rounded bg-neutral-200 dark:bg-neutral-800 px-4 py-2 font-mono font-bold">Ctrl</div>}
            {keyEvent.shiftKey && <div className="rounded bg-neutral-200 dark:bg-neutral-800 px-4 py-2 font-mono font-bold">Shift</div>}
            {keyEvent.altKey && <div className="rounded bg-neutral-200 dark:bg-neutral-800 px-4 py-2 font-mono font-bold">Alt</div>}
            {keyEvent.metaKey && <div className="rounded bg-neutral-200 dark:bg-neutral-800 px-4 py-2 font-mono font-bold">Meta</div>}
          </div>
        </div>
      )}
    </main>
  );
}
