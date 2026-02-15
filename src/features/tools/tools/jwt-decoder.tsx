"use client";

import React from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";

type Settings = {
  pretty: boolean;
  autoRun: boolean;
};

function base64UrlDecode(str: string) {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function formatTime(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts * 1000);
  return {
    local: d.toLocaleString(),
    iso: d.toISOString(),
  };
}

export default function JwtDecoderTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input:v1`;
  const settingsKey = `toolmate:${tool.slug}:settings:v1`;

  const input = usePersistedState<string>(inputKey, "");
  const settings = usePersistedState<Settings>(settingsKey, {
    pretty: true,
    autoRun: true,
  });

  const [header, setHeader] = React.useState<any>(null);
  const [payload, setPayload] = React.useState<any>(null);
  const [signature, setSignature] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  const decode = React.useCallback(() => {
    setError(null);

    const raw = input.value.replace(/^Bearer\s+/i, "").trim();
    if (!raw) return;

    const parts = raw.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format (must have 3 parts)");
      return;
    }

    const [h, p, s] = parts;

    const headerDecoded = base64UrlDecode(h);
    const payloadDecoded = base64UrlDecode(p);

    if (!headerDecoded || !payloadDecoded) {
      setError("Invalid Base64URL encoding");
      return;
    }

    try {
      setHeader(JSON.parse(headerDecoded));
      setPayload(JSON.parse(payloadDecoded));
      setSignature(s);
    } catch {
      setError("Invalid JSON structure in token");
    }
  }, [input.value]);

  React.useEffect(() => {
    if (settings.value.autoRun) decode();
  }, [input.value, settings.value.autoRun, decode]);

  const copy = async (value: any, type: string) => {
    await navigator.clipboard.writeText(
      typeof value === "string" ? value : JSON.stringify(value, null, 2),
    );
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  const expInfo = payload?.exp ? formatTime(payload.exp) : null;
  const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* SETTINGS BAR */}
      <div className="sticky top-16 z-10 mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
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
            Pretty Format
          </label>

          <label className="flex items-center gap-2 text-sm">
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
            Auto Decode
          </label>

          <Button onClick={decode}>Decode</Button>
          <Button variant="secondary" onClick={input.clear}>
            Clear
          </Button>
        </div>
      </div>

      {/* INPUT */}
      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 shadow-[var(--shadow-sm)]">
        <div className="font-medium">JWT Token</div>
        <textarea
          className="mt-3 h-28 w-full rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-3 font-mono text-sm"
          placeholder="Paste your JWT here..."
          value={input.value}
          onChange={(e) => input.setValue(e.target.value)}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-[var(--radius)] border border-[rgba(var(--danger),0.4)] bg-[rgba(var(--danger),0.08)] p-4 text-sm">
          {error}
        </div>
      )}

      {header && payload && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* HEADER */}
          <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex justify-between">
              <div className="font-medium">Header</div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copy(header, "header")}
              >
                {copied === "header" ? "Copied ✓" : "Copy"}
              </Button>
            </div>
            <pre className="mt-3 text-sm">
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>

          {/* PAYLOAD */}
          <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex justify-between">
              <div className="font-medium">Payload</div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copy(payload, "payload")}
              >
                {copied === "payload" ? "Copied ✓" : "Copy"}
              </Button>
            </div>
            <pre className="mt-3 text-sm">
              {JSON.stringify(payload, null, 2)}
            </pre>

            {expInfo && (
              <div className="mt-4 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] p-3 text-sm">
                <div className="font-medium">
                  Expiration: {isExpired ? "Expired ❌" : "Valid ✅"}
                </div>
                <div className="text-[rgb(var(--muted))]">{expInfo.local}</div>
              </div>
            )}
          </div>

          {/* SIGNATURE */}
          <div className="lg:col-span-2 rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex justify-between">
              <div className="font-medium">Signature</div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copy(signature, "signature")}
              >
                {copied === "signature" ? "Copied ✓" : "Copy"}
              </Button>
            </div>
            <div className="mt-3 break-all font-mono text-sm">{signature}</div>
          </div>
        </div>
      )}
    </main>
  );
}
