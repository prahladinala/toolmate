"use client";

import React, { useState, useEffect } from "react";
import type { ToolDef } from "../registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import { motion } from "framer-motion";

export function MetaTagGeneratorTool({ tool }: { tool: ToolDef }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [allowRobotsIndex, setAllowRobotsIndex] = useState(true);
  const [allowRobotsFollow, setAllowRobotsFollow] = useState(true);
  const [language, setLanguage] = useState("en");

  // Open Graph
  const [ogType, setOgType] = useState("website");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");

  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let meta = `<!-- Primary Meta Tags -->\n`;
    if (title) meta += `<title>${title}</title>\n`;
    if (title) meta += `<meta name="title" content="${title}">\n`;
    if (description) meta += `<meta name="description" content="${description}">\n`;
    if (keywords) meta += `<meta name="keywords" content="${keywords}">\n`;
    if (author) meta += `<meta name="author" content="${author}">\n`;
    if (themeColor) meta += `<meta name="theme-color" content="${themeColor}">\n`;

    const robotsIndex = allowRobotsIndex ? "index" : "noindex";
    const robotsFollow = allowRobotsFollow ? "follow" : "nofollow";
    meta += `<meta name="robots" content="${robotsIndex}, ${robotsFollow}">\n`;

    if (language) meta += `<meta http-equiv="Content-Language" content="${language}">\n`;

    meta += `\n<!-- Open Graph / Facebook -->\n`;
    meta += `<meta property="og:type" content="${ogType}">\n`;
    if (ogUrl) meta += `<meta property="og:url" content="${ogUrl}">\n`;
    if (title) meta += `<meta property="og:title" content="${title}">\n`;
    if (description) meta += `<meta property="og:description" content="${description}">\n`;
    if (ogImage) meta += `<meta property="og:image" content="${ogImage}">\n`;

    meta += `\n<!-- Twitter -->\n`;
    meta += `<meta property="twitter:card" content="summary_large_image">\n`;
    if (ogUrl) meta += `<meta property="twitter:url" content="${ogUrl}">\n`;
    if (title) meta += `<meta property="twitter:title" content="${title}">\n`;
    if (description) meta += `<meta property="twitter:description" content="${description}">\n`;
    if (ogImage) meta += `<meta property="twitter:image" content="${ogImage}">\n`;

    setOutput(meta.trim());
  }, [title, description, keywords, author, themeColor, allowRobotsIndex, allowRobotsFollow, language, ogType, ogImage, ogUrl]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Meta Tag Generator</h1>
        <p className="text-sm text-[rgb(var(--muted))] max-w-2xl">
          Generate complete HTML <code>&lt;head&gt;</code> meta tags for SEO, Facebook (Open Graph), and Twitter.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Col - Inputs */}
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold border-b border-[rgb(var(--border))] pb-2">Primary Information</h3>
            
            <div>
              <label className="text-sm font-medium">Site Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ToolMate - Developer Utilities"
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Site Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A collection of the best developer tools..."
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Keywords (comma separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="tools, developer, utilities"
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="en"
                  className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
                />
              </div>
            </div>

            <div className="flex gap-6 items-center">
              <div>
                <label className="text-sm font-medium">Theme Color</label>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="ml-3 mt-1 rounded cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={allowRobotsIndex} onChange={(e) => setAllowRobotsIndex(e.target.checked)} />
                  Allow Search Engines to Index
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={allowRobotsFollow} onChange={(e) => setAllowRobotsFollow(e.target.checked)} />
                  Allow Search Engines to Follow Links
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold border-b border-[rgb(var(--border))] pb-2">Open Graph & Social</h3>
            
            <div>
              <label className="text-sm font-medium">OG Type</label>
              <select
                value={ogType}
                onChange={(e) => setOgType(e.target.value)}
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="profile">Profile</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Canonical URL</label>
              <input
                type="text"
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                placeholder="https://toolmate.co.in"
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Social Image URL</label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://toolmate.co.in/og-image.jpg"
                className="mt-1 w-full rounded border p-2 bg-[rgb(var(--card-2))] text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Right Col - Output */}
        <Card className="p-0 flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))]">
            <div className="font-medium">Generated Meta Tags</div>
            <Button size="sm" variant="secondary" onClick={copyToClipboard} disabled={!output}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </motion.span>
            </Button>
          </div>
          <div className="flex-1 relative">
            <CodeEditor
              className="absolute inset-0"
              value={output}
              language="html"
              options={{ readOnly: true }}
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
