"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { createSticker, downloadBlob, loadImage } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Sparkles,
  Tag,
  CheckCircle2,
} from "lucide-react";

export function StickerMakerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [borderWidth, setBorderWidth] = useState(14);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [shadowBlur, setShadowBlur] = useState(12);
  const [shadowColor, setShadowColor] = useState("rgba(0,0,0,0.3)");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (
    src: File,
    bw = borderWidth,
    bc = borderColor,
    sb = shadowBlur,
    sc = shadowColor
  ) => {
    setIsProcessing(true);
    try {
      const res = await createSticker(src, {
        borderWidth: bw,
        borderColor: bc,
        shadowBlur: sb,
        shadowColor: sc,
      });
      setPreviewUrl(res.dataUrl);
      setResultBlob(res.blob);
    } catch (e) {
      console.error("Sticker creation error:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    processFile(selected);
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    downloadBlob(resultBlob, `${base}-sticker.png`);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Outline:</span>
              <input
                type="range"
                min="4"
                max="32"
                value={borderWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBorderWidth(val);
                  if (file) processFile(file, val, borderColor, shadowBlur, shadowColor);
                }}
                className="w-20 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[24px]">{borderWidth}px</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Border Color:</span>
              <div className="flex items-center gap-1.5">
                {["#ffffff", "#000000", "#fef08a", "#bae6fd", "#fbcfe8"].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBorderColor(c);
                      if (file) processFile(file, borderWidth, c, shadowBlur, shadowColor);
                    }}
                    className={`w-5 h-5 rounded-full border border-black/15 ${
                      borderColor === c ? "ring-2 ring-[rgb(var(--accent))]" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Shadow:</span>
              <input
                type="range"
                min="0"
                max="25"
                value={shadowBlur}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setShadowBlur(val);
                  if (file) processFile(file, borderWidth, borderColor, val, shadowColor);
                }}
                className="w-20 accent-[rgb(var(--accent))]"
              />
              <span className="font-semibold text-xs min-w-[24px]">{shadowBlur}px</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="h-8 gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={!resultBlob}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download Sticker PNG
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
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 rounded-full bg-[rgb(var(--card-2))] flex items-center justify-center text-[rgb(var(--accent))] shadow-xs">
              <Tag className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Upload image or logo to create custom sticker
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Adds a professional die-cut vinyl border outline and realistic drop shadow for messaging apps & print.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Transparent PNG output
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl border border-[rgb(var(--border))] p-8 flex flex-col items-center justify-center min-h-[420px]"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            {isProcessing ? (
              <div className="text-xs text-[rgb(var(--muted))] bg-[rgb(var(--card))] px-4 py-2 rounded-lg shadow-sm">
                Generating die-cut sticker outline...
              </div>
            ) : (
              previewUrl && (
                <img
                  src={previewUrl}
                  alt="Sticker preview"
                  className="max-h-[380px] max-w-full h-auto object-contain transition-transform hover:scale-105 duration-200"
                />
              )
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
