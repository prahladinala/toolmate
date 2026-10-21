"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function ColorConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "#3b82f6");

  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const val = input.value.trim();
    if (!val) return;

    try {
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = val;
      const computed = ctx.fillStyle;
      setHex(computed.toUpperCase());

      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      setRgb(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);

      const r = data[0] / 255;
      const g = data[1] / 255;
      const b = data[2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }
      setHsl(`hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);
    } catch {
      // ignore invalid input
    }
  }, [input.value]);

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
          Convert HEX, RGB, and HSL formats with instant bidirectional color preview
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue("#3b82f6")}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </ToolToolbar>

      {/* Input Picker Bar */}
      <div className="w-full p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <input
          type="color"
          value={hex.startsWith("#") && hex.length === 7 ? hex : "#3B82F6"}
          onChange={(e) => input.setValue(e.target.value)}
          className="w-16 h-16 rounded-xl cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
        />
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Color String Input
          </label>
          <Input
            type="text"
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            className="font-mono text-sm sm:text-base h-11 bg-[rgb(var(--card-2))]"
            placeholder="#3B82F6, rgb(59, 130, 246), hsl(217, 91%, 60%)"
          />
        </div>
      </div>

      {/* Format Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[
          { label: "HEX", val: hex },
          { label: "RGB", val: rgb },
          { label: "HSL", val: hsl },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
                {item.label}
              </span>
              <div className="text-sm sm:text-base font-mono font-medium text-[rgb(var(--fg))] mt-1 truncate select-all">
                {item.val || "—"}
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copyVal(item.label, item.val)}
              className="text-xs h-8 w-full"
            >
              {copiedKey === item.label ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy {item.label}
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Large swatch */}
      <div
        className="w-full h-32 rounded-2xl border border-[rgb(var(--border))] shadow-sm transition-colors flex items-center justify-center"
        style={{ backgroundColor: hex }}
      >
        <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-black/40 text-white backdrop-blur-md shadow-xs">
          {hex}
        </span>
      </div>
    </ToolWorkspace>
  );
}
