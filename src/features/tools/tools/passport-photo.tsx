"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Button } from "@/components/ui/button";
import { downloadBlob, loadImage } from "@/lib/images/image-utils";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Camera,
  CheckCircle2,
  Grid,
  Square,
} from "lucide-react";

interface CountryPreset {
  name: string;
  widthMm: number;
  heightMm: number;
  ratio: number;
  label: string;
}

const COUNTRIES: CountryPreset[] = [
  { name: "United States (US)", widthMm: 51, heightMm: 51, ratio: 1, label: "2 x 2 inches (51x51mm)" },
  { name: "India (Passport/Visa)", widthMm: 35, heightMm: 45, ratio: 35 / 45, label: "35 x 45 mm" },
  { name: "United Kingdom (UK)", widthMm: 35, heightMm: 45, ratio: 35 / 45, label: "35 x 45 mm" },
  { name: "Schengen (Europe)", widthMm: 35, heightMm: 45, ratio: 35 / 45, label: "35 x 45 mm" },
  { name: "Canada", widthMm: 50, heightMm: 70, ratio: 50 / 70, label: "50 x 70 mm" },
  { name: "Australia", widthMm: 35, heightMm: 45, ratio: 35 / 45, label: "35 x 45 mm" },
  { name: "Japan", widthMm: 35, heightMm: 45, ratio: 35 / 45, label: "35 x 45 mm" },
  { name: "China", widthMm: 33, heightMm: 48, ratio: 33 / 48, label: "33 x 48 mm" },
];

export function PassportPhotoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryPreset>(COUNTRIES[0]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [zoom, setZoom] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [outputMode, setOutputMode] = useState<"single" | "sheet">("single");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    const img = await loadImage(selected);
    setLoadedImage(img);
  };

  useEffect(() => {
    if (!loadedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 300 DPI: 1 mm ~ 11.81 pixels
    const mmToPx = 11.811;
    const photoW = Math.round(selectedCountry.widthMm * mmToPx);
    const photoH = Math.round(selectedCountry.heightMm * mmToPx);

    if (outputMode === "single") {
      canvas.width = photoW;
      canvas.height = photoH;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, photoW, photoH);

      // Draw image with zoom and offset
      const imgRatio = loadedImage.width / loadedImage.height;
      const targetRatio = photoW / photoH;
      let drawW, drawH;

      if (imgRatio > targetRatio) {
        drawH = photoH * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = photoW * zoom;
        drawH = drawW / imgRatio;
      }

      const drawX = (photoW - drawW) / 2;
      const drawY = (photoH - drawH) / 2 + offsetY * (photoH / 100);

      ctx.drawImage(loadedImage, drawX, drawY, drawW, drawH);
    } else {
      // 4x6 inch printable sheet at 300 DPI = 1200 x 1800 px (or 1800 x 1200)
      const sheetW = 1800;
      const sheetH = 1200;
      canvas.width = sheetW;
      canvas.height = sheetH;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sheetW, sheetH);

      // Create single photo stamp
      const pCanvas = document.createElement("canvas");
      pCanvas.width = photoW;
      pCanvas.height = photoH;
      const pCtx = pCanvas.getContext("2d")!;
      pCtx.fillStyle = bgColor;
      pCtx.fillRect(0, 0, photoW, photoH);

      const imgRatio = loadedImage.width / loadedImage.height;
      const targetRatio = photoW / photoH;
      let drawW, drawH;
      if (imgRatio > targetRatio) {
        drawH = photoH * zoom;
        drawW = drawH * imgRatio;
      } else {
        drawW = photoW * zoom;
        drawH = drawW / imgRatio;
      }
      pCtx.drawImage(
        loadedImage,
        (photoW - drawW) / 2,
        (photoH - drawH) / 2 + offsetY * (photoH / 100),
        drawW,
        drawH
      );

      // Tile onto sheet
      const margin = 80;
      const spacing = 40;
      const cols = Math.floor((sheetW - margin * 2 + spacing) / (photoW + spacing));
      const rows = Math.floor((sheetH - margin * 2 + spacing) / (photoH + spacing));

      const startX = (sheetW - (cols * photoW + (cols - 1) * spacing)) / 2;
      const startY = (sheetH - (rows * photoH + (rows - 1) * spacing)) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (photoW + spacing);
          const y = startY + r * (photoH + spacing);
          ctx.drawImage(pCanvas, x, y);

          // Add faint cut border
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW, photoH);
        }
      }
    }

    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.98));
  }, [loadedImage, selectedCountry, bgColor, zoom, offsetY, outputMode]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        downloadBlob(
          blob,
          `passport-photo-${selectedCountry.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${outputMode}.jpg`
        );
      },
      "image/jpeg",
      0.98
    );
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Country / Standard:</span>
              <select
                value={selectedCountry.name}
                onChange={(e) => {
                  const c = COUNTRIES.find((x) => x.name === e.target.value);
                  if (c) setSelectedCountry(c);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-medium"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} — {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Background:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "White", val: "#ffffff" },
                  { label: "Off-White", val: "#f3f4f6" },
                  { label: "Light Blue", val: "#dbeafe" },
                ].map((b) => (
                  <button
                    key={b.val}
                    onClick={() => setBgColor(b.val)}
                    className={`px-2 py-1 rounded text-xs border ${
                      bgColor === b.val
                        ? "border-[rgb(var(--accent))] bg-[rgb(var(--card-2))] font-semibold"
                        : "border-[rgb(var(--border))]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex rounded-lg border border-[rgb(var(--border))] p-0.5 bg-[rgb(var(--card-2))]">
              <button
                onClick={() => setOutputMode("single")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                  outputMode === "single"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                <Square className="w-3 h-3" /> Single Photo
              </button>
              <button
                onClick={() => setOutputMode("sheet")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                  outputMode === "sheet"
                    ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                    : "text-[rgb(var(--muted))]"
                }`}
              >
                <Grid className="w-3 h-3" /> Printable 4×6 Sheet
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setLoadedImage(null);
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
              disabled={!loadedImage}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download (300 DPI)
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
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Upload your portrait photo
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Creates official biometric passport & visa photos with exact millimeter dimensions, compliance background, and 4x6" printable sheets.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Print-Ready 300 DPI
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fine-Tuning Controls */}
            <div className="p-5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
                Position & Zoom Alignment
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Zoom Scale</span>
                  <span className="font-semibold">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[rgb(var(--accent))]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Vertical Shift</span>
                  <span className="font-semibold">{offsetY}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                  className="w-full accent-[rgb(var(--accent))]"
                />
              </div>

              <div className="pt-3 border-t border-[rgb(var(--border))] text-xs text-[rgb(var(--muted))] space-y-2">
                <div className="font-medium text-[rgb(var(--foreground))]">Compliance Requirements:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Head height should take up 70–80% of total height.</li>
                  <li>Eyes should be looking straight into the camera.</li>
                  <li>Plain white or neutral off-white background.</li>
                </ul>
              </div>
            </div>

            {/* Preview Output */}
            <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 flex flex-col items-center justify-center min-h-[380px]">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl && (
                <div className="relative border border-[rgb(var(--border))] shadow-md rounded-lg overflow-hidden max-w-full">
                  <img
                    src={previewUrl}
                    alt="Passport photo preview"
                    className="max-h-[420px] max-w-full h-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolWorkspace>
  );
}
