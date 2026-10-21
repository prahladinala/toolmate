"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, Play } from "lucide-react";
import { toast } from "sonner";

const ANIMATIONS = {
  slideUp: {
    keyframes: `@keyframes slideUp {\n  0% { transform: translateY(60px); opacity: 0; }\n  100% { transform: translateY(0); opacity: 1; }\n}`,
    class: "slideUp",
  },
  fadeIn: {
    keyframes: `@keyframes fadeIn {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}`,
    class: "fadeIn",
  },
  zoomIn: {
    keyframes: `@keyframes zoomIn {\n  0% { transform: scale(0.6); opacity: 0; }\n  100% { transform: scale(1); opacity: 1; }\n}`,
    class: "zoomIn",
  },
  bounce: {
    keyframes: `@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }\n  40% { transform: translateY(-24px); }\n  60% { transform: translateY(-12px); }\n}`,
    class: "bounce",
  },
  pulse: {
    keyframes: `@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.08); }\n  100% { transform: scale(1); }\n}`,
    class: "pulse",
  },
  spin: {
    keyframes: `@keyframes spin {\n  100% { transform: rotate(360deg); }\n}`,
    class: "spin",
  },
};

type AnimKey = keyof typeof ANIMATIONS;

export function CssAnimationGeneratorTool({ tool }: { tool: ToolDef }) {
  const [type, setType] = useState<AnimKey>("slideUp");
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState("ease-out");
  const [iteration, setIteration] = useState("1");
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("forwards");
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const anim = ANIMATIONS[type];

  const cssClass = `.animate-${anim.class} {
  animation: ${anim.class} ${duration}s ${easing} ${delay}s ${iteration} ${direction} ${fillMode};
}`;

  const fullCss = `${anim.keyframes}\n\n${cssClass}`;

  const previewStyle: React.CSSProperties = {
    animationName: anim.class,
    animationDuration: `${duration}s`,
    animationTimingFunction: easing,
    animationDelay: `${delay}s`,
    animationIterationCount: iteration,
    animationDirection: direction as any,
    animationFillMode: fillMode as any,
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(fullCss);
      toast.success("Animation CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <style>{anim.keyframes}</style>

      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Configure keyframe presets, easing curves, timing, and export production CSS
        </span>
        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={() => setKey((k) => k + 1)}
          className="text-xs"
        >
          <Play className="w-3.5 h-3.5 mr-1" />
          Replay Animation
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div>
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
              Animation Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ANIMATIONS) as AnimKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setType(k);
                    setKey((prev) => prev + 1);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    type === k
                      ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] shadow-sm"
                      : "bg-[rgb(var(--card-2))] text-[rgb(var(--muted))] border border-[rgb(var(--border))] hover:text-[rgb(var(--fg))]"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Duration</span>
                <span className="font-mono text-[rgb(var(--muted))]">{duration}s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[rgb(var(--fg))]">Delay</span>
                <span className="font-mono text-[rgb(var(--muted))]">{delay}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full h-1.5 bg-[rgb(var(--card-2))] rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Timing Curve
              </label>
              <Select
                value={easing}
                onChange={(e) => setEasing(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="ease">ease</option>
                <option value="ease-in">ease-in</option>
                <option value="ease-out">ease-out</option>
                <option value="ease-in-out">ease-in-out</option>
                <option value="linear">linear</option>
                <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">bounce bezier</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Iterations
              </label>
              <Select
                value={iteration}
                onChange={(e) => setIteration(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="1">1 time</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="infinite">infinite</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Direction
              </label>
              <Select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="normal">normal</option>
                <option value="reverse">reverse</option>
                <option value="alternate">alternate</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1.5">
                Fill Mode
              </label>
              <Select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              >
                <option value="forwards">forwards</option>
                <option value="backwards">backwards</option>
                <option value="both">both</option>
                <option value="none">none</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="lg:col-span-7 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[260px] sm:min-h-[320px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-8 overflow-hidden">
            <div
              key={key}
              className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-xl flex items-center justify-center text-white font-semibold text-sm select-none"
              style={previewStyle}
            >
              Animated Element
            </div>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated CSS & Keyframes
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={copyCss}
                className="text-xs h-7 px-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy CSS
                  </>
                )}
              </Button>
            </div>
            <CodeEditor
              value={fullCss}
              language="css"
              editable={false}
              minHeight="min-h-[160px]"
            />
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
