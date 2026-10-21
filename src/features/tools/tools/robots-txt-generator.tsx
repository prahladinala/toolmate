"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Plus, Trash2, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

export function RobotsTxtGeneratorTool({ tool }: { tool: ToolDef }) {
  const [rules, setRules] = useState([
    { agent: "*", allow: "/", disallow: "/admin/, /api/, /private/" },
    { agent: "Googlebot", allow: "/", disallow: "" },
  ]);
  const [sitemap, setSitemap] = useState("https://toolmate.co.in/sitemap.xml");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    setRules([...rules, { agent: "", allow: "", disallow: "" }]);
  };

  const updateRule = (idx: number, field: string, val: string) => {
    const newRules = [...rules];
    (newRules[idx] as any)[field] = val;
    setRules(newRules);
  };

  const removeRule = (idx: number) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const generateTxt = () => {
    let out = "";
    rules.forEach((r) => {
      if (r.agent.trim()) {
        out += `User-agent: ${r.agent.trim()}\n`;
        if (r.allow) {
          r.allow.split(",").forEach((a) => {
            if (a.trim()) out += `Allow: ${a.trim()}\n`;
          });
        }
        if (r.disallow) {
          r.disallow.split(",").forEach((d) => {
            if (d.trim()) out += `Disallow: ${d.trim()}\n`;
          });
        }
        out += "\n";
      }
    });

    if (sitemap.trim()) {
      out += `Sitemap: ${sitemap.trim()}\n`;
    }

    return out.trim();
  };

  const output = generateTxt();

  const copyTxt = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("robots.txt copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded robots.txt!");
  };

  return (
    <ToolWorkspace maxWidth="wide">
      <ToolToolbar>
        <span className="text-xs text-[rgb(var(--muted))]">
          Configure search engine crawler access rules, directory exclusions, and XML sitemaps
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={copyTxt}
            className="text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={downloadFile}
            className="text-xs text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))]"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download robots.txt
          </Button>
        </div>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Rules Builder */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-4">
          <div className="space-y-1.5 pb-3 border-b border-[rgb(var(--border))]">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Sitemap URL
            </label>
            <Input
              type="text"
              value={sitemap}
              onChange={(e) => setSitemap(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="text-xs sm:text-sm font-mono h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
                Crawler Directives ({rules.length})
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={addRule}
                className="text-xs h-7 px-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Agent
              </Button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto scrollbar-refined pr-1">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-500">
                      Rule #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRule(idx)}
                      disabled={rules.length <= 1}
                      className="text-[rgb(var(--muted))] hover:text-red-500 disabled:opacity-30 transition-colors"
                      title="Remove Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1">
                        User-agent
                      </label>
                      <Input
                        value={rule.agent}
                        onChange={(e) => updateRule(idx, "agent", e.target.value)}
                        placeholder="* or Googlebot"
                        className="text-xs font-mono h-8 bg-[rgb(var(--card))]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1">
                          Allow
                        </label>
                        <Input
                          value={rule.allow}
                          onChange={(e) => updateRule(idx, "allow", e.target.value)}
                          placeholder="/"
                          className="text-xs font-mono h-8 bg-[rgb(var(--card))]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block mb-1">
                          Disallow
                        </label>
                        <Input
                          value={rule.disallow}
                          onChange={(e) => updateRule(idx, "disallow", e.target.value)}
                          placeholder="/admin/, /api/"
                          className="text-xs font-mono h-8 bg-[rgb(var(--card))]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Editor */}
        <div className="lg:col-span-6 flex flex-col min-w-0 space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Live robots.txt Preview
          </span>
          <CodeEditor
            value={output}
            language="plaintext"
            editable={false}
            minHeight="min-h-[350px] sm:min-h-[460px]"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
