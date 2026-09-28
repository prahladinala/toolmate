"use client";

import React, { useContext, useEffect, useState } from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { ThemeContext } from "@/features/theme/theme-provider";

export interface CodeEditorProps extends Omit<ReactCodeMirrorProps, 'theme'> {
  className?: string;
  language?: string;
  options?: any;
}

export function CodeEditor({ className, language, options, ...props }: CodeEditorProps) {
  const { theme } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme.mode === "system") {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } else {
      setIsDark(theme.mode === "dark");
    }
  }, [theme.mode]);

  const getLanguageExtension = () => {
    switch (language?.toLowerCase()) {
      case "html": return [html()];
      case "javascript": 
      case "typescript":
      case "js":
      case "ts": return [javascript({ jsx: true, typescript: true })];
      case "json": return [json()];
      case "css": return [css()];
      default: return [];
    }
  };

  return (
    <div
      className={`relative min-h-[420px] h-full w-full overflow-hidden rounded-xl border border-[rgba(var(--fg),0.1)] bg-white dark:bg-[#0d1117] z-10 flex flex-col shadow-sm ${className || ""}`}
    >
      <CodeMirror
        theme={isDark ? githubDark : githubLight}
        extensions={getLanguageExtension()}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="flex-1 w-full h-full text-[14px] font-mono leading-relaxed [&>.cm-editor]:h-full [&_.cm-scroller]:font-mono [&_.cm-scroller]:p-4"
        editable={options?.readOnly ? false : undefined}
        {...props}
      />
    </div>
  );
}
