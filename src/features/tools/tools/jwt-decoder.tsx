"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { usePersistedState } from "../persistence";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE4MzE4MTkwMjJ9.4PEAftewbA6O9N62FnhjxGXZpNTyW6Id2PXZ8p5whk4";

export default function JwtDecoderTool({ tool }: { tool: ToolDef }) {
  const inputKey = `toolmate:${tool.slug}:input:v1`;
  const input = usePersistedState<string>(inputKey, SAMPLE_JWT);

  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const decode = useCallback(() => {
    setError(null);
    const raw = input.value.replace(/^Bearer\s+/i, "").trim();
    if (!raw) {
      setHeader("");
      setPayload("");
      setSignature("");
      return;
    }

    const parts = raw.split(".");
    if (parts.length < 2) {
      setError("Invalid JWT: A token must contain at least a header and payload separated by dots.");
      return;
    }

    try {
      const decodedHdr = base64UrlDecode(parts[0]);
      const decodedPayload = base64UrlDecode(parts[1]);

      if (decodedHdr) {
        setHeader(JSON.stringify(JSON.parse(decodedHdr), null, 2));
      } else {
        setHeader("Failed to decode base64 header");
      }

      if (decodedPayload) {
        setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));
      } else {
        setPayload("Failed to decode base64 payload");
      }

      setSignature(parts[2] || "(No signature)");
    } catch {
      setError("Failed to parse decoded JSON claims.");
    }
  }, [input.value]);

  useEffect(() => {
    decode();
  }, [decode]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Client-side JSON Web Token decoder. Never transmits secret tokens to any third-party server.
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => input.setValue(SAMPLE_JWT)}
          className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Sample JWT
        </Button>
      </ToolToolbar>

      {/* Raw Token Input */}
      <div className="space-y-2 w-full min-w-0">
        <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
          Encoded JWT String
        </span>
        <CodeEditor
          value={input.value}
          onChange={(v) => input.setValue(v || "")}
          language="plaintext"
          minHeight="min-h-[100px] sm:min-h-[120px]"
          options={{ wordWrap: "on" }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Decoded Claims Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-rose-500">
              Decoded Header
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copy(header, "Header")}
              className="text-xs h-7 px-2"
            >
              {copiedKey === "Header" ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <CodeEditor
            value={header}
            language="json"
            editable={false}
            minHeight="min-h-[220px] sm:min-h-[300px]"
          />
        </div>

        <div className="flex flex-col min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-purple-500">
              Decoded Payload Claims
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => copy(payload, "Payload")}
              className="text-xs h-7 px-2"
            >
              {copiedKey === "Payload" ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <CodeEditor
            value={payload}
            language="json"
            editable={false}
            minHeight="min-h-[220px] sm:min-h-[300px]"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
