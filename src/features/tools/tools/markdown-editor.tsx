"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { CodeEditor } from "@/components/ui/code-editor";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export function MarkdownEditorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "# Hello Markdown\n\nThis is a **live preview** of the editor.\n\n- List item 1\n- List item 2\n\n```js\nconsole.log('Code block');\n```");
  const [html, setHtml] = useState("");

  useEffect(() => {
    try {
      setHtml(md.render(input.value || ""));
    } catch {
      setHtml("<p>Error parsing markdown</p>");
    }
  }, [input.value]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 flex flex-col">
          <div className="font-medium mb-3">Markdown Input</div>
          <div className="flex-1 min-h-[500px]">
            <CodeEditor
              value={input.value}
              onChange={(value) => input.setValue(value || "")}
              language="markdown"
              options={{ wordWrap: "on" }}
            />
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 flex flex-col">
          <div className="font-medium mb-3">Live Preview</div>
          <div 
            className="flex-1 min-h-[500px] prose dark:prose-invert max-w-none p-4 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] overflow-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </main>
  );
}
