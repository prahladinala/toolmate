"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { ToolDef } from "../registry";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Clock,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Globe,
} from "lucide-react";
import cronstrue from "cronstrue";
import { cn } from "@/lib/utils/cn";

const EXAMPLES = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 mins", value: "*/5 * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Weekdays 9 AM", value: "0 9 * * 1-5" },
  { label: "Weekly Sunday", value: "0 0 * * 0" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
];

export function CronBuilderTool({ tool }: { tool: ToolDef }) {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [timezone, setTimezone] = useState<"local" | "utc">("local");

  const cron = `${minute} ${hour} ${dom} ${month} ${dow}`;

  // Human description
  const humanReadable = useMemo(() => {
    try {
      return cronstrue.toString(cron, { use24HourTimeFormat: true });
    } catch {
      return "Invalid or custom CRON expression";
    }
  }, [cron]);

  // Compute next 5 simulated runs
  const nextRuns = useMemo(() => {
    const list: string[] = [];
    const now = new Date();
    let current = new Date(now.getTime() + 60000); // start next minute

    // Simple forward stepper matching basic crons
    let iterations = 0;
    while (list.length < 5 && iterations < 50000) {
      iterations++;
      const m = current.getMinutes();
      const h = current.getHours();
      const d = current.getDate();
      const mon = current.getMonth() + 1;
      const dayOfWeek = current.getDay();

      const matchMin =
        minute === "*" ||
        (minute.startsWith("*/") && m % parseInt(minute.slice(2)) === 0) ||
        minute.split(",").map(Number).includes(m);

      const matchHour =
        hour === "*" ||
        (hour.startsWith("*/") && h % parseInt(hour.slice(2)) === 0) ||
        hour.split(",").map(Number).includes(h);

      const matchDom =
        dom === "*" || dom.split(",").map(Number).includes(d);

      const matchMon =
        month === "*" || month.split(",").map(Number).includes(mon);

      const matchDow =
        dow === "*" ||
        dow.split(",").map(Number).includes(dayOfWeek) ||
        (dow.includes("-") &&
          dayOfWeek >= parseInt(dow.split("-")[0]) &&
          dayOfWeek <= parseInt(dow.split("-")[1]));

      if (matchMin && matchHour && matchDom && matchMon && matchDow) {
        list.push(
          current.toLocaleString("en-US", {
            timeZone: timezone === "utc" ? "UTC" : undefined,
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }) + (timezone === "utc" ? " UTC" : "")
        );
      }

      current = new Date(current.getTime() + 60000);
    }

    return list;
  }, [minute, hour, dom, month, dow, timezone]);

  const loadExample = (val: string) => {
    const parts = val.split(" ");
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDom(parts[2]);
      setMonth(parts[3]);
      setDow(parts[4]);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide" className="space-y-6">
      {/* Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => loadExample(ex.value)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all whitespace-nowrap shadow-xs"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Main CRON Banner */}
      <Card className="p-6 bg-card/90 border-border/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Generated CRON Expression
            </span>
            <div className="font-mono text-2xl font-bold text-foreground mt-1 tracking-wider">
              {cron}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton value={cron} text="Copy Expression" />
          </div>
        </div>

        {/* Human Readable English Meaning */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-2.5 text-xs text-foreground font-medium">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{humanReadable}</span>
        </div>
      </Card>

      {/* Interactive 5-Field Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Minute */}
        <Card className="p-3.5 bg-card border-border/80 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Minute (0-59)
          </label>
          <Input
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder="*"
            className="font-mono text-sm h-9"
          />
          <span className="text-[10px] text-muted-foreground block font-mono">
            e.g. *, */15, 0,30
          </span>
        </Card>

        {/* Hour */}
        <Card className="p-3.5 bg-card border-border/80 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Hour (0-23)
          </label>
          <Input
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            placeholder="*"
            className="font-mono text-sm h-9"
          />
          <span className="text-[10px] text-muted-foreground block font-mono">
            e.g. *, */2, 9-17
          </span>
        </Card>

        {/* Day of Month */}
        <Card className="p-3.5 bg-card border-border/80 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Day of Month (1-31)
          </label>
          <Input
            value={dom}
            onChange={(e) => setDom(e.target.value)}
            placeholder="*"
            className="font-mono text-sm h-9"
          />
          <span className="text-[10px] text-muted-foreground block font-mono">
            e.g. *, 1, 15, L
          </span>
        </Card>

        {/* Month */}
        <Card className="p-3.5 bg-card border-border/80 shadow-xs space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Month (1-12)
          </label>
          <Input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="*"
            className="font-mono text-sm h-9"
          />
          <span className="text-[10px] text-muted-foreground block font-mono">
            e.g. *, 1-6, */3
          </span>
        </Card>

        {/* Day of Week */}
        <Card className="p-3.5 bg-card border-border/80 shadow-xs space-y-2 col-span-2 sm:col-span-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Day of Week (0-6)
          </label>
          <Input
            value={dow}
            onChange={(e) => setDow(e.target.value)}
            placeholder="*"
            className="font-mono text-sm h-9"
          />
          <span className="text-[10px] text-muted-foreground block font-mono">
            0=Sun, 1-5=Mon-Fri
          </span>
        </Card>
      </div>

      {/* Next Scheduled Runs Timeline */}
      <Card className="p-5 bg-card/90 border-border/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Next 5 Simulated Scheduled Executions
          </span>

          {/* Timezone toggle */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setTimezone("local")}
              className={cn(
                "px-2.5 py-0.5 rounded text-xs font-semibold transition-all",
                timezone === "local" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
              )}
            >
              Local Time
            </button>
            <button
              type="button"
              onClick={() => setTimezone("utc")}
              className={cn(
                "px-2.5 py-0.5 rounded text-xs font-semibold transition-all",
                timezone === "utc" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
              )}
            >
              UTC
            </button>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          {nextRuns.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">
              Unable to calculate next runs for this expression.
            </span>
          ) : (
            nextRuns.map((run, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground w-6">
                    #{i + 1}
                  </span>
                  <span className="text-foreground font-semibold">{run}</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Scheduled
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </ToolWorkspace>
  );
}

export default CronBuilderTool;

