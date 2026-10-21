"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Plus, Trash2, Copy, Check, Play } from "lucide-react";
import { toast } from "sonner";

const PRESETS = [
  {
    name: "Pulse",
    frames: [
      { percent: "0%", css: "transform: scale(1);" },
      { percent: "50%", css: "transform: scale(1.08);" },
      { percent: "100%", css: "transform: scale(1);" },
    ],
  },
  {
    name: "Bounce",
    frames: [
      { percent: "0%", css: "transform: translateY(0);" },
      { percent: "50%", css: "transform: translateY(-24px);" },
      { percent: "100%", css: "transform: translateY(0);" },
    ],
  },
  {
    name: "Slide & Fade",
    frames: [
      { percent: "0%", css: "opacity: 0; transform: translateY(30px);" },
      { percent: "100%", css: "opacity: 1; transform: translateY(0);" },
    ],
  },
  {
    name: "Spin",
    frames: [
      { percent: "0%", css: "transform: rotate(0deg);" },
      { percent: "100%", css: "transform: rotate(360deg);" },
    ],
  },
];

export default function CSSKeyframesBuilder() {
  const [animationName, setAnimationName] = useState("myCustomAnimation");
  const [keyframes, setKeyframes] = useState([
    { percent: "0%", css: "opacity: 0; transform: translateY(20px);" },
    { percent: "100%", css: "opacity: 1; transform: translateY(0);" },
  ]);
  const [duration, setDuration] = useState("1.5s");
  const [easing, setEasing] = useState("ease-out");
  const [iteration, setIteration] = useState("infinite");
  const [generatedCSS, setGeneratedCSS] = useState("");
  const [copied, setCopied] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    let css = `@keyframes ${animationName || "anim"} {\n`;
    keyframes.forEach((k) => {
      css += `  ${k.percent} {\n    ${k.css}\n  }\n`;
    });
    css += `}\n\n`;
    css += `.animate-${animationName || "anim"} {\n  animation: ${animationName || "anim"} ${duration} ${easing} ${iteration};\n}`;
    setGeneratedCSS(css);
  }, [animationName, keyframes, duration, easing, iteration]);

  const addFrame = () => {
    setKeyframes([...keyframes, { percent: "50%", css: "transform: scale(1.1);" }]);
  };

  const removeFrame = (idx: number) => {
    if (keyframes.length <= 2) return;
    setKeyframes(keyframes.filter((_, i) => i !== idx));
  };

  const updateFrame = (idx: number, field: "percent" | "css", val: string) => {
    const updated = [...keyframes];
    updated[idx][field] = val;
    setKeyframes(updated);
  };

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(generatedCSS);
      toast.success("Keyframes CSS copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <style dangerouslySetInnerHTML={{ __html: generatedCSS }} />

      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Presets:
          </span>
          {PRESETS.map((p) => (
            <Button
              key={p.name}
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setAnimationName(p.name.toLowerCase().replace(/\s+/g, ""));
                setKeyframes(p.frames);
                setReplayKey((k) => k + 1);
              }}
              className="text-xs h-7 px-2.5"
            >
              {p.name}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="primary"
          onClick={() => setReplayKey((k) => k + 1)}
          className="text-xs"
        >
          <Play className="w-3.5 h-3.5 mr-1" />
          Replay
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Keyframe Editor */}
        <div className="lg:col-span-6 flex flex-col min-w-0 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-[rgb(var(--border))]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Animation Name
              </label>
              <Input
                value={animationName}
                onChange={(e) => setAnimationName(e.target.value)}
                className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                  Duration
                </label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                  Loop
                </label>
                <Select
                  value={iteration}
                  onChange={(e) => setIteration(e.target.value)}
                  className="text-xs h-9 bg-[rgb(var(--card-2))]"
                >
                  <option value="infinite">infinite</option>
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Frame List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                Keyframe Steps
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={addFrame}
                className="text-xs h-7 px-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Step
              </Button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-refined pr-1">
              {keyframes.map((frame, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center gap-2"
                >
                  <Input
                    value={frame.percent}
                    onChange={(e) => updateFrame(idx, "percent", e.target.value)}
                    placeholder="0%"
                    className="w-16 h-8 text-xs font-mono shrink-0 bg-[rgb(var(--card))]"
                  />
                  <Input
                    value={frame.css}
                    onChange={(e) => updateFrame(idx, "css", e.target.value)}
                    placeholder="opacity: 1;"
                    className="flex-1 h-8 text-xs font-mono bg-[rgb(var(--card))]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFrame(idx)}
                    disabled={keyframes.length <= 2}
                    className="p-1.5 text-[rgb(var(--muted))] hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview & Output */}
        <div className="lg:col-span-6 flex flex-col min-w-0 space-y-6">
          <div className="w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-center p-8 overflow-hidden">
            <div
              key={replayKey}
              className={`w-32 h-32 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl flex items-center justify-center text-white font-semibold text-sm select-none animate-${animationName || "anim"}`}
            >
              Keyframes
            </div>
          </div>

          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Generated Keyframes CSS
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
              value={generatedCSS}
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
