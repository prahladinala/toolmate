"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import {
  compressAndConvertImage,
  formatBytes,
  downloadBlob,
  CompressedImageResult,
} from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  FileImage,
} from "lucide-react";

interface ImageConverterProps {
  tool?: any;
  defaultTargetFormat?: "image/jpeg" | "image/png" | "image/webp";
  fixedTargetName?: string;
  toolTitle?: string;
}

export function ImageConverterTool({
  defaultTargetFormat = "image/png",
  fixedTargetName,
  toolTitle,
}: ImageConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">(
    defaultTargetFormat
  );
  const [quality, setQuality] = useState(0.92);
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(
    async (src: File, fmt = targetFormat, q = quality) => {
      setIsProcessing(true);
      try {
        const res = await compressAndConvertImage(src, {
          format: fmt,
          quality: q,
          maxWidth: 4096,
          maxHeight: 4096,
        });
        setResult(res);
      } catch (err) {
        console.error("Conversion failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [targetFormat, quality]
  );

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/") && !selected.name.match(/\.(heic|heif|avif|webp|png|jpg|jpeg|bmp|gif)$/i)) {
      return;
    }
    setFile(selected);
    setPreviewOriginal(URL.createObjectURL(selected));
    convertFile(selected);
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
    const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    downloadBlob(result.blob, `${base}.${ext}`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Target Format:</span>
              <select
                value={targetFormat}
                onChange={(e) => {
                  const f = e.target.value as any;
                  setTargetFormat(f);
                  if (file) convertFile(file, f, quality);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="image/png">PNG (.png) — Lossless</option>
                <option value="image/jpeg">JPG / JPEG (.jpg) — Standard</option>
                <option value="image/webp">WebP (.webp) — Modern Web</option>
              </select>
            </div>

            {targetFormat !== "image/png" && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-[rgb(var(--muted))]">Quality:</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    const q = parseFloat(e.target.value);
                    setQuality(q);
                    if (file) convertFile(file, targetFormat, q);
                  }}
                  className="w-20 accent-[rgb(var(--accent))]"
                />
                <span className="font-semibold text-xs min-w-[28px]">{Math.round(quality * 100)}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPreviewOriginal(null);
                  setResult(null);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!result}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download Converted File
            </Button>
          </div>
        </ToolToolbar>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--card-2))]/50 bg-[rgb(var(--card))] flex flex-col items-center justify-center gap-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif,.avif,.webp,.bmp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <RefreshCw className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                {toolTitle || "Click or drag & drop image to convert format"}
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Convert between JPG, PNG, WebP, AVIF, HEIC, and BMP. Fast, 100% private in-browser conversion.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Lossless conversion available
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                <span className="font-semibold text-[rgb(var(--muted))]">ORIGINAL FILE</span>
                <span className="text-[rgb(var(--muted))]">{formatBytes(file.size)}</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[320px]">
                {previewOriginal && (
                  <img
                    src={previewOriginal}
                    alt="Original"
                    className="max-h-[350px] max-w-full h-auto object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-500">CONVERTED RESULT</span>
                {result && <span className="font-semibold text-emerald-500">{formatBytes(result.newSize)}</span>}
              </div>
              <div className="p-4 flex items-center justify-center min-h-[320px]">
                {isProcessing ? (
                  <div className="text-xs text-[rgb(var(--muted))]">Converting image format...</div>
                ) : result ? (
                  <img
                    src={result.dataUrl}
                    alt="Converted output"
                    className="max-h-[350px] max-w-full h-auto object-contain rounded-lg shadow-sm"
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
