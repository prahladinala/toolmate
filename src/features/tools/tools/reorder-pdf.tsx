"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { reorderPDF, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  FileText,
  CheckCircle2,
  ArrowUpDown,
} from "lucide-react";

export function ReorderPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    const initialPages = Array.from({ length: count }, (_, i) => i + 1);
    setPages(initialPages);
  };

  const movePage = (fromIndex: number, direction: "prev" | "next") => {
    const toIndex = direction === "prev" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= pages.length) return;
    const copy = [...pages];
    const temp = copy[fromIndex];
    copy[fromIndex] = copy[toIndex];
    copy[toIndex] = temp;
    setPages(copy);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await reorderPDF(file, pages);
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}-reordered.pdf`);
    } catch (e) {
      console.error("Failed to reorder PDF:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-[rgb(var(--foreground))]">
              {file ? `${file.name} (${pages.length} pages)` : "Upload PDF to reorder"}
            </span>
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
              disabled={!file || isProcessing}
              onClick={handleSave}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isProcessing ? "Reordering..." : "Save & Download PDF"}
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
              <ArrowUpDown className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to rearrange page order
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Visual thumbnail cards allow you to move pages forwards and backwards to resequence documents.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pages.map((originalPageNum, index) => (
              <div
                key={index}
                className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 flex flex-col items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center justify-between w-full text-xs font-semibold">
                  <span className="text-[rgb(var(--accent))]">Pos #{index + 1}</span>
                  <span className="text-[rgb(var(--muted))]">Orig p.{originalPageNum}</span>
                </div>

                <div className="w-20 h-28 bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] rounded flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[rgb(var(--muted))]" />
                </div>

                <div className="flex items-center justify-between w-full pt-1">
                  <button
                    onClick={() => movePage(index, "prev")}
                    disabled={index === 0}
                    className="p-1.5 rounded-md hover:bg-[rgb(var(--card-2))] disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => movePage(index, "next")}
                    disabled={index === pages.length - 1}
                    className="p-1.5 rounded-md hover:bg-[rgb(var(--card-2))] disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
