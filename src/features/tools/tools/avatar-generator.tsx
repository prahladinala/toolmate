"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createAvatar } from "@dicebear/core";
import { avataaars, bottts, adventurer, lorelei, micah } from "@dicebear/collection";

const STYLES = [
  { name: "Avataaars", collection: avataaars },
  { name: "Bottts (Robots)", collection: bottts },
  { name: "Adventurer", collection: adventurer },
  { name: "Lorelei", collection: lorelei },
  { name: "Micah", collection: micah },
];

export function AvatarGeneratorTool({ tool }: { tool: ToolDef }) {
  const [styleIdx, setStyleIdx] = useState(0);
  const [seed, setSeed] = useState("ToolMate");
  const [svgStr, setSvgStr] = useState("");

  const currentStyle = STYLES[styleIdx];

  useEffect(() => {
    try {
      const avatar = createAvatar(currentStyle.collection as any, {
        seed,
        size: 256,
      });
      setSvgStr(avatar.toString());
    } catch (e) {
      console.error(e);
    }
  }, [styleIdx, seed, currentStyle]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(2, 10));
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avatar-${seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgStr)));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        a.download = `avatar-${seed}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      }
    };
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Avatar Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Create beautiful, distinct avatars using DiceBear. Switch styles and download as SVG or PNG.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">Avatar Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s, i) => (
                <Button 
                  key={s.name} 
                  variant={i === styleIdx ? "primary" : "secondary"} 
                  onClick={() => setStyleIdx(i)}
                  size="sm"
                >
                  {s.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Seed (Unique Identifier)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={seed} 
                onChange={(e) => setSeed(e.target.value)} 
                className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]"
              />
              <Button onClick={handleRandomize} variant="secondary">Random</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgb(var(--border))]">
            <Button onClick={handleDownloadSVG} variant="secondary" className="w-full">Download SVG</Button>
            <Button onClick={handleDownloadPNG} className="w-full">Download PNG</Button>
          </div>
        </Card>

        <Card className="p-0 flex items-center justify-center min-h-[400px] bg-[rgb(var(--card-2))] relative">
           {/* Background pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(var(--fg)) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           
           <div 
             className="w-64 h-64 shadow-xl rounded-full bg-white flex items-center justify-center p-2 z-10 transition-transform hover:scale-105 duration-300"
             dangerouslySetInnerHTML={{ __html: svgStr }}
           />
        </Card>
      </div>
    </main>
  );
}
