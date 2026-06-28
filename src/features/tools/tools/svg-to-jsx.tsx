"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

function transformSvgToJsx(svgString: string): string {
  // Very naive transform for demonstration purposes
  let jsx = svgString;
  jsx = jsx.replace(/class=/g, "className=");
  jsx = jsx.replace(/for=/g, "htmlFor=");
  
  // Replace kebab-case properties with camelCase
  jsx = jsx.replace(/([a-z]+)-([a-z]+)=/g, (match, p1, p2) => {
    // exclude data-* and aria-*
    if (p1 === "data" || p1 === "aria") return match;
    return `${p1}${p2.charAt(0).toUpperCase()}${p2.slice(1)}=`;
  });

  // Convert style="color: red; background-color: blue;" to style={{color: 'red', backgroundColor: 'blue'}}
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

  return `const SvgIcon = (props) => (\n  ${jsx.replace(/\n/g, "\n  ")}\n);\n\nexport default SvgIcon;`;
}

export function SvgToJsxTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>');
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(transformSvgToJsx(input.value));
    } catch (e) {
      setOutput("Error transforming SVG");
    }
  }, [input.value]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="font-medium">Input SVG</div>
          <CodeEditor
            className="mt-3 min-h-[420px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="html"
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Output JSX</div>
            <Button size="sm" variant="secondary" onClick={copyToClipboard} disabled={!output}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </motion.span>
            </Button>
          </div>
          <CodeEditor
            className="mt-3 min-h-[420px]"
            value={output}
            language="javascript"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
