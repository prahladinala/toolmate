"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolSplitPane } from "@/components/tools/ToolSplitPane";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { toast } from "sonner";
import { Copy, Check, Download, Upload, AlertCircle, RefreshCw } from "lucide-react";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanBase64 = (str: string) =>
    str.replace(/^data:.*;base64,/, "").trim();

  const detectMime = (bytes: Uint8Array) => {
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
    if (bytes[0] === 0x25 && bytes[1] === 0x50) return "application/pdf";
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46
    )
      return "image/webp";
    return "text/plain";
  };

  const encodeUTF8 = (str: string) =>
    btoa(
      new TextEncoder()
        .encode(str)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

  const decodeBinary = (base64: string) => {
    const binary = atob(base64);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  };

  const run = () => {
    setError(null);
    setMimeType(null);

    if (!input.trim()) {
      setOutput("");
      return;
    }

    if (mode === "encode") {
      try {
        setOutput(encodeUTF8(input));
      } catch {
        setError("Encoding failed. Ensure text contains valid characters.");
      }
    } else {
      try {
        const cleaned = cleanBase64(input);
        const bytes = decodeBinary(cleaned);

        const mime = detectMime(bytes);
        setMimeType(mime);

        if (mime === "text/plain") {
          const decoded = new TextDecoder().decode(bytes);
          setOutput(decoded);
        } else {
          setOutput(cleaned);
        }
      } catch {
        setError("Invalid Base64 string format.");
      }
    }
  };

  useEffect(() => {
    run();
  }, [input, mode]);

  const copy = async (value: string, key: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  const downloadFile = () => {
    if (!input) return;

    try {
      const cleaned = cleanBase64(input);
      const bytes = decodeBinary(cleaned);
      const mime = detectMime(bytes);

      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);

      const ext = mime.split("/")[1] || "bin";
      const a = document.createElement("a");
      a.href = url;
      a.download = `decoded.${ext}`;
      a.click();
    } catch {
      setError("Download failed.");
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setInput(base64);
      setMode("decode");
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolWorkspace>
      {/* TOOLBAR */}
      <ToolToolbar>
        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))]">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "encode"
                ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))] shadow-sm"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "decode"
                ? "bg-[rgb(var(--accent))] text-[rgb(var(--on-accent))] shadow-sm"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Decode
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files && handleFileUpload(e.target.files[0])
            }
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput("");
              setOutput("");
              setError(null);
            }}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--danger))]"
          >
            Clear
          </Button>
        </div>
      </ToolToolbar>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-mono break-words-safe">{error}</div>
        </div>
      )}

      {/* SPLIT PANE */}
      <ToolSplitPane
        hasOutput={Boolean(output)}
        inputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              {mode === "encode" ? "Plain Text / Input" : "Base64 Input"}
            </span>
            <span className="text-[11px] text-[rgb(var(--muted))]">
              {input ? `${input.length} chars` : "Empty"}
            </span>
          </div>
        }
        outputHeader={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
              {mode === "encode" ? "Base64 Output" : "Decoded Result"}
            </span>
            <div className="flex items-center gap-1.5">
              {mode === "decode" && output && mimeType !== "text/plain" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={downloadFile}
                  className="h-7 text-xs px-2 gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => copy(output, "output")}
                disabled={!output}
                className="h-7 text-xs px-2.5 gap-1"
              >
                {copied === "output" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        }
        input={
          <CodeEditor
            value={input}
            onChange={(val) => setInput(val || "")}
            language="plaintext"
            options={{ wordWrap: "on" }}
          />
        }
        output={
          mode === "decode" && mimeType?.startsWith("image/") ? (
            <div className="w-full min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] flex items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${mimeType};base64,${output}`}
                className="max-w-full max-h-[320px] rounded-lg object-contain shadow-md"
                alt="Decoded Preview"
              />
            </div>
          ) : (
            <CodeEditor
              value={output}
              language="plaintext"
              options={{ readOnly: true, wordWrap: "on" }}
            />
          )
        }
      />
    </ToolWorkspace>
  );
}
