"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { removePDFPages, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Trash2,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";

export function RemovePdfPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedForRemoval, setSelectedForRemoval] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setTotalPages(count);
    setSelectedForRemoval(new Set());
  };

  const togglePage = (pageNum: number) => {
    const updated = new Set(selectedForRemoval);
    if (updated.has(pageNum)) {
      updated.delete(pageNum);
    } else {
      updated.add(pageNum);
    }
    setSelectedForRemoval(updated);
  };

  const handleRemove = async () => {
    if (!file || selectedForRemoval.size === 0) return;
    if (selectedForRemoval.size >= totalPages) {
      alert("Cannot delete all pages in document!");
      return;
    }
    setIsProcessing(true);
    try {
      const pdfBytes = await removePDFPages(file, Array.from(selectedForRemoval));
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = file.name.replace(/\.pdf$/i, "");
      downloadBlob(blob, `${base}-pages-removed.pdf`);
    } catch (e) {
      console.error("Failed to remove pages:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const remainingCount = totalPages - selectedForRemoval.size;

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-[rgb(var(--foreground))]">
              {file
                ? `${selectedForRemoval.size} page(s) marked for deletion (${remainingCount} remaining)`
                : "Upload PDF to remove pages"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setSelectedForRemoval(new Set());
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!file || selectedForRemoval.size === 0 || remainingCount <= 0 || isProcessing}
              onClick={handleRemove}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isProcessing ? "Processing..." : `Delete ${selectedForRemoval.size} Page(s) & Save`}
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
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop PDF to delete pages
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Select unwanted pages visually and remove them cleanly from your document.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isMarked = selectedForRemoval.has(pageNum);
              return (
                <div
                  key={pageNum}
                  onClick={() => togglePage(pageNum)}
                  className={`rounded-xl border p-3 flex flex-col items-center justify-between gap-3 shadow-xs cursor-pointer transition-all duration-150 ${
                    isMarked
                      ? "border-red-500/50 bg-red-500/5 ring-2 ring-red-500/30"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:border-[rgb(var(--accent))]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-xs font-semibold">
                    <span className={isMarked ? "text-red-500 line-through" : "text-[rgb(var(--foreground))]"}>
                      Page {pageNum}
                    </span>
                    {isMarked ? (
                      <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">
                        Delete
                      </span>
                    ) : (
                      <span className="text-[10px] text-[rgb(var(--muted))]">Keep</span>
                    )}
                  </div>

                  <div
                    className={`w-20 h-28 border rounded flex items-center justify-center ${
                      isMarked
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-[rgb(var(--card-2))] border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                    }`}
                  >
                    <FileText className="w-8 h-8" />
                  </div>

                  <div className="text-[11px] font-medium text-center w-full">
                    {isMarked ? "Click to keep" : "Click to remove"}
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
