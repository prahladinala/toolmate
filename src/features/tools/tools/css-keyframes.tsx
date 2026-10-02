"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CodeEditor } from "@/components/ui/code-editor";
import { toast } from "sonner";

const PRESETS = [
  { name: "Pulse", code: `@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n}` },
  { name: "Bounce", code: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-25%); }\n}` },
  { name: "Spin", code: `@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}` },
  { name: "Fade In", code: `@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}` },
];

export default function CSSKeyframesBuilder() {
  const [animationName, setAnimationName] = useState("myAnimation");
  const [keyframes, setKeyframes] = useState([{ percent: "0%", css: "opacity: 0; transform: translateY(20px);" }, { percent: "100%", css: "opacity: 1; transform: translateY(0);" }]);
  const [duration, setDuration] = useState("2s");
  const [easing, setEasing] = useState("ease-out");
  const [iteration, setIteration] = useState("infinite");
  const [generatedCSS, setGeneratedCSS] = useState("");

  useEffect(() => {
    let css = `@keyframes ${animationName} {\n`;
    keyframes.forEach(k => {
      css += `  ${k.percent} {\n    ${k.css}\n  }\n`;
    });
    css += `}\n\n`;
    css += `.animate-${animationName} {\n  animation: ${animationName} ${duration} ${easing} ${iteration};\n}`;
    setGeneratedCSS(css);
  }, [animationName, keyframes, duration, easing, iteration]);

  const loadPreset = (code: string) => {
    // Parse rudimentary preset string back into state
    const match = code.match(/@keyframes\s+(\w+)\s+{([\s\S]+)}/);
    if (match) {
      setAnimationName(match[1]);
      const frames = match[2].split("}").map(s => s.trim()).filter(Boolean);
      const parsedFrames = frames.map(f => {
        const [pct, css] = f.split("{").map(s => s.trim());
        return { percent: pct, css: css.replace(/\n\s*/g, ' ') };
      });
      setKeyframes(parsedFrames);
    }
  };

  return (
    <main className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Dynamic Style Injection for Preview */}
      <style dangerouslySetInnerHTML={{ __html: generatedCSS }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Editor */}
        <Card className="p-6 space-y-6 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <div className="space-y-4 border-b pb-4">
            <h2 className="font-semibold text-lg">Animation Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Animation Name</Label>
                <Input value={animationName} onChange={e => setAnimationName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Easing Function</Label>
                <Input value={easing} onChange={e => setEasing(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Iteration Count</Label>
                <Input value={iteration} onChange={e => setIteration(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Keyframes</h2>
              <Button size="sm" variant="secondary" onClick={() => setKeyframes([...keyframes, { percent: "50%", css: "" }])}>
                Add Keyframe
              </Button>
            </div>
            
            <div className="space-y-3">
              {keyframes.map((kf, i) => (
                <div key={i} className="flex gap-2 items-start bg-muted/30 p-3 rounded-lg border">
                  <div className="space-y-2 w-1/4">
                    <Label className="text-xs">Timeline %</Label>
                    <Input value={kf.percent} onChange={e => {
                      const newKfs = [...keyframes];
                      newKfs[i].percent = e.target.value;
                      setKeyframes(newKfs);
                    }} />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label className="text-xs">CSS Properties</Label>
                    <Input value={kf.css} onChange={e => {
                      const newKfs = [...keyframes];
                      newKfs[i].css = e.target.value;
                      setKeyframes(newKfs);
                    }} />
                  </div>
                  <Button size="sm" aria-label="Action" variant="destructive" className="mt-6" onClick={() => {
                    const newKfs = [...keyframes];
                    newKfs.splice(i, 1);
                    setKeyframes(newKfs);
                  }}>
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label className="text-muted-foreground text-sm">Presets</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <Button key={p.name} size="sm" variant="secondary" onClick={() => loadPreset(p.code)}>
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Output */}
        <div className="space-y-6">
          <Card className="p-12 shadow-sm border border-[rgba(var(--fg),0.1)] flex items-center justify-center min-h-[300px] overflow-hidden relative bg-grid">
            <div className={`w-32 h-32 bg-accent rounded-xl shadow-lg flex items-center justify-center text-primary-foreground font-bold animate-${animationName}`}>
              Preview
            </div>
          </Card>

          <Card className="p-4 shadow-sm border border-[rgba(var(--fg),0.1)] flex flex-col h-[300px]">
            <div className="flex items-center justify-between pb-2 border-b mb-4">
              <h2 className="font-semibold text-lg">Generated CSS</h2>
              <Button size="sm" onClick={() => navigator.clipboard.writeText(generatedCSS)}>Copy</Button>
            </div>
            <CodeEditor value={generatedCSS} editable={false} language="css" className="flex-1" />
          </Card>
        </div>
      </div>
    </main>
  );
}
