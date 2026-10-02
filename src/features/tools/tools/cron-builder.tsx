"use client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";


import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MINUTES = ["*", "0", "15", "30", "45", "*/5", "*/10", "*/15"];
const HOURS = ["*", "0", "12", "*/2", "*/4", "*/6"];
const DOM = ["*", "1", "15", "L", "1-15"];
const MONTHS = ["*", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const DOW = ["*", "0", "1", "2", "3", "4", "5", "6", "1-5", "0,6"];

const EXAMPLES = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour at minute 0", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at midnight", value: "0 0 * * 1" },
  { label: "Every weekday (Mon-Fri) at midnight", value: "0 0 * * 1-5" },
];

export default function CronBuilder() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  
  const [cron, setCron] = useState("* * * * *");
  
  useEffect(() => {
    setCron(`${minute} ${hour} ${dom} ${month} ${dow}`);
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

  return (
    <main className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 space-y-8 bg-card shadow-sm border border-[rgba(var(--fg),0.1)] text-center">
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground uppercase tracking-widest">Generated CRON Expression</h2>
        <div className="text-5xl md:text-7xl font-mono font-bold tracking-tight py-4 bg-muted/30 rounded-2xl border">
          {cron}
        </div>
        <Button size="lg" onClick={() => navigator.clipboard.writeText(cron)}>
          Copy Expression
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 space-y-3 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <Label className="font-semibold text-accent">Minute</Label>
          <Select 
            value={minute} 
            onChange={(e) => setMinute(e.target.value)}
            className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none font-mono"
          >
            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="custom">Custom...</option>
          </Select>
          <Input 
            type="text" 
            value={minute} 
            onChange={(e) => setMinute(e.target.value)} 
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
        </Card>

        <Card className="p-4 space-y-3 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <Label className="font-semibold text-accent">Hour</Label>
          <Select 
            value={hour} 
            onChange={(e) => setHour(e.target.value)}
            className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none font-mono"
          >
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </Select>
          <Input 
            type="text" 
            value={hour} 
            onChange={(e) => setHour(e.target.value)} 
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
        </Card>

        <Card className="p-4 space-y-3 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <Label className="font-semibold text-accent">Day of Month</Label>
          <Select 
            value={dom} 
            onChange={(e) => setDom(e.target.value)}
            className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none font-mono"
          >
            {DOM.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input 
            type="text" 
            value={dom} 
            onChange={(e) => setDom(e.target.value)} 
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
        </Card>

        <Card className="p-4 space-y-3 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <Label className="font-semibold text-accent">Month</Label>
          <Select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none font-mono"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Input 
            type="text" 
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
        </Card>

        <Card className="p-4 space-y-3 shadow-sm border border-[rgba(var(--fg),0.1)]">
          <Label className="font-semibold text-accent">Day of Week</Label>
          <Select 
            value={dow} 
            onChange={(e) => setDow(e.target.value)}
            className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-accent outline-none font-mono"
          >
            {DOW.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Input 
            type="text" 
            value={dow} 
            onChange={(e) => setDow(e.target.value)} 
            className="w-full p-2 border rounded-md font-mono text-sm"
          />
        </Card>
      </div>

      <Card className="p-4 border border-[rgba(var(--fg),0.1)] shadow-sm">
        <Label className="font-semibold mb-4 block">Quick Examples</Label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <Button 
              key={ex.label} 
              variant="secondary" 
              size="sm"
              onClick={() => loadExample(ex.value)}
            >
              {ex.label}
            </Button>
          ))}
        </div>
      </Card>
    </main>
  );
}
