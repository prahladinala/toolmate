"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, Upload, Smartphone, Check } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

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
  const [padding, setPadding] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [generating, setGenerating] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawIcon = useCallback(
    (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);

      if (!imageRef.current) return;

      const padPixels = (padding / 100) * (size / 2);
      const drawSize = size - padPixels * 2;
      const imgRatio = imageRef.current.width / imageRef.current.height;
      let w = drawSize;
      let h = drawSize;

      if (imgRatio > 1) {
        h = drawSize / imgRatio;
      } else {
        w = drawSize * imgRatio;
      }

      const x = (size - w) / 2;
      const y = (size - h) / 2;
      ctx.drawImage(imageRef.current, x, y, w, h);
    },
    [bgColor, padding]
  );

  const updatePreview = useCallback(() => {
    if (!previewCanvasRef.current) return;
    const ctx = previewCanvasRef.current.getContext("2d");
    if (!ctx) return;
    drawIcon(ctx, 256);
  }, [drawIcon]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview, imageSrc]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const generateZip = async () => {
    if (!imageRef.current) {
      toast.error("Please upload an image first.");
      return;
    }

    setGenerating(true);
    const zip = new JSZip();
    const iosFolder = zip.folder("ios");
    const androidFolder = zip.folder("android");

    const renderSize = (size: number): Promise<Blob> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) drawIcon(ctx, size);
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });
    };

    try {
      for (const item of IOS_SIZES) {
        const blob = await renderSize(item.size);
        iosFolder?.file(item.name, blob);
      }

      for (const item of ANDROID_SIZES) {
        const blob = await renderSize(item.size);
        androidFolder?.file(`${item.folder}/ic_launcher.png`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "app-icons.zip");
      toast.success("Downloaded app-icons.zip!");
    } catch {
      toast.error("Error generating icon archive.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Generate production app icon assets for iOS (App Store) and Android (Google Play) in one click
        </span>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={generateZip}
          disabled={!imageSrc}
          loading={generating}
          className="text-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Download All Icons (.ZIP)
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls Column */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Logo / Icon Master Graphic
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full text-xs rounded-xl border border-[rgb(var(--border))] p-2.5 bg-[rgb(var(--card-2))] cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-600 hover:file:bg-indigo-500/20"
            />
          </div>

          <div className="space-y-3.5 pt-3 border-t border-[rgb(var(--border))]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Background Fill Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                  Safe-Area Inset Margin
                </span>
                <span className="font-mono text-[rgb(var(--fg))]">{padding}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm min-h-[350px] overflow-hidden">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-3xl bg-[rgb(var(--card-2))] border border-[rgb(var(--border))] shadow-xl flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                width={256}
                height={256}
                className="rounded-2xl shadow-sm object-contain"
              />
            </div>
            <span className="text-xs font-mono text-[rgb(var(--muted))]">
              Master Canvas Preview (256 × 256 px)
            </span>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
