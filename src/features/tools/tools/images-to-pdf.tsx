"use client";

import React, { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { imagesToPDF } from "@/lib/pdf/pdf-utils";
import { downloadBlob, formatBytes } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  FileImage,
  ArrowUp,
  ArrowDown,
  Trash2,
  FileText,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

export function ImagesToPdfTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"A4" | "LETTER" | "FIT">("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(20);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newItems: ImageItem[] = list.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setItems(copy);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGeneratePdf = async () => {
    if (items.length === 0) return;
    setIsConverting(true);
    try {
      const pdfBytes = await imagesToPDF(
        items.map((i) => ({ file: i.file })),
        { pageSize, orientation, margin }
      );
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      downloadBlob(blob, "images-combined.pdf");
    } catch (err) {
      console.error("Images to PDF failed:", err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value="A4">A4 (Standard)</option>
                <option value="LETTER">US Letter</option>
                <option value="FIT">Fit to Image</option>
              </select>
            </div>

            {pageSize !== "FIT" && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-[rgb(var(--muted))]">Orientation:</span>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Margin:</span>
              <select
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-semibold"
              >
                <option value={0}>No Margin (0px)</option>
                <option value={15}>Small (15px)</option>
                <option value={25}>Normal (25px)</option>
                <option value={40}>Wide (40px)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setItems([])}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={items.length === 0 || isConverting}
              onClick={handleGeneratePdf}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              {isConverting ? "Creating PDF..." : "Convert to PDF"}
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
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
            }}
          />
          <div className="w-12 h-12 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[rgb(var(--foreground))]">
              Select or drop photos to turn into a single PDF
            </h3>
            <p className="text-xs text-[rgb(var(--muted))] mt-0.5">
              Supports JPG, PNG, WebP. Reorder images and configure page dimensions & margins.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between text-xs font-semibold">
              <span>IMAGES IN PDF ({items.length})</span>
              <span className="text-[rgb(var(--muted))]">Pages will appear in this order</span>
            </div>

            <div className="divide-y divide-[rgb(var(--border))]">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[rgb(var(--card-2))] font-bold flex items-center justify-center text-[rgb(var(--accent))] shrink-0">
                      {index + 1}
                    </span>
                    <img
                      src={item.previewUrl}
                      alt="Thumbnail"
                      className="w-10 h-10 object-cover rounded-md border border-[rgb(var(--border))] shrink-0"
                    />
                    <span className="font-medium text-[rgb(var(--foreground))] truncate max-w-[200px] sm:max-w-[360px]">
                      {item.file.name}
                    </span>
                    <span className="text-[rgb(var(--muted))] shrink-0">({formatBytes(item.file.size)})</span>
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
