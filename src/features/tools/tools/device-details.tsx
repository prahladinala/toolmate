"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Copy, Check, Monitor, Cpu, Wifi, HardDrive } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgb(var(--border))] last:border-0 text-xs">
      <span className="text-[rgb(var(--muted))]">{label}</span>
      <span className="font-mono font-medium text-[rgb(var(--fg))] text-right max-w-[200px] truncate select-all">
        {String(value ?? "N/A")}
      </span>
    </div>
  );
}

export default function DeviceDetailsTool() {
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [webglInfo, setWebglInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then(setStorageInfo);
    }

    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setWebglInfo(renderer);
        }
      }
    } catch {
      // webgl disabled or unavailable
    }
  }, []);

  const connection = typeof navigator !== "undefined" ? (navigator as any).connection : null;

  const storageChart =
    storageInfo && storageInfo.quota
      ? [
          {
            name: "Used MB",
            value: Math.round(storageInfo.usage / (1024 * 1024)),
          },
          {
            name: "Free MB",
            value: Math.round((storageInfo.quota - storageInfo.usage) / (1024 * 1024)),
          },
        ]
      : null;

  const copyReport = async () => {
    const full = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio,
        colorDepth: screen.colorDepth,
      },
      connection: connection
        ? {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
          }
        : null,
      storageInfo,
      webglInfo,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(full, null, 2));
      toast.success("Device diagnostics copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Inspect client environment hardware, screen specs, network status, WebGL renderer, and storage quotas
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={copyReport}
          className="text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Copied Report
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Full Report
            </>
          )}
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
        {/* System & Hardware */}
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--border))]">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Hardware & Engine
            </span>
          </div>

          <div className="space-y-1">
            <InfoRow label="CPU Logic Cores" value={navigator.hardwareConcurrency} />
            <InfoRow label="Device RAM (GB)" value={(navigator as any).deviceMemory ?? "N/A"} />
            <InfoRow label="GPU / WebGL Renderer" value={webglInfo || "Integrated / Software"} />
            <InfoRow label="Operating System / Platform" value={navigator.platform} />
            <InfoRow label="Primary Language" value={navigator.language} />
            <InfoRow label="Online Connection" value={navigator.onLine ? "Online" : "Offline"} />
          </div>
        </div>

        {/* Display & Screen */}
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--border))]">
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Display & Viewport
            </span>
          </div>

          <div className="space-y-1">
            <InfoRow label="Screen Resolution" value={`${screen.width} × ${screen.height}`} />
            <InfoRow label="Available Workspace" value={`${screen.availWidth} × ${screen.availHeight}`} />
            <InfoRow label="Device Pixel Ratio" value={`${window.devicePixelRatio}x`} />
            <InfoRow label="Color Depth" value={`${screen.colorDepth}-bit`} />
            <InfoRow
              label="Orientation"
              value={screen.orientation ? screen.orientation.type : "Landscape / Default"}
            />
          </div>
        </div>

        {/* Network & Connection */}
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--border))]">
            <Wifi className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Network Telemetry
            </span>
          </div>

          <div className="space-y-1">
            <InfoRow label="Effective Network Type" value={connection?.effectiveType ?? "Broadband / WiFi"} />
            <InfoRow label="Estimated Downlink" value={connection?.downlink ? `${connection.downlink} Mbps` : "N/A"} />
            <InfoRow label="Round Trip Time (RTT)" value={connection?.rtt ? `${connection.rtt} ms` : "N/A"} />
            <InfoRow label="Data Saver Active" value={connection?.saveData ? "Enabled" : "Disabled"} />
          </div>
        </div>

        {/* Browser User Agent */}
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[rgb(var(--border))]">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
              Client User-Agent
            </span>
          </div>

          <p className="text-xs font-mono leading-relaxed text-[rgb(var(--muted))] p-3 rounded-xl bg-[rgb(var(--card-2))] break-all select-all">
            {navigator.userAgent}
          </p>
        </div>
      </div>

      {/* Storage Estimate Chart */}
      {storageChart && (
        <div className="p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))] block">
            Browser Storage Quota (Megabytes)
          </span>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storageChart}>
                <XAxis dataKey="name" stroke="rgb(var(--muted))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--card))",
                    borderColor: "rgb(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
