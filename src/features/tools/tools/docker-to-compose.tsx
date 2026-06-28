"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import composerize from "composerize";

export function DockerToComposeTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      // composerize expects a clean command string
      const cmd = input.value.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();
      if (!cmd.startsWith("docker run") && !cmd.startsWith("docker create")) {
        throw new Error("Input must be a valid 'docker run' or 'docker create' command.");
      }
      const yamlStr = composerize(cmd);
      setOutput(yamlStr);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to convert command.");
    }
  }, [input.value]);

  useEffect(() => {
    convert();
  }, [convert]);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Docker Run to Docker Compose</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Paste a long <code>docker run</code> command to instantly convert it into a <code>docker-compose.yml</code> file.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm text-red-500 whitespace-pre-wrap font-mono">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Docker Run Command</div>
            <Button size="sm" variant="secondary" onClick={input.clear}>Clear</Button>
          </div>
          <CodeEditor
            className="min-h-[400px]"
            value={input.value}
            onChange={(value) => input.setValue(value || "")}
            language="shell"
            options={{ wordWrap: "on" }}
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">docker-compose.yml</div>
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
            className="min-h-[400px]"
            value={output}
            language="yaml"
            options={{ readOnly: true }}
          />
        </div>
      </div>
    </main>
  );
}
