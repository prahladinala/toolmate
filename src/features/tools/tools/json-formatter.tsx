"use client";
import { Label } from "@/components/ui/label";

import { Select } from "@/components/ui/select";


import React from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Settings = {
  pretty: boolean;
  indent: number;
  sortKeys: boolean;
  autoRun: boolean;
  wrap: boolean;
};

function formatJSON(
  input: string,
  settings: Settings,
): { output: string; error?: string } {
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
  const [showAdvanced, setShowAdvanced] = React.useState(false);
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
      toast.success("Copied to clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  React.useEffect(() => {
    if (settings.value.autoRun) run();
  }, [input.value, settings.value, run]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* SETTINGS BAR */}
      <div className="sticky top-16 z-10 mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)] backdrop-blur">
        {/* Primary Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.value.pretty}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  pretty: e.target.checked,
                })
              }
            />
            Pretty
          </Label>

          <Button onClick={run}>Run</Button>
          <Button variant="secondary" onClick={input.clear}>
            Clear
          </Button>

          {/* Mobile Toggle */}
          <Button
            onClick={() => setShowAdvanced((v) => !v)}
            className="
              lg:hidden
              rounded-[var(--radius)]
              border border-[rgb(var(--border))]
              bg-[rgb(var(--card-2))]
              px-3 py-1 text-sm
              hover:border-[rgba(var(--accent),0.55)]
              hover:bg-[rgba(var(--accent),0.08)]
              transition
            "
          >
            {showAdvanced ? "Less ▲" : "More ▼"}
          </Button>
        </div>

        {/* Desktop Advanced */}
        <div className="hidden lg:flex mt-4 flex-wrap items-center gap-4">
          <Label className="flex items-center gap-2 text-sm">
            Indent
            <Select
              value={settings.value.indent}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  indent: Number(e.target.value),
                })
              }
              className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
            </Select>
          </Label>

          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.value.sortKeys}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  sortKeys: e.target.checked,
                })
              }
            />
            Sort Keys
          </Label>

          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.value.autoRun}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  autoRun: e.target.checked,
                })
              }
            />
            Auto Run
          </Label>

          <Label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.value.wrap}
              onChange={(e) =>
                settings.setValue({
                  ...settings.value,
                  wrap: e.target.checked,
                })
              }
            />
            Wrap Output
          </Label>

          <Button
            variant="secondary"
            onClick={() => {
              settings.setValue({ ...settings.value, pretty: false });
              run();
            }}
          >
            Minify
          </Button>
        </div>

        {/* Mobile Expanded Advanced */}
        <motion.div
          initial={false}
          animate={{
            height: showAdvanced ? "auto" : 0,
            opacity: showAdvanced ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden lg:hidden"
        >
          <div className="mt-4 flex flex-col gap-3">
            <Label className="flex items-center gap-2 text-sm">
              Indent
              <Select
                value={settings.value.indent}
                onChange={(e) =>
                  settings.setValue({
                    ...settings.value,
                    indent: Number(e.target.value),
                  })
                }
                className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </Select>
            </Label>

            <Label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.value.sortKeys}
                onChange={(e) =>
                  settings.setValue({
                    ...settings.value,
                    sortKeys: e.target.checked,
                  })
                }
              />
              Sort Keys
            </Label>

            <Label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.value.autoRun}
                onChange={(e) =>
                  settings.setValue({
                    ...settings.value,
                    autoRun: e.target.checked,
                  })
                }
              />
              Auto Run
            </Label>

            <Label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.value.wrap}
                onChange={(e) =>
                  settings.setValue({
                    ...settings.value,
                    wrap: e.target.checked,
                  })
                }
              />
              Wrap Output
            </Label>

            <Button
              variant="secondary"
              onClick={() => {
                settings.setValue({ ...settings.value, pretty: false });
                run();
              }}
            >
              Minify
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm">
          {error}
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="flex flex-col h-full">
          <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Input</div>
          <CodeEditor
            className="min-h-[420px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="json"
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-[13px] text-[rgb(var(--muted))] uppercase tracking-wider mb-2 ml-1">Output</div>

            <Button
              size="sm"
              variant="secondary"
              onClick={copyToClipboard}
              disabled={!output}
              className="
      hover:border-[rgba(var(--accent),0.55)]
      hover:bg-[rgba(var(--accent),0.08)]
      transition
    "
            >
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
            className="min-h-[420px]"
            value={output}
            language="json"
            options={{
              readOnly: true,
              wordWrap: settings.value.wrap ? "on" : "off",
            }}
          />
        </div>
      </div>
    </main>
  );
}
