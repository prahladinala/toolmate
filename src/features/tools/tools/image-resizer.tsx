"use client";

import React, { useState, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    
    // Draw scaled
    ctx.drawImage(imgRef.current, 0, 0, Number(width), Number(height));
    
    // Download
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const dataUrl = canvas.toDataURL(format, 0.9);
    
    const link = document.createElement("a");
    link.download = `resized_image.${ext}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Image Resizer</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Quickly resize your images directly in your browser. No images are uploaded to any server.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="w-full text-sm rounded border p-2 bg-[rgb(var(--card-2))] cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[rgba(var(--accent),0.1)] file:text-[rgb(var(--accent))] hover:file:bg-[rgba(var(--accent),0.2)]"
            />
          </div>

          {imageSrc && (
            <>
              <div className="flex justify-between text-sm text-[rgb(var(--muted))]">
                <span>Original: {origWidth} × {origHeight} px</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">New Width (px)</label>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => handleWidthChange(e.target.value)} 
                    className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">New Height (px)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => handleHeightChange(e.target.value)} 
                    className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="aspect" 
                  checked={maintainAspect} 
                  onChange={(e) => setMaintainAspect(e.target.checked)} 
                  className="w-4 h-4 accent-[rgb(var(--accent))]" 
                />
                <label htmlFor="aspect" className="text-sm font-medium cursor-pointer">Maintain Aspect Ratio</label>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Export Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]">
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>

              <Button onClick={handleDownload} className="w-full" disabled={!width || !height}>
                Download Resized Image
              </Button>
            </>
          )}
        </Card>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        <Card className="p-4 flex items-center justify-center bg-[rgb(var(--card-2))] min-h-[400px]">
          {imageSrc ? (
            <div className="max-w-full max-h-full overflow-hidden flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageSrc} alt="Preview" className="max-w-full max-h-[500px] object-contain opacity-50" width={800} height={500} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-black/70 text-white px-4 py-2 rounded-lg font-mono text-sm shadow-lg backdrop-blur-sm">
                   {width || "?"} × {height || "?"}
                 </div>
              </div>
            </div>
          ) : (
            <div className="text-[rgb(var(--muted))] text-sm">Upload an image to see preview</div>
          )}
        </Card>
      </div>
    </main>
  );
}
