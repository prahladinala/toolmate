"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Key, AlertCircle } from "lucide-react";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

function base64url(source: CryptoJS.lib.WordArray) {
  let encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, "");
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");
  return encodedSource;
}

const DEFAULT_HEADER = {
  alg: "HS256",
  typ: "JWT",
};

const DEFAULT_PAYLOAD = {
  sub: "usr_1024",
  name: "John Doe",
  role: "admin",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

export default function JWTBuilder() {
  const [headerStr, setHeaderStr] = useState(JSON.stringify(DEFAULT_HEADER, null, 2));
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [secret, setSecret] = useState("my-super-secret-key-32-chars");
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const buildJwt = useCallback(() => {
    try {
      setError("");
      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      if (headerObj.alg !== "HS256") {
        throw new Error("Only HS256 algorithm is currently supported by this interactive builder.");
      }

      const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(headerObj));
      const encodedHeader = base64url(stringifiedHeader);

      const stringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payloadObj));
      const encodedPayload = base64url(stringifiedPayload);

      const token = encodedHeader + "." + encodedPayload;
      const signature = CryptoJS.HmacSHA256(token, secret);
      const encodedSignature = base64url(signature);

      setJwt(token + "." + encodedSignature);
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax");
      setJwt("");
    }
  }, [headerStr, payloadStr, secret]);

  useEffect(() => {
    buildJwt();
  }, [buildJwt]);

  const copyJwt = async () => {
    if (!jwt) return;
    try {
      await navigator.clipboard.writeText(jwt);
      toast.success("JWT token copied!");
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
          Construct and sign HMAC-SHA256 (HS256) JSON Web Tokens in real time
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={copyJwt}
          disabled={!jwt}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Token
            </>
          )}
        </Button>
      </ToolToolbar>

      {/* Secret Bar */}
      <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-1.5">
        <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
          HMAC-SHA256 Signing Secret
        </label>
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500 shrink-0" />
          <Input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="text-xs sm:text-sm font-mono h-10 bg-[rgb(var(--card-2))]"
            placeholder="Signing key secret..."
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        <div className="flex flex-col min-w-0 w-full space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-rose-500">
            Header (JSON)
          </span>
          <CodeEditor
            value={headerStr}
            onChange={(v) => setHeaderStr(v || "")}
            language="json"
            minHeight="min-h-[160px] sm:min-h-[200px]"
          />
        </div>

        <div className="flex flex-col min-w-0 w-full space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-purple-500">
            Payload Claims (JSON)
          </span>
          <CodeEditor
            value={payloadStr}
            onChange={(v) => setPayloadStr(v || "")}
            language="json"
            minHeight="min-h-[160px] sm:min-h-[200px]"
          />
        </div>
      </div>

      {/* Generated Token */}
      <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
        <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
          Signed JWT Token
        </span>
        <div className="p-4 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] font-mono text-xs sm:text-sm break-all select-all font-semibold leading-relaxed">
          {jwt ? (
            (() => {
              const parts = jwt.split(".");
              return (
                <>
                  <span className="text-rose-500">{parts[0]}</span>
                  <span className="text-[rgb(var(--fg))]">.</span>
                  <span className="text-purple-500">{parts[1]}</span>
                  <span className="text-[rgb(var(--fg))]">.</span>
                  <span className="text-cyan-500">{parts[2]}</span>
                </>
              );
            })()
          ) : (
            <span className="text-[rgb(var(--muted))] font-normal">Resolving valid JWT...</span>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
