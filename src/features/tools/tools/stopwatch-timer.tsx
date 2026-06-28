"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

export function StopwatchTimerTool({ tool }: { tool: ToolDef }) {
  const [time, setTime] = useState(0); // in ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (running) {
      lastUpdateRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = now - lastUpdateRef.current;
        setTime((t) => t + diff);
        lastUpdateRef.current = now;
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const toggle = () => setRunning(!running);
  
  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  const lap = () => {
    if (running) {
      setLaps((l) => [...l, time]);
    }
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${centi.toString().padStart(2, "0")}`;
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-center">
      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-12 shadow-sm">
        <div className="text-7xl font-mono font-medium tracking-wider mb-12">
          {formatTime(time)}
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={toggle} size="lg" className="w-32" variant={running ? "secondary" : "primary"}>
            {running ? <><Pause className="mr-2 h-4 w-4"/> Pause</> : <><Play className="mr-2 h-4 w-4"/> Start</>}
          </Button>
          <Button onClick={lap} size="lg" variant="secondary" className="w-32" disabled={!running}>
            Lap
          </Button>
          <Button onClick={reset} size="lg" variant="destructive" className="w-32 bg-red-500 hover:bg-red-600 text-white border-none">
            <RotateCcw className="mr-2 h-4 w-4"/> Reset
          </Button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 text-left">
          <h3 className="font-medium text-lg mb-4">Laps</h3>
          <div className="max-h-[300px] overflow-auto flex flex-col gap-2">
            {laps.map((l, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[rgb(var(--border))] last:border-0 font-mono text-sm">
                <span className="text-neutral-500">Lap {i + 1}</span>
                <span>{formatTime(l)}</span>
                <span className="text-blue-500">
                  +{i === 0 ? formatTime(l) : formatTime(l - laps[i - 1])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
