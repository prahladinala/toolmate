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

const SAMPLE_TEXT = `hello world! This is a flexible text case converter tool.
Convert camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE easily.`;

const CASING_MODES = [
  { id: "lowercase", label: "lowercase" },
  { id: "uppercase", label: "UPPERCASE" },
  { id: "camelCase", label: "camelCase" },
  { id: "PascalCase", label: "PascalCase" },
  { id: "snake_case", label: "snake_case" },
  { id: "kebab-case", label: "kebab-case" },
  { id: "CONSTANT_CASE", label: "CONSTANT_CASE" },
  { id: "Title Case", label: "Title Case" },
];

export function TextCaseConverterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, SAMPLE_TEXT);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("camelCase");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value) {
      setOutput("");
      return;
    }
    const val = input.value;
    switch (mode) {
      case "lowercase":
        setOutput(val.toLowerCase());
        break;
      case "uppercase":
        setOutput(val.toUpperCase());
        break;
      case "camelCase":
        setOutput(
          val
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, "")
        );
        break;
      case "PascalCase":
        setOutput(
          val
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
            .replace(/[\s\-_]+/g, "")
        );
        break;
      case "snake_case":
        setOutput(
          val
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((w) => w.toLowerCase())
            .join("_")
        );
        break;
      case "kebab-case":
        setOutput(
          val
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((w) => w.toLowerCase())
            .join("-")
        );
        break;
      case "CONSTANT_CASE":
        setOutput(
          val
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map((w) => w.toUpperCase())
            .join("_")
        );
        break;
      case "Title Case":
        setOutput(
          val
            .toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        );
        break;
      default:
        setOutput(val);
    }
  }, [input.value, mode]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied converted text to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar className="flex-col sm:flex-row items-stretch sm:items-center">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CASING_MODES.map((m) => (
            <Button
              key={m.id}
              type="button"
              size="sm"
              variant={mode === m.id ? "primary" : "secondary"}
              onClick={() => setMode(m.id)}
              className="text-xs h-8"
            >
              {m.label}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(SAMPLE_TEXT)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] self-end sm:self-auto"
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
            Source Text
          </span>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              {mode} Output
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
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="plaintext"
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="plaintext"
            editable={false}
            minHeight="min-h-[300px] sm:min-h-[420px]"
            options={{ wordWrap: "on" }}
          />
        }
      />
    </ToolWorkspace>
  );
}
