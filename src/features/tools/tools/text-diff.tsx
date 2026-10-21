"use client";

import React, { useContext, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { ThemeContext } from "@/features/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Columns2, Rows3, RotateCcw } from "lucide-react";

const SAMPLES: Record<string, { original: string; modified: string }> = {
  plaintext: {
    original: `Line one\nLine two\nLine three`,
    modified: `Line one\nLine 2 updated\nLine three\nExtra line four`,
  },
};

export default function TextDiffTool() {
  const [original, setOriginal] = useState(SAMPLES.plaintext.original);
  const [modified, setModified] = useState(SAMPLES.plaintext.modified);
  const [sideBySide, setSideBySide] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme.mode === "dark";

  const handleReset = () => {
    setOriginal(SAMPLES.plaintext.original);
    setModified(SAMPLES.plaintext.modified);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      {/* Control Toolbar */}
      <ToolToolbar>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={sideBySide ? "primary" : "secondary"}
            onClick={() => setSideBySide(true)}
            className="text-xs"
          >
            <Columns2 className="w-3.5 h-3.5 mr-1.5" />
            Split View
          </Button>
          <Button
            type="button"
            size="sm"
            variant={!sideBySide ? "primary" : "secondary"}
            onClick={() => setSideBySide(false)}
            className="text-xs"
          >
            <Rows3 className="w-3.5 h-3.5 mr-1.5" />
            Unified View
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Sample
        </Button>
      </ToolToolbar>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Original Text
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-xs h-7 px-2"
              onClick={() => setOriginal("")}
            >
              Clear
            </Button>
          </div>
          <CodeEditor
            value={original}
            onChange={(val) => setOriginal(val || "")}
            language="plaintext"
            minHeight="min-h-[220px] sm:min-h-[280px]"
          />
        </div>

        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Modified Text
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-xs h-7 px-2"
              onClick={() => setModified("")}
            >
              Clear
            </Button>
          </div>
          <CodeEditor
            value={modified}
            onChange={(val) => setModified(val || "")}
            language="plaintext"
            minHeight="min-h-[220px] sm:min-h-[280px]"
          />
        </div>
      </div>

      {/* Diff Result */}
      <div className="w-full min-w-0 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-[rgb(var(--border))] flex items-center justify-between bg-[rgb(var(--card-2))]">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Diff Comparison Result
          </span>
          <span className="text-xs text-[rgb(var(--muted))]">
            {sideBySide ? "Side-by-side mode" : "Inline unified mode"}
          </span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-refined p-2 sm:p-4">
          <div className="min-w-full text-xs font-mono">
            <ReactDiffViewer
              oldValue={original}
              newValue={modified}
              splitView={sideBySide}
              useDarkTheme={isDark}
              styles={{
                variables: {
                  dark: {
                    diffViewerBackground: "transparent",
                    addedBackground: "rgba(16, 185, 129, 0.15)",
                    addedColor: "#34d399",
                    removedBackground: "rgba(239, 68, 68, 0.15)",
                    removedColor: "#f87171",
                    wordAddedBackground: "rgba(16, 185, 129, 0.3)",
                    wordRemovedBackground: "rgba(239, 68, 68, 0.3)",
                    gutterBackground: "transparent",
                    gutterColor: "#64748b",
                  },
                  light: {
                    diffViewerBackground: "transparent",
                    addedBackground: "rgba(16, 185, 129, 0.12)",
                    addedColor: "#065f46",
                    removedBackground: "rgba(239, 68, 68, 0.12)",
                    removedColor: "#991b1b",
                    wordAddedBackground: "rgba(16, 185, 129, 0.25)",
                    wordRemovedBackground: "rgba(239, 68, 68, 0.25)",
                    gutterBackground: "transparent",
                    gutterColor: "#94a3b8",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
