"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { toast } from "sonner";
import { Copy, Check, Play, AlertCircle, Sparkles } from "lucide-react";

type Mode = "encode" | "decode";

const SAMPLE_URL = "https://example.com/search?q=developer tools&filter=fast & free&utm_source=toolmate#preview";

export default function UrlEncoderDecoderTool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useComponent, setUseComponent] = useState(true);
  const [autoRun, setAutoRun] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const run = useCallback(() => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(useComponent ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e: any) {
      setError(e.message || "Failed to process URL.");
    }
  }, [input, mode, useComponent]);

  useEffect(() => {
    if (autoRun) run();
  }, [run, autoRun]);

  const copy = async (value: string, key: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const parseQuery = () => {
    try {
      const search = input.includes("?") ? input.split("?")[1] : input;
      const params = new URLSearchParams(search);
      const obj: Record<string, string> = {};
      params.forEach((value, key) => {
        obj[key] = value;
      });
      return Object.keys(obj).length > 0 ? obj : null;
    } catch {
      return null;
    }
  };

  const queryObject = parseQuery();

  return (
    <ToolWorkspace>
      {/* TOOLBAR */}
      <ToolToolbar>
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
            <button
              type="button"
              onClick={() => setMode("encode")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === "encode"
                  ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))] shadow-sm"
                  : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setMode("decode")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === "decode"
                  ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))] shadow-sm"
                  : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
              }`}
            >
              Decode
            </button>
          </div>

          <Button onClick={run} size="sm" className="gap-1 text-xs sm:text-sm">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Process</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput(SAMPLE_URL)}
            className="text-xs sm:text-sm gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sample</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-xs sm:text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]"
          >
            Clear
          </Button>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={useComponent}
              onChange={(e) => setUseComponent(e.target.checked)}
              className="rounded accent-[rgb(var(--accent))]"
            />
            <span>encodeURIComponent</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              className="rounded accent-[rgb(var(--accent))]"
            />
            <span>Auto Run</span>
          </label>
        </div>
      </ToolToolbar>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
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
              {mode === "encode" ? "URL to Encode" : "Encoded URL to Decode"}
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input ? `${input.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              {mode === "encode" ? "Encoded Result" : "Decoded Result"}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copy(output, "output")}
              disabled={!output}
              className="h-7 text-xs px-2.5 gap-1"
            >
              {copied === "output" ? (
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
            value={input}
            onChange={(val) => setInput(val || "")}
            language="plaintext"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="plaintext"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        }
      />

      {/* QUERY INSPECTOR */}
      {queryObject && (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--fg))]">
              Extracted URL Query Parameters
            </h4>
            <span className="text-xs text-[rgb(var(--muted))]">
              {Object.keys(queryObject).length} params
            </span>
          </div>

          <div className="divide-y divide-[rgb(var(--border))] border border-[rgb(var(--border))] rounded-xl overflow-hidden text-xs sm:text-sm">
            {Object.entries(queryObject).map(([key, val]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-1 bg-[rgb(var(--card-2))]"
              >
                <span className="font-semibold text-indigo-500 font-mono break-words-safe">
                  {key}
                </span>
                <span className="font-mono text-[rgb(var(--fg))] break-words-safe sm:text-right">
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
