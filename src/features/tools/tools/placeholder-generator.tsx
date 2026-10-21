"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Format = "png" | "jpeg" | "webp" | "svg";

export default function PlaceholderGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#4f46e5");
  const [textColor, setTextColor] = useState("#ffffff");
  const [text, setText] = useState("800 × 600");
  const [fontSize, setFontSize] = useState(48);
  const [borderRadius, setBorderRadius] = useState(0);
  const [format, setFormat] = useState<Format>("png");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setText(`${width} × ${height}`);
  }, [width, height]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = bgColor;
    if (borderRadius > 0 && typeof (ctx as any).roundRect === "function") {
      ctx.beginPath();
      (ctx as any).roundRect(0, 0, width, height, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }, [width, height, bgColor, textColor, text, fontSize, borderRadius]);

  useEffect(() => {
    draw();
  }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === "svg") {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="${bgColor}" rx="${borderRadius}" />
  <text x="50%" y="50%" fill="${textColor}" font-size="${fontSize}" font-family="Inter, sans-serif" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `placeholder_${width}x${height}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("SVG Placeholder downloaded!");
      return;
    }

    const dataUrl = canvas.toDataURL(`image/${format}`, 0.92);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `placeholder_${width}x${height}.${format === "jpeg" ? "jpg" : format}`;
    a.click();
    toast.success("Placeholder image downloaded!");
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        setCopied(true);
        toast.success("Placeholder image copied to clipboard!");
        setTimeout(() => setCopied(false), 1500);
      });
    } catch {
      toast.error("Browser clipboard could not write image data directly.");
    }
  };

  const handlePreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
    setFontSize(Math.max(24, Math.floor(h / 10)));
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Presets:
          </span>
          {[
            { label: "1920×1080 (HD)", w: 1920, h: 1080 },
            { label: "1200×630 (OG)", w: 1200, h: 630 },
            { label: "800×600 (4:3)", w: 800, h: 600 },
            { label: "600×600 (1:1)", w: 600, h: 600 },
            { label: "375×812 (Mobile)", w: 375, h: 812 },
          ].map((p) => (
            <Button
              key={p.label}
              type="button"
              size="sm"
              variant={width === p.w && height === p.h ? "primary" : "secondary"}
              onClick={() => handlePreset(p.w, p.h)}
              className="text-xs h-7 px-2.5"
            >
              {p.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyToClipboard}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Image
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={download}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls Column */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Width (px)
              </label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
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
                onChange={(e) => setHeight(Number(e.target.value))}
                className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Label Overlay Text
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-xs sm:text-sm h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[rgb(var(--border))]">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Background Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{bgColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Text Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{textColor}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Font Size ({fontSize}px)
              </label>
              <input
                type="range"
                min={16}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Export Format
              </label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value as Format)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="png">PNG (.png)</option>
                <option value="jpeg">JPEG (.jpg)</option>
                <option value="webp">WebP (.webp)</option>
                <option value="svg">SVG (.svg)</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm min-h-[350px] overflow-hidden">
          <div className="max-w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[420px] h-auto rounded-xl shadow-md border border-[rgb(var(--border))] object-contain"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
