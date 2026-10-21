"use client";

import React, { useState, useEffect, useContext } from "react";
import type { ToolDef } from "../registry";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { ThemeContext } from "@/features/theme/theme-provider";

export default function WhiteboardAppTool({ tool }: { tool: ToolDef }) {
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme.mode === "system") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDark(theme.mode === "dark");
    }
  }, [theme.mode]);

  return (
    <ToolWorkspace maxWidth="full" className="space-y-4">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Collaborative sketching, diagramming, flowcharts, and wireframing powered by embedded Excalidraw
        </span>
      </ToolToolbar>

      <div className="w-full h-[calc(100vh-13rem)] min-h-[550px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden relative">
        <Excalidraw theme={isDark ? "dark" : "light"} />
      </div>
    </ToolWorkspace>
  );
}
