"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Utilities for color conversion and contrast
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function isValidHex(hex: string) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
}

function fixHex(hex: string) {
  if (!hex.startsWith("#")) hex = "#" + hex;
  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

export default function WCAGContrastChecker() {
  const [foreground, setForeground] = useState("#FFFFFF");
  const [background, setBackground] = useState("#3B82F6");

  const [fgInput, setFgInput] = useState(foreground);
  const [bgInput, setBgInput] = useState(background);

  useEffect(() => {
    if (isValidHex(fgInput)) setForeground(fixHex(fgInput));
  }, [fgInput]);

  useEffect(() => {
    if (isValidHex(bgInput)) setBackground(fixHex(bgInput));
  }, [bgInput]);

  const ratio = useMemo(() => getContrastRatio(foreground, background), [foreground, background]);
  
  const isAANormal = ratio >= 4.5;
  const isAALarge = ratio >= 3.0;
  const isAAANormal = ratio >= 7.0;
  const isAAALarge = ratio >= 4.5;

  const getBadge = (pass: boolean) => (
    <span className={`px-2 py-1 rounded text-xs font-bold ${pass ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
      {pass ? "PASS" : "FAIL"}
    </span>
  );

  return (
    <main className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Foreground Color</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={foreground} 
                  onChange={(e) => {
                    setForeground(e.target.value);
                    setFgInput(e.target.value);
                  }}
                  className="w-14 h-14 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={fgInput} 
                  onChange={(e) => setFgInput(e.target.value)}
                  className="flex-1 h-14 font-mono text-lg uppercase"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Background Color</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={background} 
                  onChange={(e) => {
                    setBackground(e.target.value);
                    setBgInput(e.target.value);
                  }}
                  className="w-14 h-14 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={bgInput} 
                  onChange={(e) => setBgInput(e.target.value)}
                  className="flex-1 h-14 font-mono text-lg uppercase"
                />
              </div>
            </div>
            
            <Button variant="secondary" className="w-full" onClick={() => {
              const temp = foreground;
              setForeground(background);
              setFgInput(background);
              setBackground(temp);
              setBgInput(temp);
            }}>
              Swap Colors
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-2 flex flex-col items-center justify-center min-h-[160px]">
            <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Contrast Ratio</div>
            <div className="text-6xl font-bold font-mono tracking-tight">{ratio.toFixed(2)}</div>
          </Card>

          <Card className="p-0 overflow-hidden divide-y">
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">WCAG AA</div>
                <div className="text-xs text-muted-foreground">Normal Text (4.5:1)</div>
              </div>
              {getBadge(isAANormal)}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">WCAG AA</div>
                <div className="text-xs text-muted-foreground">Large Text (3.0:1)</div>
              </div>
              {getBadge(isAALarge)}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">WCAG AAA</div>
                <div className="text-xs text-muted-foreground">Normal Text (7.0:1)</div>
              </div>
              {getBadge(isAAANormal)}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">WCAG AAA</div>
                <div className="text-xs text-muted-foreground">Large Text (4.5:1)</div>
              </div>
              {getBadge(isAAALarge)}
            </div>
          </Card>
        </div>
      </div>

      {/* Live Preview */}
      <Card className="overflow-hidden">
        <div className="bg-muted p-4 border-b font-semibold">Live Preview</div>
        <div 
          className="p-12 space-y-6 transition-colors duration-200" 
          style={{ backgroundColor: background, color: foreground }}
        >
          <h1 className="text-4xl font-bold">This is Large Text (24pt or 18pt bold)</h1>
          <p className="text-lg leading-relaxed max-w-2xl">
            This is normal body text. The quick brown fox jumps over the lazy dog. 
            Ensuring adequate color contrast is essential for visually impaired users 
            and helps improve readability for everyone.
          </p>
          <div className="pt-4">
            <Button 
              className="px-6 py-2 rounded font-semibold border-2"
              style={{ borderColor: foreground }}
            >
              Interactive Element
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
