"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Format = "png" | "jpeg" | "webp" | "svg";

export default function PlaceholderGenerator() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState(800);
  const [height, setHeight] = React.useState(600);
  const [bgColor, setBgColor] = React.useState("#6366f1");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [text, setText] = React.useState("800 × 600");
  const [fontSize, setFontSize] = React.useState(48);
  const [borderRadius, setBorderRadius] = React.useState(0);
  const [format, setFormat] = React.useState<Format>("png");
  const [quality, setQuality] = React.useState(0.92);

  React.useEffect(() => {
    setText(`${width} × ${height}`);
  }, [width, height]);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = bgColor;
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }

    // Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }, [width, height, bgColor, textColor, text, fontSize, borderRadius]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (format === "svg") {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${bgColor}" rx="${borderRadius}" />
        <text x="50%" y="50%" fill="${textColor}" font-size="${fontSize}"
          font-family="Inter, sans-serif" text-anchor="middle"
          dominant-baseline="middle">${text}</text>
      </svg>
      `;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, "placeholder.svg");
      return;
    }

    const dataUrl =
      format === "jpeg"
        ? canvas.toDataURL("image/jpeg", quality)
        : format === "webp"
          ? canvas.toDataURL("image/webp", quality)
          : canvas.toDataURL("image/png");

    triggerDownload(dataUrl, `placeholder.${format}`);
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preview */}
        <Card className="p-6">
          <canvas
            ref={canvasRef}
            className="w-full rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]"
          />
        </Card>

        {/* Controls */}
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="mt-1 w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="text-sm">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="mt-1 w-full rounded border p-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="mt-1 w-full h-10 rounded"
            />
          </div>

          <div>
            <label className="text-sm">Text</label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="text-sm">Text Color</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="mt-1 w-full h-10 rounded"
            />
          </div>

          <div>
            <label className="text-sm">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="mt-1 w-full rounded border p-2"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
              <option value="svg">SVG</option>
            </select>
          </div>

          {format === "jpeg" || format === "webp" ? (
            <div>
              <label className="text-sm">Quality</label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button onClick={download}>Download</Button>
            <Button variant="secondary" onClick={copyToClipboard}>
              Copy Image
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
