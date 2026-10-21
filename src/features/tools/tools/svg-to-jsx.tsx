"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles">
  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  <path d="M5 3v4"/>
  <path d="M19 17v4"/>
  <path d="M3 5h4"/>
  <path d="M17 19h4"/>
</svg>`;

function transformSvgToJsx(svgString: string): string {
  let jsx = svgString;
  jsx = jsx.replace(/class=/g, "className=");
  jsx = jsx.replace(/for=/g, "htmlFor=");

  jsx = jsx.replace(/([a-z]+)-([a-z]+)=/g, (match, p1, p2) => {
    if (p1 === "data" || p1 === "aria") return match;
    return `${p1}${p2.charAt(0).toUpperCase()}${p2.slice(1)}=`;
  });

  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1.split(";").reduce((acc: any, prop: string) => {
      const [key, value] = prop.split(":");
      if (key && value) {
        const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        acc.push(`${camelKey}: '${value.trim()}'`);
      }
      return acc;
    }, []);
    return `style={{ ${styleObj.join(", ")} }}`;
  });

  return `export default function SvgIcon(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${jsx.replace(
    /\n/g,
    "\n    "
  )}\n  );\n}`;
}

export function SvgToJsxTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_SVG);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(transformSvgToJsx(input.value));
    } catch {
      setOutput("// Error transforming SVG to JSX");
    }
  }, [input.value]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied JSX to clipboard!");
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
          Transforms SVG elements, kebab-case attributes, and inline styles into React JSX components
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(DEFAULT_SVG)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Sample
        </Button>
      </ToolToolbar>

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Input SVG Code
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              React JSX Component
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
                  Copy JSX
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="html"
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
        output={
          <CodeEditor
            value={output}
            language="typescript"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
          />
        }
      />
    </ToolWorkspace>
  );
}
