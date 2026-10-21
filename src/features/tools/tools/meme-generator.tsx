"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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
  const [topText, setTopText] = useState("WHEN CODE COMPILES");
  const [bottomText, setBottomText] = useState("ON FIRST ATTEMPT");
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const filtered = data.data.memes.filter((m: MemeTemplate) => m.box_count === 2);
          setTemplates(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || templates.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    const currentMeme = templates[selectedIdx];
    if (!currentMeme) return;

    img.src = currentMeme.url;
    img.onload = () => {
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

      ctx.font = `bold ${Math.floor(canvas.height / 9)}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.max(2, Math.floor(canvas.height / 120));
      ctx.textBaseline = "top";

      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 12);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 12);
      }

      if (bottomText) {
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 12);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 12);
      }
    };
  }, [templates, selectedIdx, topText, bottomText]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `meme_${templates[selectedIdx]?.id || "custom"}.png`;
      a.href = dataUrl;
      a.click();
      toast.success("Meme image downloaded!");
    } catch {
      toast.error("Cross-origin restriction prevented direct download. Right-click and choose Save Image.");
    }
  };

  const handleRandomTemplate = () => {
    if (templates.length === 0) return;
    setSelectedIdx(Math.floor(Math.random() * templates.length));
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Create viral developer memes with trending templates and live typography canvas preview
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleRandomTemplate}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Random Template
          </Button>

          <Button
            type="button"
            size="sm"
            variant="primary"
            onClick={handleDownload}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Meme
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Form Controls */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Meme Template
            </label>
            <Select
              value={String(selectedIdx)}
              onChange={(e) => setSelectedIdx(Number(e.target.value))}
              disabled={loading || templates.length === 0}
              className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            >
              {templates.map((tpl, idx) => (
                <option key={tpl.id} value={idx}>
                  {tpl.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Top Text
            </label>
            <Input
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="TOP TEXT..."
              className="text-xs sm:text-sm font-semibold h-10 uppercase bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Bottom Text
            </label>
            <Input
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="BOTTOM TEXT..."
              className="text-xs sm:text-sm font-semibold h-10 uppercase bg-[rgb(var(--card-2))]"
            />
          </div>
        </div>

        {/* Canvas Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm min-h-[350px] overflow-hidden">
          <div className="max-w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-xl shadow-md border border-[rgb(var(--border))] object-contain"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
