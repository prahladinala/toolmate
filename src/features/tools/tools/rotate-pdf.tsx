"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { rotatePDF, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  RotateCw,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function RotatePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [isRotating, setIsRotating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setPageCount(count);
    setRotations({});
  };

  const rotateAll = (deg: number) => {
    const updated: Record<number, number> = {};
    for (let p = 1; p <= pageCount; p++) {
      updated[p] = ((rotations[p] || 0) + deg) % 360;
    }
    setRotations(updated);
  };

  const rotateSingle = (page: number) => {
    setRotations((prev) => ({
      ...prev,
      [page]: ((prev[page] || 0) + 90) % 360,
    }));
  };

  const handleDownload = async () => {
    if (!file) return;
    setIsRotating(true);
    try {
      const pdfBytes = await rotatePDF(file, rotations);
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}-rotated.pdf`);
    } catch (e) {
      console.error("PDF Rotation failed:", e);
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-[rgb(var(--foreground))]">
              {file ? `${file.name} (${pageCount} pages)` : "Upload PDF to rotate"}
            </span>

            {file && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => rotateAll(90)}
                  className="h-8 gap-1 text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate All +90°
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => rotateAll(180)}
                  className="h-8 gap-1 text-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate All 180°
                </Button>
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
                  setRotations({});
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!file || isRotating}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isRotating ? "Saving..." : "Save & Download PDF"}
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
              <RotateCw className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to rotate pages
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Rotate single pages or the entire document permanently by 90°, 180°, or 270°.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: pageCount }).map((_, i) => {
              const pageNum = i + 1;
              const rot = rotations[pageNum] || 0;
              return (
                <div
                  key={pageNum}
                  className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 flex flex-col items-center justify-between gap-3 shadow-xs"
                >
                  <div className="text-xs font-bold text-[rgb(var(--muted))]">Page {pageNum}</div>

                  <div
                    className="w-20 h-28 bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] rounded flex items-center justify-center transition-transform duration-200"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    <FileText className="w-8 h-8 text-[rgb(var(--accent))]" />
                  </div>

                  <div className="flex items-center justify-between w-full pt-1">
                    <span className="text-[11px] text-[rgb(var(--muted))]">{rot}°</span>
                    <button
                      onClick={() => rotateSingle(pageNum)}
                      className="p-1.5 rounded-md hover:bg-[rgb(var(--card-2))] text-[rgb(var(--accent))]"
                      title="Rotate +90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
