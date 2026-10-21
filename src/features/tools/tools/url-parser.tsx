"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_URL = "https://toolmate.co.in/tools?category=developer&search=json&sort=popular#reviews";

export function UrlParserTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, DEFAULT_URL);

  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!input.value.trim()) {
      setParsed(null);
      setError(null);
      return;
    }
    try {
      let val = input.value.trim();
      if (!val.startsWith("http://") && !val.startsWith("https://") && !val.includes("://")) {
        val = "https://" + val;
      }
      const url = new URL(val);
      const searchParams: Record<string, string> = {};
      url.searchParams.forEach((v, k) => {
        searchParams[k] = v;
      });

      setParsed({
        href: url.href,
        protocol: url.protocol,
        origin: url.origin,
        host: url.host,
        hostname: url.hostname,
        port: url.port || "(default)",
        pathname: url.pathname,
        search: url.search || "(none)",
        searchParams,
        hash: url.hash || "(none)",
      });
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid URL format");
      setParsed(null);
    }
  }, [input.value]);

  const copyValue = async (key: string, val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedKey(key);
      toast.success(`Copied ${key}!`);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      {/* Input bar */}
      <div className="w-full p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            type="text"
            className="flex-1 font-mono text-xs sm:text-sm h-11 bg-[rgb(var(--card-2))]"
            value={input.value}
            onChange={(e) => input.setValue(e.target.value)}
            placeholder="https://example.com:8080/path?key=value#hash"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => input.setValue(DEFAULT_URL)}
            className="text-xs h-11 px-3 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {parsed && (
        <div className="space-y-6 w-full min-w-0">
          {/* URL Components Table */}
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))]">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                URL Structural Breakdown
              </span>
            </div>

            <div className="divide-y divide-[rgb(var(--border))]">
              {[
                { label: "Origin", val: parsed.origin },
                { label: "Protocol", val: parsed.protocol },
                { label: "Hostname", val: parsed.hostname },
                { label: "Port", val: parsed.port },
                { label: "Pathname", val: parsed.pathname },
                { label: "Search / Query", val: parsed.search },
                { label: "Hash / Anchor", val: parsed.hash },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[rgb(var(--card-2))]/50 transition-colors"
                >
                  <span className="text-xs font-semibold text-[rgb(var(--muted))] sm:w-36 shrink-0">
                    {row.label}
                  </span>
                  <span className="font-mono text-xs text-[rgb(var(--fg))] break-all flex-1 select-all">
                    {row.val}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyValue(row.label, row.val)}
                    className="self-end sm:self-auto p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors"
                    title={`Copy ${row.label}`}
                  >
                    {copiedKey === row.label ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Query Parameters Table */}
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[rgb(var(--border))] flex items-center justify-between bg-[rgb(var(--card-2))]">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Query Parameters ({Object.keys(parsed.searchParams).length})
              </span>
            </div>

            {Object.keys(parsed.searchParams).length > 0 ? (
              <div className="divide-y divide-[rgb(var(--border))]">
                {Object.entries(parsed.searchParams).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[rgb(var(--card-2))]/50 transition-colors"
                  >
                    <span className="font-mono text-xs font-semibold text-indigo-500 sm:w-48 shrink-0 break-all">
                      {k}
                    </span>
                    <span className="font-mono text-xs text-[rgb(var(--fg))] break-all flex-1 select-all">
                      {v as string}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyValue(k, v as string)}
                      className="self-end sm:self-auto p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors"
                      title={`Copy ${k}`}
                    >
                      {copiedKey === k ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[rgb(var(--muted))]">
                No query parameters present in this URL.
              </div>
            )}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
