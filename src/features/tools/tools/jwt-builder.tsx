"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

function base64url(source: CryptoJS.lib.WordArray) {
  let encodedSource = CryptoJS.enc.Base64.stringify(source);
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}

const DEFAULT_HEADER = {
  alg: "HS256",
  typ: "JWT"
};

const DEFAULT_PAYLOAD = {
  sub: "1234567890",
  name: "John Doe",
  iat: 1516239022
};

export default function JWTBuilder() {
  const [headerStr, setHeaderStr] = useState(JSON.stringify(DEFAULT_HEADER, null, 2));
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(DEFAULT_PAYLOAD, null, 2));
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState("");

  const buildJwt = useCallback(() => {
    try {
      setError("");
      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      if (headerObj.alg !== "HS256") {
        throw new Error("Currently, only HS256 algorithm is supported by this builder.");
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

  return (
    <main className="w-full max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-4 space-y-4 shadow-sm border border-[rgba(var(--fg),0.1)]">
            <div className="space-y-2">
              <Label className="text-red-500 font-semibold">HEADER: ALGORITHM & TOKEN TYPE</Label>
              <CodeEditor 
                value={headerStr} 
                onChange={setHeaderStr} 
                language="json" 
                className="!min-h-[150px] !h-[150px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-purple-500 font-semibold">PAYLOAD: DATA</Label>
              <CodeEditor 
                value={payloadStr} 
                onChange={setPayloadStr} 
                language="json" 
                className="!min-h-[200px] !h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-cyan-500 font-semibold">VERIFY SIGNATURE (HS256)</Label>
              <div className="bg-muted/30 p-3 rounded-lg border font-mono text-sm space-y-2">
                <div>HMACSHA256(</div>
                <div className="pl-4 text-muted-foreground">base64UrlEncode(header) + "." +</div>
                <div className="pl-4 text-muted-foreground">base64UrlEncode(payload),</div>
                <Input 
                  value={secret} 
                  onChange={(e) => setSecret(e.target.value)} 
                  placeholder="your-256-bit-secret" 
                  className="font-mono text-cyan-500 bg-background"
                />
                <div>)</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4 space-y-4 shadow-sm border border-[rgba(var(--fg),0.1)] h-full flex flex-col">
            <Label className="font-semibold text-lg">Generated JWT</Label>
            {error ? (
              <div className="text-destructive font-mono text-sm bg-destructive/10 p-4 rounded-xl flex-1">
                {error}
              </div>
            ) : (
              <div className="font-mono text-lg break-all p-4 rounded-xl bg-background border flex-1 leading-relaxed">
                <span className="text-red-500">{jwt.split(".")[0]}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-purple-500">{jwt.split(".")[1]}</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-cyan-500">{jwt.split(".")[2]}</span>
              </div>
            )}
            <Button 
              className="w-full" 
              disabled={!!error}
              onClick={() => navigator.clipboard.writeText(jwt)}
            >
              Copy to Clipboard
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
