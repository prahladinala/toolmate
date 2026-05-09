"use client";

import React from "react";
import { DiffEditor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LANGUAGES = [
  { label: "Plain Text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "Markdown", value: "markdown" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
];

const SAMPLES: Record<string, { original: string; modified: string }> = {
  plaintext: {
    original: `Line one
Line two
Line three`,
    modified: `Line one
Line 2 updated
Line three
Extra line four`,
  },
  javascript: {
    original: `function greet(name) {
  return "Hello, " + name + "!";
}

const user = "Monaco";
console.log(greet(user));`,
    modified: `function greet(name, excited = false) {
  const message = "Hello, " + name + "!";
  return excited ? message.toUpperCase() : message;
}

const user = "Monaco Editor";
console.log(greet(user, true));`,
  },
  json: {
    original: `{
  "name": "demo-app",
  "version": "1.0.0"
}`,
    modified: `{
  "name": "demo-app",
  "version": "1.1.0",
  "private": true
}`,
  },
};

export default function TextDiffTool() {
  const editorRef = React.useRef<any>(null);

  const [language, setLanguage] = React.useState("plaintext");
  const [theme, setTheme] = React.useState<"vs-dark" | "iPlastic">("iPlastic");
  const [sideBySide, setSideBySide] = React.useState(true);
  const [wordWrap, setWordWrap] = React.useState(true);
  const [showMiniMap, setShowMiniMap] = React.useState(false);

  // Initial values only (Monaco takes over after mount)
  const [original, setOriginal] = React.useState(SAMPLES.plaintext.original);
  const [modified, setModified] = React.useState(SAMPLES.plaintext.modified);

  // 🌗 System theme detection
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isDark: boolean) => {
      setTheme(isDark ? "vs-dark" : "iPlastic");
    };

    applyTheme(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // 🔁 Actions using Monaco directly
  const handleSwap = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    const left = originalEditor.getValue();
    const right = modifiedEditor.getValue();

    originalEditor.setValue(right);
    modifiedEditor.setValue(left);
  };

  const handleClear = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.getOriginalEditor().setValue("");
    editor.getModifiedEditor().setValue("");
  };

  const handleLoadSample = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const sample = SAMPLES[language] || SAMPLES.plaintext;

    editor.getOriginalEditor().setValue(sample.original);
    editor.getModifiedEditor().setValue(sample.modified);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setLanguage(next);

    const editor = editorRef.current;
    if (!editor) return;

    const sample = SAMPLES[next] || SAMPLES.plaintext;

    editor.getOriginalEditor().setValue(sample.original);
    editor.getModifiedEditor().setValue(sample.modified);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Toolbar */}
      <Card className="mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Language */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Language</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="h-9 rounded-md border px-3 text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sideBySide}
              onChange={(e) => setSideBySide(e.target.checked)}
            />
            Side by side
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wordWrap}
              onChange={(e) => setWordWrap(e.target.checked)}
            />
            Word wrap
          </label>

          {/* <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showMiniMap}
              onChange={(e) => setShowMiniMap(e.target.checked)}
            />
            Mini map
          </label> */}

          {/* Actions */}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={handleLoadSample}>
              Load sample
            </Button>
            <Button variant="secondary" onClick={handleSwap}>
              Swap
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="mt-6 p-4">
        <div className="mb-3">
          <div className="font-medium">Diff Result</div>
          <div className="text-sm text-muted-foreground">
            Edit directly in either pane
          </div>
        </div>

        <div className="h-[70vh] min-h-[520px] overflow-hidden rounded-xl border">
          <DiffEditor
            height="100%"
            language={language}
            original={original}
            modified={modified}
            theme={theme}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              renderSideBySide: sideBySide,
              originalEditable: true,
              readOnly: false,
              automaticLayout: true,
              minimap: { enabled: showMiniMap },
              wordWrap: wordWrap ? "on" : "off",
              diffWordWrap: wordWrap ? "on" : "off",
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: "on",
              glyphMargin: true,
              folding: true,
            }}
          />
        </div>
      </Card>
    </main>
  );
}
