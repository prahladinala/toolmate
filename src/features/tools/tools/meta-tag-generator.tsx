"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { CodeEditor } from "@/components/ui/code-editor";
import { Copy, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function MetaTagGeneratorTool({ tool }: { tool: ToolDef }) {
  const [title, setTitle] = useState("ToolMate — Online Developer & Designer Utilities");
  const [description, setDescription] = useState("Free, client-side, responsive developer tools, converters, formatters, and generators.");
  const [keywords, setKeywords] = useState("developer tools, json formatter, css generators, privacy utilities");
  const [author, setAuthor] = useState("ToolMate");
  const [themeColor, setThemeColor] = useState("#0f172a");
  const [ogUrl, setOgUrl] = useState("https://toolmate.co.in");
  const [ogImage, setOgImage] = useState("https://toolmate.co.in/og-image.png");
  const [copied, setCopied] = useState(false);

  const generateMeta = () => {
    let meta = `<!-- Primary Meta Tags -->\n`;
    if (title) meta += `<title>${title}</title>\n`;
    if (title) meta += `<meta name="title" content="${title}">\n`;
    if (description) meta += `<meta name="description" content="${description}">\n`;
    if (keywords) meta += `<meta name="keywords" content="${keywords}">\n`;
    if (author) meta += `<meta name="author" content="${author}">\n`;
    if (themeColor) meta += `<meta name="theme-color" content="${themeColor}">\n`;
    meta += `<meta name="robots" content="index, follow">\n`;

    meta += `\n<!-- Open Graph / Facebook -->\n`;
    meta += `<meta property="og:type" content="website">\n`;
    if (ogUrl) meta += `<meta property="og:url" content="${ogUrl}">\n`;
    if (title) meta += `<meta property="og:title" content="${title}">\n`;
    if (description) meta += `<meta property="og:description" content="${description}">\n`;
    if (ogImage) meta += `<meta property="og:image" content="${ogImage}">\n`;

    meta += `\n<!-- Twitter / X -->\n`;
    meta += `<meta property="twitter:card" content="summary_large_image">\n`;
    if (ogUrl) meta += `<meta property="twitter:url" content="${ogUrl}">\n`;
    if (title) meta += `<meta property="twitter:title" content="${title}">\n`;
    if (description) meta += `<meta property="twitter:description" content="${description}">\n`;
    if (ogImage) meta += `<meta property="twitter:image" content="${ogImage}">\n`;

    return meta.trim();
  };

  const output = generateMeta();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Meta tags copied to clipboard!");
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
          Construct production-ready SEO meta tags, OpenGraph previews, and Twitter/X summary card markup
        </span>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={copyToClipboard}
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
              Copy HTML Tags
            </>
          )}
        </Button>
      </ToolToolbar>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
        {/* Form Inputs */}
        <div className="lg:col-span-6 p-5 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Page Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs sm:text-sm h-9 bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
              Meta Description
            </label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs sm:text-sm bg-[rgb(var(--card-2))]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Canonical URL
              </label>
              <Input
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                OpenGraph Image URL
              </label>
              <Input
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="text-xs font-mono h-9 bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Author
              </label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Theme Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer p-0 border border-[rgb(var(--border))] bg-transparent shrink-0"
                />
                <span className="text-xs font-mono">{themeColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider block">
                Keywords
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="text-xs h-9 bg-[rgb(var(--card-2))]"
              />
            </div>
          </div>
        </div>

        {/* Output Code */}
        <div className="lg:col-span-6 flex flex-col min-w-0 space-y-2">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Generated HTML Meta Tags
          </span>
          <CodeEditor
            value={output}
            language="html"
            editable={false}
            minHeight="min-h-[350px] sm:min-h-[460px]"
            options={{ wordWrap: "on" }}
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
