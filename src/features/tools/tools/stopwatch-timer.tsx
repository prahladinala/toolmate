"use client";

import React, { useState, useEffect, useRef } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

export function StopwatchTimerTool({ tool }: { tool: ToolDef }) {
  const [time, setTime] = useState(0);
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
      setLaps((l) => [time, ...l]);
    }
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${centi.toString().padStart(2, "0")}`;
  };

  return (
    <ToolWorkspace maxWidth="compact">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          High-precision browser stopwatch with lap splitting and millisecond accuracy
        </span>
      </ToolToolbar>

      {/* Main Stopwatch Timer Card */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex flex-col items-center justify-center text-center space-y-8">
        <div className="text-5xl sm:text-7xl lg:text-8xl font-mono font-extrabold tracking-tight text-[rgb(var(--fg))] select-all">
          {formatTime(time)}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
          <Button
            type="button"
            size="lg"
            variant={running ? "secondary" : "primary"}
            onClick={toggle}
            className="flex-1 h-12 text-sm font-semibold rounded-2xl min-w-[120px]"
          >
            {running ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={lap}
            disabled={!running}
            className="h-12 px-5 text-sm font-semibold rounded-2xl"
          >
            <Flag className="w-4 h-4 mr-2" />
            Lap
          </Button>

          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={reset}
            className="h-12 px-5 text-sm font-semibold rounded-2xl text-[rgb(var(--muted))] hover:text-red-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Lap Times Record */}
      {laps.length > 0 && (
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Recorded Laps ({laps.length})
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setLaps([])}
              className="text-xs h-7 px-2"
            >
              Clear Laps
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto scrollbar-refined divide-y divide-[rgb(var(--border))]">
            {laps.map((l, i) => {
              const lapNum = laps.length - i;
              return (
                <div
                  key={i}
                  className="p-3.5 sm:p-4 flex items-center justify-between font-mono text-xs sm:text-sm hover:bg-[rgb(var(--card-2))]/50 transition-colors"
                >
                  <span className="text-[rgb(var(--muted))] font-semibold">Lap {lapNum}</span>
                  <span className="font-bold text-[rgb(var(--fg))]">{formatTime(l)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
