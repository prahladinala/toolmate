"use client";

import React from "react";
import { ThemeContext } from "./theme-provider";
import { LOOKS } from "./looks";
import { PALETTES } from "./palettes";
import { Button } from "@/components/ui/button";
import type { Mode } from "./theme-config";

export function ThemePanel() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <div className="w-[300px] rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-md)]">
      <div className="text-sm font-semibold">Theme</div>

      <div className="mt-3">
        <div className="text-xs text-[rgb(var(--muted))]">Look</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOOKS.filter((l) => l.enabled).map((l) => (
            <Button
              key={l.id}
              size="sm"
              variant={theme.look === l.id ? "primary" : "secondary"}
              onClick={() => setTheme({ ...theme, look: l.id })}
            >
              {l.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-[rgb(var(--muted))]">Palette</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PALETTES.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={theme.palette === p.id ? "primary" : "secondary"}
              onClick={() => setTheme({ ...theme, palette: p.id })}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-[rgb(var(--muted))]">Mode</div>
        <div className="mt-2 flex gap-2">
          {(["system", "light", "dark"] as Mode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={theme.mode === m ? "primary" : "secondary"}
              onClick={() => setTheme({ ...theme, mode: m })}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      {/* preview chip */}
      <div className="mt-4 rounded-[var(--radius)] border border-[rgb(var(--border))] p-3">
        <div className="text-xs text-[rgb(var(--muted))]">Preview</div>
        <div className="mt-2 flex gap-2">
          <span className="h-8 w-8 rounded-[var(--radius)] bg-[rgb(var(--accent))]" />
          <span className="h-8 w-8 rounded-[var(--radius)] bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]" />
        </div>
      </div>
    </div>
  );
}
