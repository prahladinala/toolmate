"use client";

import React, { useState, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, Upload, Image as ImageIcon, Link2 } from "lucide-react";
import { toast } from "sonner";

export function ImageResizerTool({ tool }: { tool: ToolDef }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);

  const [width, setWidth] = useState<number | "">(0);
  const [height, setHeight] = useState<number | "">(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [format, setFormat] = useState("image/png");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        imgRef.current = img;
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: string) => {
    const num = parseInt(val);
    setWidth(isNaN(num) ? "" : num);
    if (maintainAspect && !isNaN(num) && origWidth > 0) {
      setHeight(Math.round(num * (origHeight / origWidth)));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val);
    setHeight(isNaN(num) ? "" : num);
    if (maintainAspect && !isNaN(num) && origHeight > 0) {
      setWidth(Math.round(num * (origWidth / origHeight)));
    }
  };

  const handleDownload = () => {
    if (!imgRef.current || !canvasRef.current || !width || !height) return;

    const canvas = canvasRef.current;
    canvas.width = Number(width);
    canvas.height = Number(height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgRef.current, 0, 0, Number(width), Number(height));

    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const dataUrl = canvas.toDataURL(format, 0.92);

    const link = document.createElement("a");
    link.download = `resized_${width}x${height}.${ext}`;
    link.href = dataUrl;
    link.click();
    toast.success("Resized image downloaded!");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Fast client-side batch canvas image resizing. Images are never uploaded to any remote server.
        </span>
        {imageSrc && (
          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Resized
          </Button>
        )}
      </ToolToolbar>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls Column */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full text-xs rounded-xl border border-[rgb(var(--border))] p-2.5 bg-[rgb(var(--card-2))] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-600 hover:file:bg-indigo-500/20"
            />
          </div>

          {imageSrc && (
            <div className="space-y-4 pt-3 border-t border-[rgb(var(--border))]">
              <div className="flex items-center justify-between text-xs text-[rgb(var(--muted))]">
                <span>Original Dimensions:</span>
                <span className="font-mono font-medium text-[rgb(var(--fg))]">
                  {origWidth} × {origHeight} px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                    Width (px)
                  </label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                    Height (px)
                  </label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-500"
                />
                <span className="flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                  Lock Aspect Ratio
                </span>
              </label>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                  Export Image Format
                </label>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="text-xs h-9 bg-[rgb(var(--card-2))]"
                >
                  <option value="image/png">PNG (.png) — Lossless</option>
                  <option value="image/jpeg">JPEG (.jpg) — Compressed</option>
                  <option value="image/webp">WebP (.webp) — Modern Web</option>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm min-h-[350px] overflow-hidden">
          {imageSrc ? (
            <div className="max-w-full flex flex-col items-center justify-center space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Upload preview"
                className="max-w-full max-h-[400px] rounded-xl shadow-md object-contain border border-[rgb(var(--border))]"
              />
              <span className="text-xs font-mono text-[rgb(var(--muted))]">
                Target Output: {width} × {height} px ({format.replace("image/", "")})
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 select-none space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-2">
                <ImageIcon className="w-7 h-7" />
              </div>
              <span className="text-base font-semibold text-[rgb(var(--fg))]">
                No Image Selected
              </span>
              <p className="text-xs text-[rgb(var(--muted))] max-w-xs">
                Upload a PNG, JPEG, or WebP photo to customize target dimensions and pixel ratios.
              </p>
            </div>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
