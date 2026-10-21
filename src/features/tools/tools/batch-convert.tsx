"use client";

import React, { useState, useRef } from "react";
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
  CheckCircle2,
  FileCheck,
  Layers,
  Trash2,
} from "lucide-react";

interface BatchItem {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  result?: CompressedImageResult;
}

export function BatchImageConverterTool() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/webp");
  const [quality, setQuality] = useState(0.85);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const newItems: BatchItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || f.name.match(/\.(png|jpg|jpeg|webp|avif|heic|bmp)$/i))
      .map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        status: "pending",
      }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const processBatch = async () => {
    setIsProcessingAll(true);
    for (let i = 0; i < items.length; i++) {
      if (items[i].status === "done") continue;

      setItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: "processing" } : item))
      );

      try {
        const res = await compressAndConvertImage(items[i].file, {
          format: targetFormat,
          quality,
        });

        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "done", result: res } : item
          )
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error" } : item
          )
        );
      }
    }
    setIsProcessingAll(false);
  };

  const downloadItem = (item: BatchItem) => {
    if (!item.result) return;
    const ext = targetFormat === "image/jpeg" ? "jpg" : targetFormat === "image/png" ? "png" : "webp";
    const base = item.file.name.substring(0, item.file.name.lastIndexOf(".")) || item.file.name;
    downloadBlob(item.result.blob, `${base}-converted.${ext}`);
  };

  const downloadAll = () => {
    items.forEach((item, index) => {
      if (item.result) {
        setTimeout(() => downloadItem(item), index * 300);
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Convert To:</span>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="image/webp">WebP (.webp)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/jpeg">JPEG (.jpg)</option>
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
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-20 accent-[rgb(var(--accent))]"
                />
                <span className="font-semibold text-xs min-w-[28px]">{Math.round(quality * 100)}%</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setItems([])}
                  className="h-8 gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear All
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={processBatch}
                  disabled={isProcessingAll}
                  className="h-8 gap-1.5 text-xs font-medium"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  {isProcessingAll ? "Converting..." : "Convert All"}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={downloadAll}
                  disabled={!items.some((i) => i.status === "done")}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Download All
                </Button>
              </>
            )}
          </div>
        </ToolToolbar>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--card-2))]/50 bg-[rgb(var(--card))] flex flex-col items-center justify-center gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
            }}
          />
          <div className="w-12 h-12 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[rgb(var(--foreground))]">
              Select or drop multiple images to convert in batch
            </h3>
            <p className="text-xs text-[rgb(var(--muted))] mt-0.5">
              Supports bulk upload of JPG, PNG, WebP, AVIF, HEIC. All files processed securely in-browser.
            </p>
          </div>
        </div>

        {/* File Queue List */}
        {items.length > 0 && (
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs font-semibold">
              <span>QUEUED IMAGES ({items.length})</span>
              <span>
                {items.filter((i) => i.status === "done").length} / {items.length} Ready
              </span>
            </div>

            <div className="divide-y divide-[rgb(var(--border))] max-h-[480px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-[rgb(var(--foreground))] truncate max-w-[200px] sm:max-w-[320px]">
                      {item.file.name}
                    </span>
                    <span className="text-[rgb(var(--muted))] shrink-0">{formatBytes(item.file.size)}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.status === "pending" && (
                      <span className="text-[rgb(var(--muted))] text-xs font-medium">Pending</span>
                    )}
                    {item.status === "processing" && (
                      <span className="text-[rgb(var(--accent))] text-xs font-medium">Converting...</span>
                    )}
                    {item.status === "done" && item.result && (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 font-semibold">{formatBytes(item.result.newSize)}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => downloadItem(item)}
                          className="h-7 px-2 text-xs"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[rgb(var(--muted))] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
