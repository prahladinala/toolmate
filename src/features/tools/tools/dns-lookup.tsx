"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Search, Globe, ShieldCheck, AlertCircle, Clock, ExternalLink } from "lucide-react";

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

export default function DomainIntelligenceTool() {
  const [domain, setDomain] = useState("toolmate.co.in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dnsData, setDnsData] = useState<Record<string, any[]> | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const lookup = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setDnsData(null);
    setResponseTime(null);

    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();

    try {
      const dnsResults: Record<string, any[]> = {};
      const start = performance.now();

      const responses = await Promise.all(
        RECORD_TYPES.map((t) =>
          fetch(`https://dns.google/resolve?name=${cleanDomain}&type=${t}`)
            .then((r) => r.json())
            .catch(() => ({ Answer: null }))
        )
      );

      const duration = Math.round(performance.now() - start);
      setResponseTime(duration);

      responses.forEach((res, i) => {
        if (Array.isArray(res?.Answer)) {
          dnsResults[RECORD_TYPES[i]] = res.Answer;
        }
      });

      if (Object.keys(dnsResults).length === 0) {
        throw new Error("No public DNS records could be retrieved for this domain.");
      }

      setDnsData(dnsResults);
    } catch (e: any) {
      setError(e.message || "Failed to query domain records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      {/* Search Bar */}
      <div className="w-full p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-[rgb(var(--muted))] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com or github.com"
              className="pl-9 font-mono text-xs sm:text-sm h-11 bg-[rgb(var(--card-2))]"
            />
          </div>
          <Button type="submit" loading={loading} className="text-xs h-11 px-5">
            <Search className="w-3.5 h-3.5 mr-1" />
            Lookup Records
          </Button>
        </form>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {responseTime && (
        <div className="p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-[rgb(var(--fg))]">Google DNS Latency</span>
          </div>
          <span className="font-mono text-emerald-500 font-semibold">{responseTime} ms</span>
        </div>
      )}

      {dnsData && (
        <div className="space-y-4 w-full min-w-0">
          {Object.entries(dnsData).map(([type, records]) => (
            <div
              key={type}
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden"
            >
              <div className="p-3.5 sm:p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  {type} Records
                </span>
                <span className="text-xs text-[rgb(var(--muted))]">
                  {records.length} item{records.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-[rgb(var(--border))]">
                {records.map((r, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono hover:bg-[rgb(var(--card-2))]/50 transition-colors"
                  >
                    <span className="text-[rgb(var(--fg))] break-all select-all flex-1">
                      {r.data}
                    </span>
                    <span className="text-[rgb(var(--muted))] text-[11px] shrink-0">
                      TTL: {r.TTL}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ToolWorkspace>
  );
}
