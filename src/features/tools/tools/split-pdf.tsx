"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { splitPDF, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Scissors,
  FileText,
  CheckCircle2,
} from "lucide-react";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState("1-2, 3");
  const [mode, setMode] = useState<"ranges" | "all">("ranges");
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResults, setSplitResults] = useState<{ name: string; data: Uint8Array; pageCount: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.name.toLowerCase().endsWith(".pdf")) return;
    setFile(selected);
    const count = await getPDFPageCount(selected);
    setTotalPages(count);
    if (count > 2) {
      setRangeInput(`1-${Math.ceil(count / 2)}, ${Math.ceil(count / 2) + 1}-${count}`);
    } else {
      setRangeInput("1");
    }
    setSplitResults([]);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsSplitting(true);
    try {
      const input = mode === "all" ? "" : rangeInput;
      const res = await splitPDF(file, input);
      setSplitResults(res);
    } catch (err) {
      console.error("PDF Split error:", err);
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadPart = (part: { name: string; data: Uint8Array }) => {
    const blob = new Blob([part.data as any], { type: "application/pdf" });
    downloadBlob(blob, part.name);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-lg border border-[rgb(var(--border))] p-0.5 bg-[rgb(var(--card-2))]">
              <button
                onClick={() => setMode("ranges")}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  mode === "ranges"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                Custom Ranges
              </button>
              <button
                onClick={() => setMode("all")}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  mode === "all"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                Extract All Pages
              </button>
            </div>

            {mode === "ranges" && file && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-[rgb(var(--muted))]">Ranges:</span>
                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5, 7-10"
                  className="h-8 px-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-medium w-40"
                />
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
                  setSplitResults([]);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!file || isSplitting}
              onClick={handleSplit}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Scissors className="w-3.5 h-3.5" />
              {isSplitting ? "Splitting..." : "Split PDF"}
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
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Upload a PDF file to split or extract pages
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Specify custom page ranges (e.g., 1-4, 5, 8-12) or extract every single page into separate PDF files.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-semibold text-sm text-[rgb(var(--foreground))]">{file.name}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {totalPages} total pages • {formatBytes(file.size)}
                  </div>
                </div>
              </div>
            </div>

            {splitResults.length > 0 && (
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
                <div className="px-4 py-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs font-semibold">
                  <span>SPLIT DOCUMENTS ({splitResults.length})</span>
                </div>
                <div className="divide-y divide-[rgb(var(--border))]">
                  {splitResults.map((part, index) => (
                    <div key={index} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-[rgb(var(--foreground))]">{part.name}</span>
                        <span className="text-[rgb(var(--muted))]">({part.pageCount} pages)</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadPart(part)}
                        className="h-7 px-3 text-xs gap-1.5"
                      >
                        <Download className="w-3 h-3" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
