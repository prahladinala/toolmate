"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { removeBackground, downloadBlob, loadImage } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const PRESET_GRADIENTS = [
  { name: "Clean Studio", value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", start: "#f5f7fa", end: "#c3cfe2" },
  { name: "Soft Sunset", value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", start: "#ff9a9e", end: "#fecfef" },
  { name: "Deep Ocean", value: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)", start: "#2b5876", end: "#4e4376" },
  { name: "Neon Cyber", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", start: "#43e97b", end: "#38f9d7" },
  { name: "Warm Aura", value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", start: "#f6d365", end: "#fda085" },
  { name: "Dark Velvet", value: "linear-gradient(135deg, #09203f 0%, #537895 100%)", start: "#09203f", end: "#537895" },
];

const PRESET_COLORS = [
  "#ffffff", "#f3f4f6", "#e5e7eb", "#000000", "#1e293b",
  "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"
];

export function BackgroundChangerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fgImage, setFgImage] = useState<HTMLImageElement | null>(null);
  const [bgType, setBgType] = useState<"color" | "gradient">("gradient");
  const [solidColor, setSolidColor] = useState("#ffffff");
  const [selectedGradient, setSelectedGradient] = useState(PRESET_GRADIENTS[0]);
  const [tolerance, setTolerance] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    try {
      const res = await removeBackground(selectedFile, {
        tolerance,
        feather: 3,
      });
      const img = await loadImage(res.dataUrl);
      setFgImage(img);
    } catch (e) {
      console.error("Failed to extract foreground:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    processFile(selected);
  };

  useEffect(() => {
    if (!fgImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = fgImage.naturalWidth || fgImage.width;
    canvas.height = fgImage.naturalHeight || fgImage.height;

    // Draw background
    if (bgType === "color") {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, selectedGradient.start);
      grad.addColorStop(1, selectedGradient.end);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw foreground
    ctx.drawImage(fgImage, 0, 0);
    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.92));
  }, [fgImage, bgType, solidColor, selectedGradient]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      downloadBlob(blob, `${base}-new-bg.jpg`);
    }, "image/jpeg", 0.92);
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-lg border border-[rgb(var(--border))] p-0.5 bg-[rgb(var(--card-2))]">
              <button
                onClick={() => setBgType("gradient")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  bgType === "gradient"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                Gradients
              </button>
              <button
                onClick={() => setBgType("color")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  bgType === "color"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                Solid Color
              </button>
            </div>

            {bgType === "color" ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSolidColor(c)}
                    className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                      solidColor === c ? "scale-110 ring-2 ring-[rgb(var(--accent))]" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_GRADIENTS.map((g) => (
                  <button
                    key={g.name}
                    title={g.name}
                    onClick={() => setSelectedGradient(g)}
                    className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                      selectedGradient.name === g.name ? "scale-110 ring-2 ring-[rgb(var(--accent))]" : ""
                    }`}
                    style={{ background: g.value }}
                  />
                ))}
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
                  setFgImage(null);
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
              disabled={!fgImage}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download Image
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
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Click or drag & drop photo to change background
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Replace original background with vibrant gradients, clean studio colors, or professional backdrops.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% private in-browser
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden p-6 flex flex-col items-center justify-center min-h-[400px]">
            {isProcessing ? (
              <div className="text-xs text-[rgb(var(--muted))]">Extracting subject & applying background...</div>
            ) : (
              <>
                <canvas ref={canvasRef} className="hidden" />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Background changed preview"
                    className="max-h-[460px] max-w-full h-auto object-contain rounded-xl shadow-lg"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
