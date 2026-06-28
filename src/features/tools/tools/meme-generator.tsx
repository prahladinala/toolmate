"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export function MemeGeneratorTool({ tool }: { tool: ToolDef }) {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter to memes with 2 boxes for simplicity
          const filtered = data.data.memes.filter((m: MemeTemplate) => m.box_count === 2);
          setTemplates(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || templates.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Needed for downloading tainted canvas
    const currentMeme = templates[selectedIdx];
    img.src = currentMeme.url;

    img.onload = () => {
      // Setup canvas size
      const maxW = 600;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
         h = (maxW / w) * h;
         w = maxW;
      }
      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Setup text
      ctx.font = `bold ${Math.floor(canvas.height / 8)}px Impact`;
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.floor(canvas.height / 150) || 2;
      ctx.textBaseline = "top";

      // Draw Top Text
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 10);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 10);
      }

      // Draw Bottom Text
      if (bottomText) {
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 10);
      }
    };
  };

  useEffect(() => {
    drawMeme();
  }, [selectedIdx, topText, bottomText, templates]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `meme_${templates[selectedIdx]?.id}.png`;
      a.href = dataUrl;
      a.click();
    } catch (e) {
      alert("Cannot download due to CORS restrictions on the image. You can try right-clicking and saving the image.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Meme Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Select a trending template from ImgFlip, add your text, and download your meme instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          {loading ? (
            <div className="text-sm text-[rgb(var(--muted))]">Loading templates...</div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium block mb-2">Select Template</label>
                <select 
                  value={selectedIdx} 
                  onChange={(e) => setSelectedIdx(Number(e.target.value))} 
                  className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
                >
                  {templates.map((t, i) => (
                    <option key={t.id} value={i}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Top Text</label>
                <input 
                  type="text" 
                  value={topText} 
                  onChange={(e) => setTopText(e.target.value)} 
                  placeholder="e.g., WHEN THE CODE WORKS"
                  className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Bottom Text</label>
                <input 
                  type="text" 
                  value={bottomText} 
                  onChange={(e) => setBottomText(e.target.value)} 
                  placeholder="e.g., BUT YOU DON'T KNOW WHY"
                  className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
                />
              </div>

              <Button onClick={handleDownload} className="w-full">Download Meme</Button>
            </>
          )}
        </Card>

        <Card className="p-4 flex items-center justify-center bg-[rgb(var(--card-2))] min-h-[400px] overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="max-w-full max-h-[500px] object-contain shadow-lg rounded-lg bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
          />
        </Card>
      </div>
    </main>
  );
}
