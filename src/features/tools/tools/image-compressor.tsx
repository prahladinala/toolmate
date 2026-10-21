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
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<CompressedImageResult | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/webp");
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (uploadedFile: File, fmt = format, q = quality, mw = maxWidth) => {
      setIsProcessing(true);
      try {
        const res = await compressAndConvertImage(uploadedFile, {
          format: fmt,
          quality: q,
          maxWidth: mw,
        });
        setResult(res);
      } catch (err) {
        console.error("Compression error:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [format, quality, maxWidth]
  );

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewOriginal(url);
    processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewOriginal(null);
    setResult(null);
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    downloadBlob(result.blob, `${baseName}-compressed.${ext}`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        {/* Controls Bar */}
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Format:</span>
              <select
                value={format}
                onChange={(e) => {
                  const newFmt = e.target.value as any;
                  setFormat(newFmt);
                  if (file) processFile(file, newFmt, quality, maxWidth);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-medium"
              >
                <option value="image/webp">WebP (Best Compression)</option>
                <option value="image/jpeg">JPEG (Standard)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Quality:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => {
                  const newQ = parseFloat(e.target.value);
                  setQuality(newQ);
                  if (file) processFile(file, format, newQ, maxWidth);
                }}
                className="w-24 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[36px]">{Math.round(quality * 100)}%</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Max Width:</span>
              <select
                value={maxWidth}
                onChange={(e) => {
                  const newW = parseInt(e.target.value, 10);
                  setMaxWidth(newW);
                  if (file) processFile(file, format, quality, newW);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-medium"
              >
                <option value={3840}>Original (Up to 4K)</option>
                <option value={1920}>Full HD (1920px)</option>
                <option value={1280}>HD (1280px)</option>
                <option value={800}>Web Small (800px)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button variant="secondary" size="sm" onClick={handleReset} className="h-8 gap-1.5 text-xs">
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
              <Download className="w-3.5 h-3.5" /> Download Compressed
            </Button>
          </div>
        </ToolToolbar>

        {/* Upload Dropzone */}
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? "border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)]"
                : "border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--card-2))]/50 bg-[rgb(var(--card))]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop image to compress
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Supports JPG, PNG, WebP, AVIF, GIF. 100% processed in your browser. No files are uploaded.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Safe, private & client-side
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            {result && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                  <div className="text-xs font-medium text-[rgb(var(--muted))]">Original Size</div>
                  <div className="text-xl font-bold mt-1 text-[rgb(var(--foreground))]">
                    {formatBytes(result.originalSize)}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                  <div className="text-xs font-medium text-[rgb(var(--muted))]">Compressed Size</div>
                  <div className="text-xl font-bold mt-1 text-[rgb(var(--accent))]">
                    {formatBytes(result.newSize)}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
                  <div className="text-xs font-medium text-[rgb(var(--muted))]">Reduction Savings</div>
                  <div className="text-xl font-bold mt-1 text-emerald-500">
                    {result.reductionPercentage > 0 ? `-${result.reductionPercentage}%` : "0%"}
                  </div>
                </div>
              </div>
            )}

            {/* Before / After Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[rgb(var(--muted))]">ORIGINAL</span>
                  {file && <span className="text-[rgb(var(--muted))]">{formatBytes(file.size)}</span>}
                </div>
                <div className="p-4 flex items-center justify-center min-h-[300px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
                  {previewOriginal && (
                    <img
                      src={previewOriginal}
                      alt="Original"
                      className="max-h-[360px] max-w-full h-auto object-contain rounded-lg shadow-sm"
                    />
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-500">COMPRESSED PREVIEW</span>
                  {result && (
                    <span className="font-semibold text-emerald-500">
                      {formatBytes(result.newSize)} ({result.width}×{result.height})
                    </span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center min-h-[300px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
                  {isProcessing ? (
                    <div className="text-center text-xs text-[rgb(var(--muted))]">Compressing...</div>
                  ) : result ? (
                    <img
                      src={result.dataUrl}
                      alt="Compressed result"
                      className="max-h-[360px] max-w-full h-auto object-contain rounded-lg shadow-sm"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
