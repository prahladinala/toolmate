"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Mode = "encode" | "decode";

export default function UrlEncoderDecoderTool() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [useComponent, setUseComponent] = React.useState(true);
  const [autoRun, setAutoRun] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  const run = React.useCallback(() => {
    setError(null);
    if (!input) {
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
      setError(e.message);
    }
  }, [input, mode, useComponent]);

  React.useEffect(() => {
    if (autoRun) run();
  }, [run, autoRun]);

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const parseQuery = () => {
    try {
      const params = new URLSearchParams(input);
      const obj: Record<string, string> = {};
      params.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    } catch {
      return null;
    }
  };

  const queryObject = parseQuery();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Controls */}
      <Card className="mt-6 p-5 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={mode === "encode" ? "primary" : "secondary"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "encode" ? "primary" : "secondary"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
          <Button variant="secondary" onClick={clear}>
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label>
            <input
              type="checkbox"
              checked={useComponent}
              onChange={(e) => setUseComponent(e.target.checked)}
            />{" "}
            Use encodeURIComponent
          </label>

          <label>
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
            />{" "}
            Auto Run
          </label>
        </div>
      </Card>

      {error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Input */}
        <Card className="p-5">
          <div className="flex justify-between">
            <div className="font-medium">Input</div>
            <button
              onClick={() => copy(input, "input")}
              className="text-xs underline text-[rgb(var(--accent))]"
            >
              {copied === "input" ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-3 h-[250px] w-full rounded border p-3 font-mono text-sm"
          />
        </Card>

        {/* Output */}
        <Card className="p-5">
          <div className="flex justify-between">
            <div className="font-medium">Output</div>
            <button
              onClick={() => copy(output, "output")}
              className="text-xs underline text-[rgb(var(--accent))]"
            >
              {copied === "output" ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <textarea
            readOnly
            value={output}
            className="mt-3 h-[250px] w-full rounded border p-3 font-mono text-sm"
          />
        </Card>
      </div>

      {/* Query Inspector */}
      {mode === "decode" &&
        queryObject &&
        Object.keys(queryObject).length > 0 && (
          <Card className="mt-6 p-5">
            <div className="font-medium mb-3">Query Parameters</div>
            <div className="space-y-2 text-sm">
              {Object.entries(queryObject).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-1">
                  <span className="text-[rgb(var(--muted))]">{key}</span>
                  <span className="font-mono break-all">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
    </main>
  );
}
