"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ErrorLevel = "L" | "M" | "Q" | "H";

export default function QrCodeGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState("https://toolmate.co.in");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");

  const generateQR = useCallback(() => {
    if (!canvasRef.current || !value.trim()) return;

    QRCode.toCanvas(canvasRef.current, value.trim(), {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    });
  }, [value, size, fgColor, bgColor, errorLevel]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
    toast.success("PNG QR Code downloaded!");
  };

  const downloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(value, {
        type: "svg",
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("SVG QR Code downloaded!");
    } catch {
      toast.error("Failed to generate SVG");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Generate high-resolution PNG and scalable vector SVG QR codes with custom colors and error recovery
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadPNG}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download PNG
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadSVG}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download SVG
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Configuration Controls */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Target URL or Text Payload
            </label>
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://..."
              className="text-xs sm:text-sm h-10 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-[rgb(var(--border))]">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Foreground Fill
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{fgColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                  Dimension
                </span>
                <span className="font-mono text-[rgb(var(--fg))]">{size}px</span>
              </div>
              <input
                type="range"
                min={128}
                max={512}
                step={16}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Error Correction
              </label>
              <Select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="L">Low (7% recovery)</option>
                <option value="M">Medium (15% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (30% recovery)</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm min-h-[300px] overflow-hidden">
          <div className="p-4 rounded-2xl bg-white shadow-md border border-[rgb(var(--border))] flex items-center justify-center max-w-full">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg object-contain" />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
