"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { removeBackground, downloadBlob, loadImage } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle2,
  Pipette,
  Scissors,
} from "lucide-react";

export function BackgroundRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [tolerance, setTolerance] = useState(25);
  const [feather, setFeather] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"side-by-side" | "result">("side-by-side");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (sourceFile: File, tol = tolerance, fth = feather) => {
    setIsProcessing(true);
    try {
      const res = await removeBackground(sourceFile, {
        tolerance: tol,
        feather: fth,
      });
      setResultUrl(res.dataUrl);
      setResultBlob(res.blob);
    } catch (e) {
      console.error("Background removal error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewOriginal(url);
    processImage(selected);
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    downloadBlob(resultBlob, `${base}-no-bg.png`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewOriginal(null);
    setResultUrl(null);
    setResultBlob(null);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Threshold:</span>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTolerance(val);
                  if (file) processImage(file, val, feather);
                }}
                className="w-24 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[28px]">{tolerance}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Edge Softness:</span>
              <input
                type="range"
                min="0"
                max="10"
                value={feather}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFeather(val);
                  if (file) processImage(file, tolerance, val);
                }}
                className="w-20 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[20px]">{feather}px</span>
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
              disabled={!resultBlob}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </Button>
          </div>
        </ToolToolbar>

        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
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
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop photo to remove background
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Fast, private client-side segmentation. Creates transparent PNG in seconds without uploading to a server.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% in-browser processing
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                <span className="font-semibold text-[rgb(var(--muted))]">ORIGINAL</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[340px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
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
                <span className="font-semibold text-emerald-500">TRANSPARENT PNG OUTPUT</span>
              </div>
              <div
                className="p-4 flex items-center justify-center min-h-[340px]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {isProcessing ? (
                  <div className="text-xs text-[rgb(var(--muted))] bg-[rgb(var(--card))]/90 px-3 py-1.5 rounded-lg shadow-sm">
                    Processing background...
                  </div>
                ) : resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Background removed"
                    className="max-h-[360px] max-w-full h-auto object-contain drop-shadow-md"
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
