"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, RefreshCw, Copy, Check } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { avataaars, bottts, adventurer, lorelei, micah } from "@dicebear/collection";
import { toast } from "sonner";

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
  const [copied, setCopied] = useState(false);

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
    toast.success("Downloaded SVG avatar!");
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
        a.href = canvas.toDataURL("image/png");
        a.download = `avatar-${seed}.png`;
        a.click();
        toast.success("Downloaded PNG avatar!");
      }
    };
  };

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgStr);
      toast.success("SVG markup copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Art Style:
          </span>
          {STYLES.map((st, idx) => (
            <Button
              key={st.name}
              type="button"
              size="sm"
              variant={styleIdx === idx ? "primary" : "secondary"}
              onClick={() => setStyleIdx(idx)}
              className="text-xs h-7 px-2.5"
            >
              {st.name}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={handleRandomize}
          className="text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Random Avatar
        </Button>
      </ToolToolbar>

      {/* Main Container */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col items-center justify-center text-center space-y-6">
        {/* Avatar Graphic Swatch */}
        <div
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[rgb(var(--border))] shadow-xl p-3 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-200"
          dangerouslySetInnerHTML={{ __html: svgStr }}
        />

        {/* Seed Input Field */}
        <div className="w-full max-w-sm space-y-1.5">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Avatar Name / Unique Seed
          </label>
          <Input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="text-xs sm:text-sm font-mono text-center h-10 bg-[rgb(var(--card-2))]"
          />
        </div>

        {/* Download Actions */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copySvg}
            className="text-xs h-9 px-4"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy SVG
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleDownloadSVG}
            className="text-xs h-9 px-4"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download SVG
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleDownloadPNG}
            className="text-xs h-9 px-4"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PNG
          </Button>
        </div>
      </div>
    </ToolWorkspace>
  );
}
