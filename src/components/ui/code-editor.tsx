"use client";

import React, { useContext, useEffect, useState } from "react";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { EditorView } from "@codemirror/view";
import { ThemeContext } from "@/features/theme/theme-provider";
import { cn } from "@/lib/utils/cn";

export interface CodeEditorProps extends Omit<ReactCodeMirrorProps, "theme"> {
  className?: string;
  language?: string;
  options?: any;
  minHeight?: string;
}

export function CodeEditor({
  className,
  language,
  options,
  minHeight,
  ...props
}: CodeEditorProps) {
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
      case "html":
        return [html()];
      case "javascript":
      case "typescript":
      case "js":
      case "ts":
        return [javascript({ jsx: true, typescript: true })];
      case "json":
        return [json()];
      case "css":
        return [css()];
      default:
        return [];
    }
  };

  const isWrap = options?.wordWrap === "on" || options?.lineWrapping === true;
  const extensions = isWrap
    ? [...getLanguageExtension(), EditorView.lineWrapping]
    : getLanguageExtension();

  return (
    <div
      style={minHeight ? { minHeight } : undefined}
      className={cn(
        "relative w-full min-w-0 max-w-full rounded-xl overflow-hidden",
        "border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm",
        "flex flex-col transition-colors duration-150",
        // Responsive min-height defaults if no explicit minHeight is supplied
        !minHeight && "min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]",
        className
      )}
    >
      <div className="flex-1 w-full min-w-0 h-full overflow-hidden flex flex-col">
        <CodeMirror
          theme={isDark ? githubDark : githubLight}
          extensions={extensions}
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
          className={cn(
            "flex-1 w-full min-w-0 text-[13px] sm:text-[14px] font-mono leading-relaxed",
            "[&>.cm-editor]:h-full [&>.cm-editor]:min-h-[inherit]",
            "[&_.cm-scroller]:font-mono [&_.cm-scroller]:p-3 sm:[&_.cm-scroller]:p-4",
            "[&_.cm-scroller]:overflow-auto [&_.cm-scroller]:max-w-full"
          )}
          editable={options?.readOnly ? false : undefined}
          {...props}
        />
      </div>
    </div>
  );
}
