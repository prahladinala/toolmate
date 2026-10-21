"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Key, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function RsaKeyGeneratorTool({ tool }: { tool: ToolDef }) {
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState(2048);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

      const pubKeyBase64 = window.btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedPublicKey)))
      );
      const privKeyBase64 = window.btoa(
        String.fromCharCode.apply(null, Array.from(new Uint8Array(exportedPrivateKey)))
      );

      const pubKeyPem = `-----BEGIN PUBLIC KEY-----\n${pubKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
      const privKeyPem = `-----BEGIN PRIVATE KEY-----\n${privKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;

      setKeys({ publicKey: pubKeyPem, privateKey: privKeyPem });
      toast.success(`Generated ${length}-bit RSA keypair!`);
    } catch {
      toast.error("Failed to generate RSA keys");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
            Key Length:
          </label>
          <Select
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-32 h-8 text-xs font-mono bg-[rgb(var(--card-2))]"
          >
            <option value={1024}>1024-bit</option>
            <option value={2048}>2048-bit (Standard)</option>
            <option value={4096}>4096-bit (High)</option>
          </Select>
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={generate}
          loading={loading}
          className="text-xs"
        >
          <Key className="w-3.5 h-3.5 mr-1" />
          Generate New Keypair
        </Button>
      </ToolToolbar>

      {keys ? (
        <ToolSplitPane
          defaultMobileView="both"
          inputHeader={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Public Key (SPKI / PEM)
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => copy(keys.publicKey, "Public Key")}
                className="text-xs h-7 px-2"
              >
                {copiedKey === "Public Key" ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Public Key
                  </>
                )}
              </Button>
            </div>
          }
          outputHeader={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Private Key (PKCS#8 / PEM)
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => copy(keys.privateKey, "Private Key")}
                className="text-xs h-7 px-2"
              >
                {copiedKey === "Private Key" ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Private Key
                  </>
                )}
              </Button>
            </div>
          }
          input={
            <CodeEditor
              value={keys.publicKey}
              language="plaintext"
              editable={false}
              minHeight="min-h-[300px] sm:min-h-[420px]"
            />
          }
          output={
            <CodeEditor
              value={keys.privateKey}
              language="plaintext"
              editable={false}
              minHeight="min-h-[300px] sm:min-h-[420px]"
            />
          }
        />
      ) : (
        <div className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl border-2 border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card))] flex flex-col items-center justify-center p-8 text-center select-none space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold tracking-tight text-[rgb(var(--fg))]">
              Ready to generate an asymmetric RSA keypair
            </span>
            <p className="text-xs text-[rgb(var(--muted))] max-w-sm">
              All mathematical calculations run strictly in your browser using native SubtleCrypto. Keys are never transmitted over any network.
            </p>
          </div>
          <Button
            type="button"
            onClick={generate}
            loading={loading}
            className="text-xs h-10 px-5"
          >
            Generate Keypair Now
          </Button>
        </div>
      )}
    </ToolWorkspace>
  );
}
