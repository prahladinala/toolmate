"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Settings = {
  count: number;
  uppercase: boolean;
  removeHyphens: boolean;
  prefix: string;
  suffix: string;
  autoGenerate: boolean;
};

function generateUUIDv4() {
  return crypto.randomUUID();
}

export default function UuidGeneratorTool() {
  const [uuids, setUuids] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState<string | null>(null);

  const [settings, setSettings] = React.useState<Settings>({
    count: 1,
    uppercase: false,
    removeHyphens: false,
    prefix: "",
    suffix: "",
    autoGenerate: true,
  });

  const generate = React.useCallback(() => {
    const list = Array.from({ length: settings.count }).map(() => {
      let id = generateUUIDv4();

      if (settings.removeHyphens) id = id.replace(/-/g, "");
      if (settings.uppercase) id = id.toUpperCase();

      return `${settings.prefix}${id}${settings.suffix}`;
    });

    setUuids(list);
  }, [settings]);

  React.useEffect(() => {
    if (settings.autoGenerate) generate();
  }, [settings, generate]);

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard!");
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1200);
  };

  const download = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Controls */}
      <Card className="mt-6 p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="text-sm">Count</Label>
            <Input
              type="number"
              min={1}
              max={1000}
              value={settings.count}
              onChange={(e) =>
                setSettings({ ...settings, count: Number(e.target.value) })
              }
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          <div>
            <Label className="text-sm">Prefix</Label>
            <Input
              value={settings.prefix}
              onChange={(e) =>
                setSettings({ ...settings, prefix: e.target.value })
              }
              className="mt-1 w-full rounded border p-2"
            />
          </div>

          <div>
            <Label className="text-sm">Suffix</Label>
            <Input
              value={settings.suffix}
              onChange={(e) =>
                setSettings({ ...settings, suffix: e.target.value })
              }
              className="mt-1 w-full rounded border p-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Label>
            <input
              type="checkbox"
              checked={settings.uppercase}
              onChange={(e) =>
                setSettings({ ...settings, uppercase: e.target.checked })
              }
            />{" "}
            Uppercase
          </Label>

          <Label>
            <input
              type="checkbox"
              checked={settings.removeHyphens}
              onChange={(e) =>
                setSettings({ ...settings, removeHyphens: e.target.checked })
              }
            />{" "}
            Remove Hyphens
          </Label>

          <Label>
            <input
              type="checkbox"
              checked={settings.autoGenerate}
              onChange={(e) =>
                setSettings({ ...settings, autoGenerate: e.target.checked })
              }
            />{" "}
            Auto Generate
          </Label>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={generate}>Generate</Button>
          <Button variant="secondary" onClick={copyAll}>
            {copied === "all" ? "Copied ✓" : "Copy All"}
          </Button>
          <Button variant="secondary" onClick={download}>
            Download
          </Button>
        </div>
      </Card>

      {/* Output */}
      <div className="mt-6 space-y-3">
        {uuids.map((id, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-4 flex items-center justify-between">
              <span className="font-mono text-sm break-all">{id}</span>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => copy(id, id)}
                className={`
                  rounded border px-3 py-1 text-xs transition
                  ${
                    copied === id
                      ? "border-[rgba(var(--accent),0.5)] bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
                      : "border-[rgb(var(--border))] hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]"
                  }
                `}
              >
                {copied === id ? "Copied ✓" : "Copy"}
              </motion.button>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
