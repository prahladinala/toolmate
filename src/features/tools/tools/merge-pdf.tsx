"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { mergePDFs, getPDFPageCount } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle2,
  Files,
} from "lucide-react";

interface PDFItem {
  id: string;
  file: File;
  pageCount: number;
}

export function MergePdfTool() {
  const [items, setItems] = useState<PDFItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );

    const newItems: PDFItem[] = [];
    for (const f of list) {
      try {
        const count = await getPDFPageCount(f);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          pageCount: count,
        });
      } catch (err) {
        console.error("Could not read PDF:", err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMerge = async () => {
    if (items.length < 2) return;
    setIsMerging(true);
    try {
      const mergedBytes = await mergePDFs(items.map((i) => i.file));
      const blob = new Blob([mergedBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "merged-document.pdf");
    } catch (err) {
      console.error("PDF Merge failed:", err);
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = items.reduce((sum, i) => sum + i.pageCount, 0);

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-[rgb(var(--foreground))]">
              {items.length} PDF{items.length !== 1 ? "s" : ""} selected
            </span>
            {items.length > 0 && (
              <span className="text-[rgb(var(--muted))]">
                ({totalPages} total page{totalPages !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setItems([])}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear All
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={items.length < 2 || isMerging}
              onClick={handleMerge}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isMerging ? "Merging PDFs..." : "Merge & Download PDF"}
            </Button>
          </div>
        </ToolToolbar>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer border-[rgb(var(--border))] hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--card-2))]/50 bg-[rgb(var(--card))] flex flex-col items-center justify-center gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
            }}
          />
          <div className="w-12 h-12 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[rgb(var(--foreground))]">
              Select or drop two or more PDF files to combine
            </h3>
            <p className="text-xs text-[rgb(var(--muted))] mt-0.5">
              100% private in-browser merging. Your PDF files never leave your computer.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs font-semibold">
              <span>DOCUMENT MERGE ORDER</span>
              <span className="text-[rgb(var(--muted))]">Use arrows to rearrange sequence</span>
            </div>

            <div className="divide-y divide-[rgb(var(--border))]">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[rgb(var(--card-2))] font-bold flex items-center justify-center text-[rgb(var(--accent))] shrink-0">
                      {index + 1}
                    </span>
                    <FileText className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium text-[rgb(var(--foreground))] truncate max-w-[200px] sm:max-w-[360px]">
                      {item.file.name}
                    </span>
                    <span className="text-[rgb(var(--muted))] shrink-0">
                      ({item.pageCount} page{item.pageCount !== 1 ? "s" : ""}, {formatBytes(item.file.size)})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-[rgb(var(--card-2))] disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-1.5 rounded hover:bg-[rgb(var(--card-2))] disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-[rgb(var(--muted))] hover:text-red-500"
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
