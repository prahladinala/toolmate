"use client";

import React from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { toast } from "sonner";
import { Check, Copy, Play, Trash2, Sparkles, AlertCircle } from "lucide-react";

type Settings = {
  pretty: boolean;
  indent: number;
  sortKeys: boolean;
  autoRun: boolean;
  wrap: boolean;
};

const SAMPLE_JSON = `{
  "name": "ToolMate",
  "version": "2.0.0",
  "description": "Everyday developer tools, in one place",
  "author": "Prahlad Inala",
  "features": [
    "JSON Formatter",
    "Base64 Converter",
    "UUID Generator",
    "CSS Generators"
  ],
  "openSource": true,
  "stats": {
    "toolsCount": 60,
    "rating": 4.98
  }
}`;

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

function formatJSON(
  input: string,
  settings: Settings
): { output: string; error?: string } {
  if (!input.trim()) return { output: "" };
  try {
    const parsed = JSON.parse(input);
    let value = parsed;

    if (settings.sortKeys) {
      value = sortObjectKeys(parsed);
    }

    const out = settings.pretty
      ? JSON.stringify(value, null, settings.indent)
      : JSON.stringify(value);

    return { output: out };
  } catch (err: any) {
    return { output: "", error: err.message };
  }
}

export function JsonFormatterTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input:v3`;
  const settingsKey = `toolmate:${tool.slug}:settings:v3`;

  const input = usePersistedState<string>(inputKey, "");
  const settings = usePersistedState<Settings>(settingsKey, {
    pretty: true,
    indent: 2,
    sortKeys: false,
    autoRun: true,
    wrap: false,
  });

  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const run = React.useCallback(() => {
    const result = formatJSON(input.value, settings.value);
    if (result.error) {
      setError(result.error);
      setOutput("");
    } else {
      setError(null);
      setOutput(result.output);
    }
  }, [input.value, settings.value]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("JSON copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const loadSample = () => {
    input.setValue(SAMPLE_JSON);
  };

  React.useEffect(() => {
    if (settings.value.autoRun) run();
  }, [input.value, settings.value, run]);

  return (
    <ToolWorkspace>
      {/* TOOLBAR */}
      <ToolToolbar>
        {/* Left Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button onClick={run} size="sm" className="gap-1.5 shadow-sm">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Format</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              settings.setValue({ ...settings.value, pretty: false });
              run();
            }}
            className="text-xs sm:text-sm"
          >
            Minify
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={loadSample}
            className="text-xs sm:text-sm gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              input.clear();
              setOutput("");
              setError(null);
            }}
            className="text-xs sm:text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>

        {/* Right Settings */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[rgb(var(--muted))] text-xs">Indent:</span>
            <Select
              size="sm"
              value={settings.value.indent}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  indent: Number(e.target.value),
                  pretty: true,
                })
              }
              className="w-16 h-8 text-xs py-1"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </Select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm text-[rgb(var(--fg))]">
            <input
              type="checkbox"
              checked={settings.value.sortKeys}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  sortKeys: e.target.checked,
                })
              }
              className="rounded accent-[rgb(var(--accent))]"
            />
            <span>Sort Keys</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm text-[rgb(var(--fg))]">
            <input
              type="checkbox"
              checked={settings.value.wrap}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  wrap: e.target.checked,
                })
              }
              className="rounded accent-[rgb(var(--accent))]"
            />
            <span>Wrap</span>
          </label>
        </div>
      </ToolToolbar>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-mono break-words-safe">{error}</div>
        </div>
      )}

      {/* SPLIT PANE */}
      <ToolSplitPane
        hasOutput={Boolean(output)}
        inputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Input JSON
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input.value ? `${input.value.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              Formatted Output
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
              className="h-7 text-xs px-2.5 gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="json"
            options={{ wordWrap: settings.value.wrap ? "on" : "off" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="json"
            options={{
              readOnly: true,
              wordWrap: settings.value.wrap ? "on" : "off",
            }}
          />
        }
      />
    </ToolWorkspace>
  );
}
