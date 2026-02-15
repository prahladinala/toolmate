"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Mode Toggle */}
      <Card className="mt-6 p-4">
        <div className="flex gap-3">
          <Button
            variant={mode === "encode" ? "primary" : "secondary"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "encode" ? "primary" : "secondary"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>
      </Card>

      {error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        {/* Input */}
        <Card className="p-5">
          <div className="flex justify-between">
            <div className="font-medium">Input</div>
            <button
              onClick={() => copy(input, "input")}
              className="text-xs underline text-[rgb(var(--accent))]"
            >
              {copied === "input" ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-3 h-[300px] w-full rounded border p-3 font-mono text-sm"
          />

          <div className="mt-3 text-xs text-[rgb(var(--muted))]">
            Characters: {input.length}
          </div>

          <div className="mt-4">
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files[0])
                }
              />

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => fileInputRef.current?.click()}
                className="
      w-full
      rounded-[var(--radius)]
      border border-[rgb(var(--border))]
      bg-[rgb(var(--card-2))]
      px-4 py-2 text-sm
      transition
      hover:border-[rgba(var(--accent),0.55)]
      hover:bg-[rgba(var(--accent),0.08)]
      hover:text-[rgb(var(--accent))]
    "
              >
                Choose File
              </motion.button>
            </div>
          </div>
        </Card>

        {/* Output */}
        <Card className="p-5">
          <div className="flex justify-between">
            <div className="font-medium">Output</div>
            <button
              onClick={() => copy(output, "output")}
              className="text-xs underline text-[rgb(var(--accent))]"
            >
              {copied === "output" ? "Copied ✓" : "Copy"}
            </button>
          </div>

          {/* Smart Display */}
          {mode === "decode" && mimeType?.startsWith("image/") ? (
            <img
              src={`data:${mimeType};base64,${output}`}
              className="mt-4 max-h-[300px] rounded"
              alt="Preview"
            />
          ) : mode === "decode" && mimeType === "application/pdf" ? (
            <iframe
              src={`data:${mimeType};base64,${output}`}
              className="mt-4 h-[300px] w-full rounded"
            />
          ) : (
            <textarea
              readOnly
              value={output}
              className="mt-3 h-[300px] w-full rounded border p-3 font-mono text-sm"
            />
          )}

          {mode === "decode" && (
            <div className="mt-4">
              <Button onClick={downloadFile}>Download File</Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
