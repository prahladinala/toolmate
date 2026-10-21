"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { addPageNumbers, getPDFPageCount, PageNumberOptions } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Hash,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberOptions["position"]>("bottom-center");
  const [format, setFormat] = useState<PageNumberOptions["format"]>("page-x-of-y");
  const [fontSize, setFontSize] = useState(11);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setPageCount(count);
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await addPageNumbers(file, {
        position,
        format,
        fontSize,
      });
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}-numbered.pdf`);
    } catch (e) {
      console.error("Failed to add page numbers:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Position:</span>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Format:</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="page-x-of-y">Page 1 of 10</option>
                <option value="page-x">Page 1</option>
                <option value="x">1</option>
                <option value="dash-x-dash">- 1 -</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Size:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value={9}>Small (9pt)</option>
                <option value={11}>Normal (11pt)</option>
                <option value={14}>Large (14pt)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFile(null)}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!file || isProcessing}
              onClick={handleApply}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isProcessing ? "Adding Numbers..." : "Add Numbers & Download"}
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
              <Hash className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to add page numbers
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Insert clean, professional page numbers with custom positions, styles, and typography.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-500" />
              <div>
                <div className="font-semibold text-sm text-[rgb(var(--foreground))]">{file.name}</div>
                <div className="text-xs text-[rgb(var(--muted))]">
                  {pageCount} total pages • {formatBytes(file.size)}
                </div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-lg bg-[rgb(var(--card-2))] text-xs text-[rgb(var(--muted))]">
              Preview stamp: <span className="font-bold text-[rgb(var(--foreground))]">Page 1 of {pageCount}</span> at {position.replace("-", " ")}
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
