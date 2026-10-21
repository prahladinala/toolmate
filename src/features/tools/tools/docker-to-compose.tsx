"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import composerize from "composerize";
import { toast } from "sonner";

const DEFAULT_CMD = "docker run -d -p 8080:80 --name webserver --restart always -v /var/www:/usr/share/nginx/html:ro nginx:alpine";

export function DockerToComposeTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_CMD);
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
      toast.success("Copied compose YAML to clipboard!");
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
          Convert <code>docker run</code> CLI commands into ready-to-use <code>docker-compose.yml</code>
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue(DEFAULT_CMD)}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Sample
          </Button>
        </div>
      </ToolToolbar>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ToolSplitPane
        defaultMobileView="both"
        hasOutput={Boolean(output)}
        inputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Docker Run Command
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={input.clear}
              className="text-xs h-7 px-2"
            >
              Clear
            </Button>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              docker-compose.yml
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
                  Copy YAML
                </>
              )}
            </Button>
          </div>
        }
        input={
          <CodeEditor
            value={input.value}
            onChange={(val) => input.setValue(val || "")}
            language="shell"
            minHeight="min-h-[260px] sm:min-h-[380px]"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          <CodeEditor
            value={output}
            language="yaml"
            editable={false}
            minHeight="min-h-[260px] sm:min-h-[380px]"
          />
        }
      />
    </ToolWorkspace>
  );
}
