"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { compressPDF, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Minimize2,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedData, setCompressedData] = useState<Uint8Array | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setTotalPages(count);
    setCompressedData(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const res = await compressPDF(file);
      setCompressedData(res);
    } catch (e) {
      console.error("PDF compression error:", e);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedData || !file) return;
    const blob = new Blob([compressedData as any], { type: "application/pdf" });
    const base = file.name.replace(/\.pdf$/i, "");
    downloadBlob(blob, `${base}-compressed.pdf`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-[rgb(var(--foreground))]">
              {file ? `${file.name} (${totalPages} pages)` : "Select PDF to optimize"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setCompressedData(null);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!file || isCompressing}
              onClick={compressedData ? handleDownload : handleCompress}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isCompressing
                ? "Compressing..."
                : compressedData
                ? "Download Optimized PDF"
                : "Compress PDF"}
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
              <Minimize2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Upload a PDF file to compress and reduce file size
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Optimizes PDF object streams and structure. 100% private, no document is ever sent to a remote server.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-2">
              <div className="text-xs font-medium text-[rgb(var(--muted))]">ORIGINAL FILE SIZE</div>
              <div className="text-2xl font-bold text-[rgb(var(--foreground))]">{formatBytes(file.size)}</div>
              <p className="text-xs text-[rgb(var(--muted))]">{file.name} ({totalPages} pages)</p>
            </div>

            <div className="p-6 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-2">
              <div className="text-xs font-medium text-[rgb(var(--muted))]">OPTIMIZED SIZE</div>
              <div className="text-2xl font-bold text-emerald-500">
                {compressedData ? formatBytes(compressedData.byteLength) : "Ready to compress"}
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                {compressedData
                  ? `Savings: ${Math.round(
                      ((file.size - compressedData.byteLength) / file.size) * 100
                    )}% reduction`
                  : "Click 'Compress PDF' above to optimize"}
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
