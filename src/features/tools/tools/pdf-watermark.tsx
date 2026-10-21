"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { addWatermark, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Stamp,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
  const [fontSize, setFontSize] = useState(48);
  const [angle, setAngle] = useState(-45);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setPageCount(count);
  };

  const handleApply = async () => {
    if (!file || !text.trim()) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await addWatermark(file, {
        text,
        opacity,
        fontSize,
        angle,
      });
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}-watermarked.pdf`);
    } catch (e) {
      console.error("Failed to watermark PDF:", e);
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
              <span className="font-medium text-[rgb(var(--muted))]">Watermark:</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="CONFIDENTIAL"
                className="h-8 px-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold w-36 uppercase"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Angle:</span>
              <select
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value={-45}>-45° Diagonal</option>
                <option value={0}>0° Horizontal</option>
                <option value={45}>45° Diagonal</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-20 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[28px]">{Math.round(opacity * 100)}%</span>
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
              disabled={!file || !text.trim() || isProcessing}
              onClick={handleApply}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isProcessing ? "Stamping..." : "Add Watermark & Download"}
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
              <Stamp className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to add custom watermark
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Protect documents with bold diagonal or horizontal text watermarks like CONFIDENTIAL, DRAFT, or your company name.
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

            <div className="px-5 py-3 rounded-xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center">
              <span
                className="text-base font-extrabold uppercase tracking-widest text-[rgb(var(--foreground))]"
                style={{ opacity }}
              >
                {text || "WATERMARK"}
              </span>
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
