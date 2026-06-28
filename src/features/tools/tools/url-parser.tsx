"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";

export function UrlParserTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input`;
  const input = usePersistedState<string>(inputKey, "https://toolmate.co.in/tools?search=json&sort=asc#features");
  
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!input.value.trim()) {
      setParsed(null);
      setError(null);
      return;
    }
    try {
      let val = input.value.trim();
      if (!val.startsWith("http://") && !val.startsWith("https://") && !val.includes("://")) {
        val = "http://" + val;
      }
      const url = new URL(val);
      const searchParams: Record<string, string> = {};
      url.searchParams.forEach((v, k) => { searchParams[k] = v; });

      setParsed({
        href: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        searchParams,
        hash: url.hash,
      });
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid URL");
      setParsed(null);
    }
  }, [input.value]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-center">
        <h2 className="mb-4 text-xl font-medium">URL Parser</h2>
        <input
          type="text"
          className="w-full rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-3 text-lg font-mono outline-none focus:border-blue-500"
          value={input.value}
          onChange={(e) => input.setValue(e.target.value)}
          placeholder="https://example.com/path?key=value#hash"
        />
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      </div>

      {parsed && (
        <div className="grid gap-6">
          <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h3 className="font-medium mb-4 pb-2 border-b border-[rgb(var(--border))]">URL Parts</h3>
            <div className="grid grid-cols-[120px_1fr] gap-4 font-mono text-sm break-all">
              <div className="text-neutral-500">Protocol</div><div>{parsed.protocol}</div>
              <div className="text-neutral-500">Hostname</div><div>{parsed.hostname}</div>
              <div className="text-neutral-500">Port</div><div>{parsed.port || "(default)"}</div>
              <div className="text-neutral-500">Pathname</div><div>{parsed.pathname}</div>
              <div className="text-neutral-500">Hash</div><div>{parsed.hash || "(none)"}</div>
            </div>
          </div>
          
          <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h3 className="font-medium mb-4 pb-2 border-b border-[rgb(var(--border))]">Query Parameters</h3>
            {Object.keys(parsed.searchParams).length > 0 ? (
              <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 font-mono text-sm break-all">
                {Object.entries(parsed.searchParams).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <div className="text-blue-500 font-bold">{k}</div>
                    <div>{String(v)}</div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">No query parameters found.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
