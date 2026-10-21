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
  UserCheck,
  CheckCircle2,
  Sliders,
  Crop,
} from "lucide-react";

const FILTERS = [
  { name: "Natural", filter: "none" },
  { name: "Clean Studio", filter: "contrast(1.08) brightness(1.04) saturate(1.05)" },
  { name: "Executive Warm", filter: "sepia(0.12) contrast(1.1) brightness(1.03) saturate(1.1)" },
  { name: "Crisp Modern", filter: "contrast(1.15) brightness(1.02) saturate(0.95)" },
  { name: "Noir Portrait", filter: "grayscale(1) contrast(1.25) brightness(0.98)" },
];

export function HeadshotGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[1]);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "3:4">("1:1");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(105);
  const [vignette, setVignette] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (!selected.type.startsWith("image/")) return;
    setFile(selected);
    const img = await loadImage(selected);
    setLoadedImg(img);
  };

  useEffect(() => {
    if (!loadedImg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseSize = 1200;
    let targetW = baseSize;
    let targetH = baseSize;

    if (aspectRatio === "4:5") {
      targetW = 960;
      targetH = 1200;
    } else if (aspectRatio === "3:4") {
      targetW = 900;
      targetH = 1200;
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // Apply CSS filter
    ctx.filter = `${selectedFilter.filter} brightness(${brightness / 100}) contrast(${contrast / 100})`;

    // Center crop image
    const imgRatio = loadedImg.width / loadedImg.height;
    const targetRatio = targetW / targetH;
    let sw, sh, sx, sy;

    if (imgRatio > targetRatio) {
      sh = loadedImg.height;
      sw = sh * targetRatio;
      sx = (loadedImg.width - sw) / 2;
      sy = 0;
    } else {
      sw = loadedImg.width;
      sh = sw / targetRatio;
      sx = 0;
      sy = (loadedImg.height - sh) / 4; // slight top bias for faces
    }

    ctx.drawImage(loadedImg, sx, sy, sw, sh, 0, 0, targetW, targetH);

    // Apply subtle studio vignette
    if (vignette) {
      ctx.filter = "none";
      const radGrad = ctx.createRadialGradient(
        targetW / 2,
        targetH / 2,
        Math.min(targetW, targetH) * 0.45,
        targetW / 2,
        targetH / 2,
        Math.max(targetW, targetH) * 0.75
      );
      radGrad.addColorStop(0, "rgba(0,0,0,0)");
      radGrad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, targetW, targetH);
    }

    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.95));
  }, [loadedImg, selectedFilter, aspectRatio, brightness, contrast, vignette]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const base = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        downloadBlob(blob, `${base}-professional-headshot.jpg`);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <div className="space-y-6">
        <ToolToolbar>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[rgb(var(--muted))]">Style:</span>
              <select
                value={selectedFilter.name}
                onChange={(e) => {
                  const f = FILTERS.find((x) => x.name === e.target.value);
                  if (f) setSelectedFilter(f);
                }}
                className="h-8 px-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-xs font-medium"
              >
                {FILTERS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex rounded-lg border border-[rgb(var(--border))] p-0.5 bg-[rgb(var(--card-2))]">
              {(["1:1", "4:5", "3:4"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    aspectRatio === ratio
                      ? "bg-[rgb(var(--card))] text-[rgb(var(--foreground))] shadow-xs"
                      : "text-[rgb(var(--muted))]"
                  }`}
                >
                  {ratio} {ratio === "1:1" ? "(Square)" : ratio === "4:5" ? "(Social)" : "(Resume)"}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-[rgb(var(--foreground))]">
              <input
                type="checkbox"
                checked={vignette}
                onChange={(e) => setVignette(e.target.checked)}
                className="rounded border-[rgb(var(--border))] text-[rgb(var(--accent))]"
              />
              <span className="font-medium">Studio Vignette</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {file && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setLoadedImg(null);
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
              disabled={!loadedImg}
              onClick={handleDownload}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" /> Download HD Headshot
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
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[rgb(var(--foreground))]">
                Upload your casual or work photo
              </h3>
              <p className="text-xs text-[rgb(var(--muted))] mt-1">
                Generate high-definition professional headshots with studio lighting grades for LinkedIn, resume & corporate bio.
              </p>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Studio Quality
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--muted))]">
                Lighting Adjustments
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Exposure / Brightness</span>
                  <span className="font-semibold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-[rgb(var(--accent))]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span>Tone / Contrast</span>
                  <span className="font-semibold">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="130"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-[rgb(var(--accent))]"
                />
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 flex flex-col items-center justify-center min-h-[380px]">
              <canvas ref={canvasRef} className="hidden" />
              {previewUrl && (
                <div className="relative border border-[rgb(var(--border))] shadow-xl rounded-xl overflow-hidden max-w-full">
                  <img
                    src={previewUrl}
                    alt="Headshot preview"
                    className="max-h-[440px] max-w-full h-auto object-contain"
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
