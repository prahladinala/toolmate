"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Clock, AlertCircle, Copy, Check } from "lucide-react";
import cronstrue from "cronstrue";
import { toast } from "sonner";

export function CronParserTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "0 9 * * 1-5");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.value.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = cronstrue.toString(input.value.trim());
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.toString());
      setOutput("");
    }
  }, [input.value]);

  const copyResult = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Human description copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Translate standard 5-part and 6-part CRON expressions into plain human-readable english descriptions
        </span>
      </ToolToolbar>

      {/* Input Hero Card */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm text-center flex flex-col items-center justify-center space-y-6">
        <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
          Enter CRON Schedule
        </label>
        <Input
          type="text"
          className="w-full max-w-md h-14 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] text-center font-mono text-2xl sm:text-3xl font-bold tracking-widest outline-none focus:border-indigo-500"
          value={input.value}
          onChange={(e) => input.setValue(e.target.value)}
          placeholder="* * * * *"
        />

        <div className="w-full max-w-lg">
          {error ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : output ? (
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-lg sm:text-xl flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 shrink-0" />
                <span>&ldquo;{output}&rdquo;</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyResult}
                className="text-xs h-7 px-3 bg-[rgb(var(--card))] text-[rgb(var(--fg))]"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy English Text
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </ToolWorkspace>
  );
}
