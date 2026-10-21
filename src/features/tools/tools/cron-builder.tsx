"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import cronstrue from "cronstrue";

const EXAMPLES = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour at minute 0", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at midnight", value: "0 0 * * 1" },
  { label: "Every weekday (Mon-Fri) at 9:00 AM", value: "0 9 * * 1-5" },
];

export default function CronBuilder() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const [cron, setCron] = useState("* * * * *");
  const [humanReadable, setHumanReadable] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const expr = `${minute} ${hour} ${dom} ${month} ${dow}`;
    setCron(expr);
    try {
      setHumanReadable(cronstrue.toString(expr));
    } catch {
      setHumanReadable("Custom schedule");
    }
  }, [minute, hour, dom, month, dow]);

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

  const copyCron = async () => {
    try {
      await navigator.clipboard.writeText(cron);
      toast.success("CRON expression copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      <ToolToolbar>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider mr-1">
            Common Schedules:
          </span>
          {EXAMPLES.map((ex) => (
            <Button
              key={ex.label}
              type="button"
              size="sm"
              variant={cron === ex.value ? "primary" : "secondary"}
              onClick={() => loadExample(ex.value)}
              className="text-xs h-7 px-2.5"
            >
              {ex.label}
            </Button>
          ))}
        </div>
      </ToolToolbar>

      {/* Generated Display Hero */}
      <div className="p-8 sm:p-10 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm text-center flex flex-col items-center justify-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--muted))]">
          Standard 5-Field CRON Expression
        </span>
        <div className="text-4xl sm:text-6xl font-mono font-extrabold tracking-widest text-[rgb(var(--fg))] select-all py-2">
          {cron}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-xs sm:text-sm">
          <Clock className="w-4 h-4 shrink-0" />
          <span>&ldquo;{humanReadable}&rdquo;</span>
        </div>
        <Button
          type="button"
          size="lg"
          variant="primary"
          onClick={copyCron}
          className="text-xs h-11 px-6 rounded-2xl"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
              Copied Expression
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy Expression
            </>
          )}
        </Button>
      </div>

      {/* Field Modifiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 w-full">
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Minute (0-59)
          </label>
          <Input
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            placeholder="*"
          />
          <span className="text-[11px] text-[rgb(var(--muted))] block">e.g. *, 0, */5</span>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Hour (0-23)
          </label>
          <Input
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            placeholder="*"
          />
          <span className="text-[11px] text-[rgb(var(--muted))] block">e.g. *, 0, 12, */2</span>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Day of Month (1-31)
          </label>
          <Input
            value={dom}
            onChange={(e) => setDom(e.target.value)}
            className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            placeholder="*"
          />
          <span className="text-[11px] text-[rgb(var(--muted))] block">e.g. *, 1, 15, L</span>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Month (1-12)
          </label>
          <Input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            placeholder="*"
          />
          <span className="text-[11px] text-[rgb(var(--muted))] block">e.g. *, 1, 6, 12</span>
        </div>

        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-2">
          <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
            Day of Week (0-6)
          </label>
          <Input
            value={dow}
            onChange={(e) => setDow(e.target.value)}
            className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
            placeholder="*"
          />
          <span className="text-[11px] text-[rgb(var(--muted))] block">0=Sun, 1-5=Mon-Fri</span>
        </div>
      </div>
    </ToolWorkspace>
  );
}
