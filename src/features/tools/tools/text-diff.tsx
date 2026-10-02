"use client";
import { Label } from "@/components/ui/label";


import React, { useContext } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { ThemeContext } from "@/features/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

const SAMPLES: Record<string, { original: string; modified: string }> = {
  plaintext: {
    original: `Line one\nLine two\nLine three`,
    modified: `Line one\nLine 2 updated\nLine three\nExtra line four`,
  }
};

export default function TextDiffTool() {
  const [original, setOriginal] = React.useState(SAMPLES.plaintext.original);
  const [modified, setModified] = React.useState(SAMPLES.plaintext.modified);
  const [sideBySide, setSideBySide] = React.useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme.mode === "dark";

  return (
    <main className="mx-auto max-w-6xl w-full">
      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sideBySide}
              onChange={(e) => setSideBySide(e.target.checked)}
            />
            Side by side
          </Label>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-4 flex flex-col min-h-[300px]">
          <div className="font-semibold mb-2">Original</div>
          <CodeEditor value={original} onChange={setOriginal} className="flex-1" />
        </Card>
        <Card className="p-4 flex flex-col min-h-[300px]">
          <div className="font-semibold mb-2">Modified</div>
          <CodeEditor value={modified} onChange={setModified} className="flex-1" />
        </Card>
      </div>

      <Card className="mt-6 p-4">
        <div className="font-semibold mb-4">Diff Result</div>
        <div className="overflow-x-auto">
          <ReactDiffViewer
            oldValue={original}
            newValue={modified}
            splitView={sideBySide}
            useDarkTheme={isDark}
          />
        </div>
      </Card>
    </main>
  );
}
