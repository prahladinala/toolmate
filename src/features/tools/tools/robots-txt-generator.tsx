"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";

export function RobotsTxtGeneratorTool({ tool }: { tool: ToolDef }) {
  const [rules, setRules] = useState([{ agent: "*", allow: "", disallow: "/cgi-bin/, /admin/" }]);
  const [sitemap, setSitemap] = useState("");

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
    rules.forEach(r => {
      if (r.agent) out += `User-agent: ${r.agent}\n`;
      if (r.allow) {
        r.allow.split(",").forEach(a => {
          if (a.trim()) out += `Allow: ${a.trim()}\n`;
        });
      }
      if (r.disallow) {
        r.disallow.split(",").forEach(d => {
          if (d.trim()) out += `Disallow: ${d.trim()}\n`;
        });
      }
      out += "\n";
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
      alert("robots.txt copied to clipboard!");
    } catch (e) {}
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">robots.txt Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Instantly generate a robots.txt file to tell search engine crawlers which URLs they can access.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {rules.map((rule, i) => (
            <div key={i} className="p-4 rounded border border-[rgb(var(--border))] bg-[rgb(var(--card-2))] relative">
              <button 
                onClick={() => removeRule(i)}
                className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1">User-Agent</label>
                  <input type="text" value={rule.agent} onChange={(e) => updateRule(i, "agent", e.target.value)} className="w-full rounded border p-1.5 text-sm" placeholder="e.g. *, Googlebot, Bingbot" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Allow (comma separated paths)</label>
                  <input type="text" value={rule.allow} onChange={(e) => updateRule(i, "allow", e.target.value)} className="w-full rounded border p-1.5 text-sm" placeholder="e.g. /public/, /images/" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Disallow (comma separated paths)</label>
                  <input type="text" value={rule.disallow} onChange={(e) => updateRule(i, "disallow", e.target.value)} className="w-full rounded border p-1.5 text-sm" placeholder="e.g. /admin/, /private/" />
                </div>
              </div>
            </div>
          ))}

          <Button variant="secondary" onClick={addRule} className="w-full">+ Add Another Rule</Button>

          <div className="pt-4 border-t border-[rgb(var(--border))]">
             <label className="text-sm font-medium block mb-1">Sitemap URL (Optional)</label>
             <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="w-full rounded border p-2 text-sm bg-[rgb(var(--card-2))]" placeholder="https://example.com/sitemap.xml" />
          </div>

          <Button onClick={copyTxt} className="w-full">Copy robots.txt</Button>
        </Card>

        <Card className="p-0 flex flex-col h-full min-h-[400px] overflow-hidden">
          <div className="p-3 border-b border-[rgb(var(--border))] font-medium text-sm flex justify-between items-center bg-[rgb(var(--card-2))]">
             <span>Generated Output</span>
          </div>
          <div className="flex-1 relative">
             <CodeEditor value={output} language="plaintext" options={{ readOnly: true }} className="absolute inset-0" />
          </div>
        </Card>
      </div>
    </main>
  );
}
