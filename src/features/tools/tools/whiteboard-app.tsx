"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Card } from "@/components/ui/card";
import { ThemeContext } from "@/features/theme/theme-provider";

export default function WhiteboardAppTool({ tool }: { tool: ToolDef }) {
  const { theme } = React.useContext(ThemeContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme.mode === "system") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDark(theme.mode === "dark");
    }
  }, [theme.mode]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 h-[90vh] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">Simple Whiteboard</h1>
        <p className="text-sm text-[rgb(var(--muted))]">
          Draw, add sticky notes, and brainstorm natively using the embedded Excalidraw engine.
        </p>
      </div>

      <Card className="flex-1 w-full overflow-hidden relative shadow-lg border-[rgba(var(--border),0.5)]">
        <Excalidraw theme={isDark ? "dark" : "light"} />
      </Card>
    </main>
  );
}
