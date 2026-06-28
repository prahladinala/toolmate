"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

export function RsaKeyGeneratorTool({ tool }: { tool: ToolDef }) {
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState(2048);

  const generate = async () => {
    setLoading(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: length,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );

      const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const pubKeyBase64 = window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedPublicKey))));
      const privKeyBase64 = window.btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedPrivateKey))));

      const pubKeyPem = `-----BEGIN PUBLIC KEY-----\n${pubKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
      const privKeyPem = `-----BEGIN PRIVATE KEY-----\n${privKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;

      setKeys({ publicKey: pubKeyPem, privateKey: privKeyPem });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            Key Length
            <select
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] px-2 py-1 text-sm"
            >
              <option value={1024}>1024-bit</option>
              <option value={2048}>2048-bit</option>
              <option value={4096}>4096-bit</option>
            </select>
          </label>
          <Button onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate RSA Key Pair"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Public Key</div>
            <Button size="sm" variant="secondary" onClick={() => keys && copy(keys.publicKey)} disabled={!keys}>Copy</Button>
          </div>
          <CodeEditor
            className="mt-3 min-h-[320px]"
            value={keys?.publicKey || ""}
            language="plaintext"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Private Key</div>
            <Button size="sm" variant="secondary" onClick={() => keys && copy(keys.privateKey)} disabled={!keys}>Copy</Button>
          </div>
          <CodeEditor
            className="mt-3 min-h-[320px]"
            value={keys?.privateKey || ""}
            language="plaintext"
            options={{ readOnly: true, wordWrap: "on" }}
          />
        </div>
      </div>
    </main>
  );
}
