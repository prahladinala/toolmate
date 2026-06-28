"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export function MarkdownToHtmlTool({ tool }: { tool: ToolDef }) {
  const [input, setInput] = useState("# Hello World\\n\\nThis is **Markdown**.");
  const [output, setOutput] = useState("");

  useEffect(() => {
    try {
      const html = md.render(input);
      setOutput(html);
    } catch (err) {
      setOutput("<!-- Error parsing markdown -->");
    }
  }, [input]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Markdown to HTML</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Instantly convert raw Markdown text into properly formatted HTML code.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 h-[600px]">
        <Card className="p-0 flex flex-col h-full relative overflow-hidden">
          <div className="p-4 border-b border-[rgb(var(--border))] font-medium">Input Markdown</div>
          <CodeEditor
            value={input}
            onChange={(val) => setInput(val || "")}
            language="markdown"
            className="absolute inset-0 top-[53px]"
          />
        </Card>

        <Card className="p-0 flex flex-col h-full relative overflow-hidden">
          <div className="p-4 border-b border-[rgb(var(--border))] font-medium">Output HTML</div>
          <CodeEditor
            value={output}
            language="html"
            options={{ readOnly: true }}
            className="absolute inset-0 top-[53px]"
          />
        </Card>
      </div>
    </main>
  );
}
