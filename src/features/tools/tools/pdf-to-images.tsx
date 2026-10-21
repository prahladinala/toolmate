"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { renderPDFPagesToImages, RenderedPageImage } from "@/lib/pdf/pdf-to-image-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  FileImage,
  CheckCircle2,
  Images,
} from "lucide-react";

export function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [qualityScale, setQualityScale] = useState(1.5);
  const [isRendering, setIsRendering] = useState(false);
  const [pages, setPages] = useState<RenderedPageImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processPdf = async (selected: File, fmt = format, scale = qualityScale) => {
    setIsRendering(true);
    setPages([]);
    try {
      const rendered = await renderPDFPagesToImages(selected, {
        format: fmt,
        scale,
      });
      setPages(rendered);
    } catch (err) {
      console.error("Failed to render PDF to images:", err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleFile = (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    processPdf(selected);
  };

  const downloadSinglePage = (page: RenderedPageImage) => {
    if (!file) return;
    const ext = format === "image/jpeg" ? "jpg" : "png";
    const base = file.name.replace(/\.pdf$/i, "");
    downloadBlob(page.blob, `${base}-page-${page.pageNum}.${ext}`);
  };

  const downloadAllPages = () => {
    pages.forEach((page, idx) => {
      setTimeout(() => downloadSinglePage(page), idx * 300);
    });
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Format:</span>
              <select
                value={format}
                onChange={(e) => {
                  const fmt = e.target.value as any;
                  setFormat(fmt);
                  if (file) processPdf(file, fmt, qualityScale);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="image/jpeg">JPG / JPEG (Standard)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Resolution:</span>
              <select
                value={qualityScale}
                onChange={(e) => {
                  const s = parseFloat(e.target.value);
                  setQualityScale(s);
                  if (file) processPdf(file, format, s);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value={1.0}>Normal (72 DPI)</option>
                <option value={1.5}>Medium (150 DPI)</option>
                <option value={2.0}>High (300 DPI)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPages([]);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={pages.length === 0}
              onClick={downloadAllPages}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download All ({pages.length})
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
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <Images className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to extract pages as images
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Converts every page of your PDF into high-resolution JPG or PNG pictures. 100% in-browser.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {isRendering ? (
              <div className="p-12 text-center text-xs text-[rgb(var(--muted))] bg-[rgb(var(--card))] rounded-xl border border-[rgb(var(--border))]">
                Rendering PDF pages into high-resolution images...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pages.map((page) => (
                  <div
                    key={page.pageNum}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden flex flex-col shadow-xs"
                  >
                    <div className="px-3 py-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs">
                      <span className="font-semibold">Page {page.pageNum}</span>
                      <span className="text-[rgb(var(--muted))]">{formatBytes(page.blob.size)}</span>
                    </div>

                    <div className="p-3 flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:12px_12px] min-h-[220px]">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNum}`}
                        className="max-h-[220px] max-w-full h-auto object-contain rounded shadow-xs"
                      />
                    </div>

                    <div className="p-2.5 border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] flex items-center justify-between">
                      <span className="text-[11px] text-[rgb(var(--muted))]">
                        {page.width} × {page.height}px
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadSinglePage(page)}
                        className="h-7 px-2.5 text-xs gap-1"
                      >
                        <Download className="w-3 h-3" /> Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
