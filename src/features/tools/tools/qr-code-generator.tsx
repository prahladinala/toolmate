"use client";

import React from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorLevel = "L" | "M" | "Q" | "H";

export default function QrCodeGeneratorTool() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [value, setValue] = React.useState("https://toolmate.co.in");
  const [size, setSize] = React.useState(256);
  const [fgColor, setFgColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [errorLevel, setErrorLevel] = React.useState<ErrorLevel>("M");

  const generateQR = React.useCallback(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    });
  }, [value, size, fgColor, bgColor, errorLevel]);

  React.useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };

  const downloadSVG = async () => {
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
    a.download = "qr-code.svg";
    a.click();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2 mt-6">
        {/* Preview */}
        <Card className="p-6 flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded shadow" />
        </Card>

        {/* Controls */}
        <Card className="p-6 space-y-5">
          <div>
            <label className="text-sm">QR Content</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2 w-full rounded border p-3"
            />
          </div>

          <div>
            <label className="text-sm">Size: {size}px</label>
            <input
              type="range"
              min={128}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Foreground</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="mt-1 w-full h-10 rounded"
              />
            </div>
            <div>
              <label className="text-sm">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="mt-1 w-full h-10 rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Error Correction</label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
              className="mt-2 w-full rounded border p-2"
            >
              <option value="L">Low</option>
              <option value="M">Medium</option>
              <option value="Q">Quartile</option>
              <option value="H">High</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button onClick={downloadPNG}>Download PNG</Button>
            <Button variant="secondary" onClick={downloadSVG}>
              Download SVG
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
