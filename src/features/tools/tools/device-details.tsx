"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <Card className="p-5">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between border-b border-[rgba(var(--border),0.4)] pb-1">
      <span className="text-[rgb(var(--muted))]">{label}</span>
      <span className="font-medium">{String(value ?? "N/A")}</span>
    </div>
  );
}

export default function DeviceDetailsTool() {
  const [storageInfo, setStorageInfo] = React.useState<any>(null);
  const [webglInfo, setWebglInfo] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Storage estimate
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then(setStorageInfo);
    }

    // WebGL GPU info
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
    } catch {}
  }, []);

  const connection = (navigator as any).connection;

  const storageChart =
    storageInfo && storageInfo.quota
      ? [
          {
            name: "Used",
            value: storageInfo.usage / (1024 * 1024),
          },
          {
            name: "Free",
            value: (storageInfo.quota - storageInfo.usage) / (1024 * 1024),
          },
        ]
      : null;

  const copyAll = async () => {
    const full = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screen,
      connection,
      storageInfo,
      webglInfo,
    };
    await navigator.clipboard.writeText(JSON.stringify(full, null, 2));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Device Details
          </h1>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">
            Browser, hardware, connection & capability insights.
          </p>
        </div>

        <Button onClick={copyAll}>Copy Full Report</Button>
      </motion.div>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* BASIC INFO */}
        <Section title="Basic Info">
          <InfoRow label="User Agent" value={navigator.userAgent} />
          <InfoRow label="Platform" value={navigator.platform} />
          <InfoRow label="Language" value={navigator.language} />
          <InfoRow
            label="Online Status"
            value={navigator.onLine ? "Online" : "Offline"}
          />
        </Section>

        {/* HARDWARE */}
        <Section title="Hardware">
          <InfoRow label="CPU Cores" value={navigator.hardwareConcurrency} />
          <InfoRow
            label="Device Memory (GB)"
            value={(navigator as any).deviceMemory ?? "Unknown"}
          />
          <InfoRow label="GPU (WebGL)" value={webglInfo} />
        </Section>

        {/* SCREEN */}
        <Section title="Screen">
          <InfoRow label="Width" value={screen.width} />
          <InfoRow label="Height" value={screen.height} />
          <InfoRow label="Pixel Ratio" value={window.devicePixelRatio} />
          <InfoRow label="Color Depth" value={screen.colorDepth} />
        </Section>

        {/* CONNECTION */}
        <Section title="Connection">
          <InfoRow
            label="Type"
            value={connection?.effectiveType ?? "Unknown"}
          />
          <InfoRow
            label="Downlink (Mbps)"
            value={connection?.downlink ?? "N/A"}
          />
          <InfoRow label="RTT (ms)" value={connection?.rtt ?? "N/A"} />
          <InfoRow
            label="Save Data Mode"
            value={connection?.saveData ? "Enabled" : "Disabled"}
          />
        </Section>

        {/* STORAGE CHART */}
        {storageChart && (
          <div className="lg:col-span-2">
            <Card className="p-5">
              <div className="text-lg font-semibold">Storage Usage (MB)</div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storageChart}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="rgb(var(--accent))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
