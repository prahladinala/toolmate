"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { ArrowLeftRight, Check, X } from "lucide-react";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
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
  let h = hex;
  if (!h.startsWith("#")) h = "#" + h;
  if (h.length === 4) {
    h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  }
  return h;
}

export default function WCAGContrastChecker() {
  const [foreground, setForeground] = useState("#FFFFFF");
  const [background, setBackground] = useState("#2563EB");

  const [fgInput, setFgInput] = useState(foreground);
  const [bgInput, setBgInput] = useState(background);

  useEffect(() => {
    if (isValidHex(fgInput)) setForeground(fixHex(fgInput));
  }, [fgInput]);

  useEffect(() => {
    if (isValidHex(bgInput)) setBackground(fixHex(bgInput));
  }, [bgInput]);

  const ratio = useMemo(() => getContrastRatio(foreground, background), [foreground, background]);

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setFgInput(background);
    setBackground(temp);
    setBgInput(temp);
  };

  const getScoreBadge = (pass: boolean) => (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
        pass
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
      }`}
    >
      {pass ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {pass ? "PASS" : "FAIL"}
    </span>
  );

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Calculate WCAG 2.1 compliance ratios for normal, large text, and graphical user interfaces
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={swapColors}
          className="text-xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
          Swap Colors
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-w-0">
        {/* Color Controls */}
        <div className="md:col-span-5 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Text / Foreground
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={foreground}
                onChange={(e) => {
                  setForeground(e.target.value);
                  setFgInput(e.target.value);
                }}
                className="w-11 h-11 rounded-xl cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
              />
              <Input
                type="text"
                value={fgInput}
                onChange={(e) => setFgInput(e.target.value)}
                className="font-mono text-xs sm:text-sm h-11 uppercase bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={background}
                onChange={(e) => {
                  setBackground(e.target.value);
                  setBgInput(e.target.value);
                }}
                className="w-11 h-11 rounded-xl cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
              />
              <Input
                type="text"
                value={bgInput}
                onChange={(e) => setBgInput(e.target.value)}
                className="font-mono text-xs sm:text-sm h-11 uppercase bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>
        </div>

        {/* Contrast Ratio Display */}
        <div className="md:col-span-7 flex flex-col justify-center items-center p-6 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))] mb-1">
            Calculated Contrast Ratio
          </span>
          <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-[rgb(var(--fg))]">
            {ratio.toFixed(2)}
            <span className="text-2xl text-[rgb(var(--muted))] font-normal">:1</span>
          </div>
          <span className="text-xs text-[rgb(var(--muted))] mt-2">
            {ratio >= 7
              ? "Enhanced AAA Contrast Level"
              : ratio >= 4.5
              ? "Standard AA Contrast Level"
              : ratio >= 3
              ? "Minimum AA Large Text Level"
              : "Insufficient Contrast for Accessibility"}
          </span>
        </div>
      </div>

      {/* Live Sample Preview */}
      <div
        className="w-full p-6 sm:p-8 rounded-2xl border border-[rgb(var(--border))] shadow-sm transition-colors overflow-hidden"
        style={{ backgroundColor: background, color: foreground }}
      >
        <div className="max-w-2xl space-y-3">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Accessible Typography Preview
          </h3>
          <p className="text-sm sm:text-base leading-relaxed opacity-95">
            This paragraph demonstrates real-world readability. Clear text contrast prevents eye
            strain, increases user engagement, and guarantees compliance with global accessibility
            standards (WCAG 2.1 AA/AAA).
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
              style={{
                backgroundColor: foreground,
                color: background,
              }}
            >
              Inverted Badge
            </span>
            <span className="text-xs font-mono">14px Regular & 18px+ Large Text</span>
          </div>
        </div>
      </div>

      {/* Standards Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              WCAG AA Normal
            </span>
            {getScoreBadge(ratio >= 4.5)}
          </div>
          <p className="text-xs text-[rgb(var(--muted))]">Regular body text requires ≥ 4.5:1</p>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              WCAG AA Large
            </span>
            {getScoreBadge(ratio >= 3.0)}
          </div>
          <p className="text-xs text-[rgb(var(--muted))]">Headings ≥ 18pt or bold ≥ 14pt require ≥ 3.0:1</p>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              WCAG AAA Normal
            </span>
            {getScoreBadge(ratio >= 7.0)}
          </div>
          <p className="text-xs text-[rgb(var(--muted))]">Enhanced readability requires ≥ 7.0:1</p>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              WCAG AAA Large
            </span>
            {getScoreBadge(ratio >= 4.5)}
          </div>
          <p className="text-xs text-[rgb(var(--muted))]">Enhanced headings require ≥ 4.5:1</p>
        </div>
      </div>
    </ToolWorkspace>
  );
}
