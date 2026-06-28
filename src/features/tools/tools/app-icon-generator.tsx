"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const IOS_SIZES = [
  { name: "Icon-20@2x.png", size: 40 },
  { name: "Icon-20@3x.png", size: 60 },
  { name: "Icon-29@2x.png", size: 58 },
  { name: "Icon-29@3x.png", size: 87 },
  { name: "Icon-40@2x.png", size: 80 },
  { name: "Icon-40@3x.png", size: 120 },
  { name: "Icon-60@2x.png", size: 120 },
  { name: "Icon-60@3x.png", size: 180 },
  { name: "Icon-76.png", size: 76 },
  { name: "Icon-76@2x.png", size: 152 },
  { name: "Icon-83.5@2x.png", size: 167 },
  { name: "Icon-1024.png", size: 1024 },
];

const ANDROID_SIZES = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
  { folder: "playstore", size: 512 },
];

export function AppIconGeneratorTool({ tool }: { tool: ToolDef }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [padding, setPadding] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [generating, setGenerating] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawIcon = useCallback((ctx: CanvasRenderingContext2D, size: number) => {
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    if (!imageRef.current) return;

    // Draw image with padding
    const padPixels = (padding / 100) * (size / 2);
    const drawSize = size - padPixels * 2;
    
    // Maintain aspect ratio
    const imgRatio = imageRef.current.width / imageRef.current.height;
    let w = drawSize;
    let h = drawSize;
    if (imgRatio > 1) {
      h = w / imgRatio;
    } else {
      w = h * imgRatio;
    }

    const x = (size - w) / 2;
    const y = (size - h) / 2;

    ctx.drawImage(imageRef.current, x, y, w, h);
  }, [bgColor, padding]);

  const updatePreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIcon(ctx, canvas.width);
  }, [drawIcon]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        updatePreview();
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const getBlobFromCanvas = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, "image/png");
    });
  };

  const handleGenerate = async () => {
    if (!imageRef.current) return;
    setGenerating(true);

    try {
      const zip = new JSZip();
      
      const iosFolder = zip.folder("iOS");
      const androidFolder = zip.folder("Android");

      const offscreenCanvas = document.createElement("canvas");
      const ctx = offscreenCanvas.getContext("2d");
      if (!ctx) throw new Error("No 2d context");

      // iOS
      for (const spec of IOS_SIZES) {
        offscreenCanvas.width = spec.size;
        offscreenCanvas.height = spec.size;
        drawIcon(ctx, spec.size);
        const blob = await getBlobFromCanvas(offscreenCanvas);
        iosFolder?.file(spec.name, blob);
      }

      // Android
      for (const spec of ANDROID_SIZES) {
        const subFolder = androidFolder?.folder(spec.folder);
        offscreenCanvas.width = spec.size;
        offscreenCanvas.height = spec.size;
        drawIcon(ctx, spec.size);
        const blob = await getBlobFromCanvas(offscreenCanvas);
        subFolder?.file("ic_launcher.png", blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "AppIcons.zip");
    } catch (err) {
      console.error(err);
      alert("An error occurred while generating icons.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">App Icon Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Upload an image, customize it, and instantly download a ZIP package containing all required iOS and Android app icon sizes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Col - Settings */}
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Upload Base Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm rounded border p-2 bg-[rgb(var(--card-2))] cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[rgba(var(--accent),0.1)] file:text-[rgb(var(--accent))] hover:file:bg-[rgba(var(--accent),0.2)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer p-0 border-0"
              />
              <span className="text-sm font-mono">{bgColor}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Padding</label>
              <span className="text-xs text-[rgb(var(--muted))]">{padding}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={!imageSrc || generating}
          >
            {generating ? "Generating ZIP..." : "Generate iOS & Android Icons"}
          </Button>
        </Card>

        {/* Right Col - Preview */}
        <Card className="p-6 flex flex-col items-center justify-center bg-[rgb(var(--card-2))] min-h-[400px]">
          <div className="mb-4 text-sm font-medium text-[rgb(var(--muted))]">Live Preview (1024x1024 scaled down)</div>
          <div className="relative shadow-[var(--shadow-lg)] rounded-2xl overflow-hidden border border-[rgba(var(--border),0.5)]">
            <canvas
              ref={previewCanvasRef}
              width={1024}
              height={1024}
              className="w-64 h-64 sm:w-80 sm:h-80 object-contain bg-white"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
