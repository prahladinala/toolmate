"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import { toast } from "sonner";

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mimeType, setMimeType] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
        .reduce((data, byte) => data + String.fromCharCode(byte), ""),
    );

  const decodeBinary = (base64: string) => {
    const binary = atob(base64);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  };

  const run = () => {
    setError(null);
    setMimeType(null);

    if (!input) {
      setOutput("");
      return;
    }

    if (mode === "encode") {
      try {
        setOutput(encodeUTF8(input));
      } catch {
        setError("Encoding failed.");
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
        setError("Invalid Base64 string.");
      }
    }
  };

  React.useEffect(() => {
    run();
  }, [input, mode]);

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
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
    <div className="w-full space-y-8">
      {/* Sleek Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 bg-[rgba(var(--fg),0.03)] rounded-full border border-[rgba(var(--fg),0.05)]">
          <Button
            onClick={() => setMode("encode")}
            className={`px-8 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${
              mode === "encode"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))] shadow-md"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Encode
          </Button>
          <Button
            onClick={() => setMode("decode")}
            className={`px-8 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${
              mode === "decode"
                ? "bg-[rgb(var(--fg))] text-[rgb(var(--bg))] shadow-md"
                : "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
            }`}
          >
            Decode
          </Button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 flex items-center gap-3 font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-bold uppercase tracking-widest text-[rgb(var(--muted))] flex items-center gap-2">
              Input
              <span className="px-2 py-0.5 rounded-full bg-[rgba(var(--fg),0.05)] text-[10px]">{input.length} chars</span>
            </div>
            <Button onClick={() => copy(input, "input")} className="text-xs font-semibold hover:text-[rgb(var(--accent))] transition-colors">
              {copied === "input" ? "Copied ✓" : "Copy"}
            </Button>
          </div>

          <CodeEditor
            value={input}
            onChange={(v) => setInput(v || "")}
            className="!min-h-[400px]"
            language="plaintext"
          />

          <div className="flex items-center gap-3">
             <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
             <Button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[rgba(var(--fg),0.1)] text-sm font-medium text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:border-[rgba(var(--fg),0.3)] hover:bg-[rgba(var(--fg),0.02)] transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Upload File Instead
             </Button>
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-bold uppercase tracking-widest text-[rgb(var(--muted))]">Output</div>
            <Button onClick={() => copy(output, "output")} className="text-xs font-semibold hover:text-[rgb(var(--accent))] transition-colors">
              {copied === "output" ? "Copied ✓" : "Copy"}
            </Button>
          </div>

          {/* Smart Display */}
          {mode === "decode" && mimeType?.startsWith("image/") ? (
            <div className="min-h-[400px] flex items-center justify-center rounded-xl ring-1 ring-[rgba(var(--fg),0.06)] shadow-inner bg-[#0D1117] overflow-hidden p-8">
              <img src={`data:${mimeType};base64,${output}`} className="max-w-full max-h-[340px] rounded object-contain shadow-2xl" alt="Decoded Preview" />
            </div>
          ) : mode === "decode" && mimeType === "application/pdf" ? (
            <div className="min-h-[400px] rounded-xl ring-1 ring-[rgba(var(--fg),0.06)] shadow-inner bg-[#0D1117] overflow-hidden">
              <iframe src={`data:${mimeType};base64,${output}`} className="w-full h-full min-h-[400px]" />
            </div>
          ) : (
            <CodeEditor
              value={output}
              editable={false}
              className="!min-h-[400px]"
              language="plaintext"
            />
          )}

          {mode === "decode" && output && (
            <Button onClick={downloadFile} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] text-sm font-bold shadow-lg hover:shadow-[rgb(var(--fg))]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Decoded File
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

