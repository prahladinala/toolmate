"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const DEFAULT_INPUT = `# Hello World\n\nThis is **Markdown** converting to *HTML*.\n\n- Real-time conversion\n- Standard HTML tags\n- Easy clipboard copy`;

export function MarkdownToHtmlTool({ tool }: { tool: ToolDef }) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const html = md.render(input);
      setOutput(html);
    } catch {
      setOutput("<!-- Error parsing markdown -->");
    }
  }, [input]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied HTML to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Convert raw Markdown into clean, ready-to-use HTML markup
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setInput(DEFAULT_INPUT)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Input Markdown
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Output HTML
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
              className="text-xs h-7 px-2"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input}
            onChange={(val) => setInput(val || "")}
            language="markdown"
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="html"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
