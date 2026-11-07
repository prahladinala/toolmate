"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Download,
  Upload,
  Smartphone,
  Globe,
  Sparkles,
  Layers,
  Code2,
  Check,
  RotateCcw,
  Sliders,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

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

const WEB_FAVICON_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

// Sample default icon (SVG encoded)
const SAMPLE_ICON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="100%" stop-color="%23a855f7"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g)"/><path d="M50 20 L68 45 L54 45 L58 78 L34 50 L48 50 Z" fill="%23ffffff"/></svg>`;

export function AppIconGeneratorTool({ tool }: { tool: ToolDef }) {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_ICON_SVG);
  const [padding, setPadding] = useState<number>(10);
  const [borderRadius, setBorderRadius] = useState<number>(22); // percent
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [generating, setGenerating] = useState(false);
  const [appName, setAppName] = useState("ToolMate App");

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawIcon = useCallback(
    (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.clearRect(0, 0, size, size);

      // Background Fill
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
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      updatePreview();
    };
    img.src = imageSrc;
  }, [imageSrc, updatePreview]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
    };
    reader.readAsDataURL(file);
  };

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

  const generateZip = async () => {
    if (!imageRef.current) {
      toast.error("Please upload or select an icon first.");
      return;
    }

    setGenerating(true);
    const zip = new JSZip();

    try {
      // 1. Web & Favicons Folder
      const webFolder = zip.folder("web-favicons");
      for (const item of WEB_FAVICON_SIZES) {
        const blob = await renderSize(item.size);
        webFolder?.file(item.name, blob);
      }
      // Also add 32x32 as favicon.ico
      const favIcoBlob = await renderSize(32);
      webFolder?.file("favicon.ico", favIcoBlob);

      // site.webmanifest
      const manifestObj = {
        name: appName,
        short_name: appName,
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: bgColor,
        background_color: bgColor,
        display: "standalone",
      };
      webFolder?.file("site.webmanifest", JSON.stringify(manifestObj, null, 2));

      // 2. iOS Folder
      const iosFolder = zip.folder("ios-app-icon");
      for (const item of IOS_SIZES) {
        const blob = await renderSize(item.size);
        iosFolder?.file(item.name, blob);
      }

      // 3. Android Folder
      const androidFolder = zip.folder("android-app-icon");
      for (const item of ANDROID_SIZES) {
        const blob = await renderSize(item.size);
        androidFolder?.file(`${item.folder}/ic_launcher.png`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "app-and-favicons-bundle.zip");
      toast.success("Downloaded app-and-favicons-bundle.zip!");
    } catch {
      toast.error("Error generating icon archive.");
    } finally {
      setGenerating(false);
    }
  };

  // Ready HTML snippet
  const htmlSnippet = useMemo(() => {
    return `<!-- Favicon & Mobile Web App Manifest -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="shortcut icon" href="/favicon.ico">
<meta name="theme-color" content="${bgColor}">`;
  }, [bgColor]);

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/80 shadow-xs">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
            Complete Suite
          </Badge>
          <span className="text-xs text-muted-foreground">
            Web Favicons, iOS App Store, Android Play Store & Web Manifest
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={generateZip}
          loading={generating}
          className="h-8 text-xs font-semibold gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Download All Assets (.ZIP)
        </Button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Icon Master Image & Design
            </span>

            {/* File Upload */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Upload Master Image (SVG or High-Res PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full text-xs rounded-xl border border-border p-2 bg-muted/30 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>

            {/* App / Website Name */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                App / Website Name
              </label>
              <Input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="ToolMate App"
                className="text-xs h-9 font-mono"
              />
            </div>

            {/* Background Color & Inset Padding */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-border bg-transparent shrink-0"
                  />
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {bgColor}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Safe Inset
                  </label>
                  <span className="font-mono text-foreground">{padding}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Corner Radius Preview Slider */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider">
                  Corner Radius Preview
                </label>
                <span className="font-mono text-foreground">{borderRadius}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </Card>

          {/* Generated Package Inventory */}
          <Card className="p-4 bg-card/80 border-border/70 shadow-xs space-y-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground block text-[11px]">
              Included in Download Package:
            </span>
            <div className="space-y-1 font-mono text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>📁 web-favicons/</span>
                <span className="text-foreground font-bold">6 assets + manifest</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📁 ios-app-icon/</span>
                <span className="text-foreground font-bold">12 Xcode assets</span>
              </div>
              <div className="flex items-center justify-between">
                <span>📁 android-app-icon/</span>
                <span className="text-foreground font-bold">6 mipmap folders</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Preview Canvas & HTML Tag (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Live Render Canvas */}
          <Card className="p-6 bg-card/90 border-border/80 shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Master Canvas Preview (256 × 256 px)
            </span>

            <div
              className="p-3 rounded-3xl bg-muted/30 border border-border/60 shadow-xl flex items-center justify-center transition-all"
              style={{ borderRadius: `${borderRadius}%` }}
            >
              <canvas
                ref={previewCanvasRef}
                width={256}
                height={256}
                style={{ borderRadius: `${borderRadius}%` }}
                className="shadow-sm object-contain transition-all"
              />
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Web Ready
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-500" /> iOS & Android
              </div>
            </div>
          </Card>

          {/* HTML Meta Snippet */}
          <Card className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                HTML &lt;head&gt; Integration Snippet
              </div>
              <CopyButton value={htmlSnippet} text="Copy HTML" />
            </div>

            <div className="p-4 bg-muted/10 font-mono text-xs leading-relaxed text-foreground whitespace-pre overflow-x-auto">
              {htmlSnippet}
            </div>
          </Card>
        </div>
      </div>
    </ToolWorkspace>
  );
}
