import React, { useContext, useEffect, useState } from "react";
import Editor, { useMonaco, EditorProps } from "@monaco-editor/react";
import { ThemeContext } from "@/features/theme/theme-provider";

export interface CodeEditorProps extends EditorProps {
  className?: string;
}

export function CodeEditor({ className, options, ...props }: CodeEditorProps) {
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {
    if (theme.mode === "system") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDark(theme.mode === "dark");
    }
  }, [theme.mode]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("toolmate-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#00000000",
        },
      });
      monaco.editor.defineTheme("toolmate-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#00000000",
        },
      });
    }
  }, [monaco]);

  return (
    <div
      className={`relative min-h-[420px] h-full w-full overflow-hidden rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] ${className || ""}`}
    >
      <div className="absolute inset-0">
        <Editor
          theme={isDark ? "toolmate-dark" : "toolmate-light"}
          loading={
            <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
              Loading editor...
            </div>
          }
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            renderLineHighlight: "none",
            ...options,
          }}
          {...props}
        />
      </div>
    </div>
  );
}
