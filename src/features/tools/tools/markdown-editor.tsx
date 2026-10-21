"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const DEFAULT_MARKDOWN = `# Markdown Editor

Welcome to the **live preview** editor.

### Features
- Real-time HTML rendering
- Clean typography preview
- Responsive layout (Split, Mobile Tabs)

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Markdown makes writing formatted content fast and effortless.`;

export function MarkdownEditorTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_MARKDOWN);
  const [html, setHtml] = useState("");

  useEffect(() => {
    try {
      setHtml(md.render(input.value || ""));
    } catch {
      setHtml("<p class='text-red-500'>Error parsing markdown</p>");
    }
  }, [input.value]);

  const copyHtml = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      toast.success("Copied HTML to clipboard!");
    } catch {
      toast.error("Failed to copy HTML");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs font-medium text-[rgb(var(--muted))]">
          Markdown with instant side-by-side rendering
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyHtml}
            className="text-xs"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy HTML
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue(DEFAULT_MARKDOWN)}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Markdown Source
          </span>
        }
        outputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Live Preview
          </span>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="markdown"
            minHeight="min-h-[350px] sm:min-h-[460px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <div className="w-full min-w-0 min-h-[350px] sm:min-h-[460px] p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-auto scrollbar-refined prose dark:prose-invert max-w-none text-sm">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        }
      />
    </ToolWorkspace>
  );
}
