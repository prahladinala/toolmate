"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";
import { Input } from "@/components/ui/input";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolToolbar } from "@/components/tools/ToolToolbar";
import { Search, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const MIME_DATA = [
  { ext: ".json", mime: "application/json", desc: "JavaScript Object Notation format" },
  { ext: ".csv", mime: "text/csv", desc: "Comma-separated values spreadsheet" },
  { ext: ".html, .htm", mime: "text/html", desc: "HyperText Markup Language" },
  { ext: ".css", mime: "text/css", desc: "Cascading Style Sheets" },
  { ext: ".js, .mjs", mime: "text/javascript", desc: "JavaScript programming script" },
  { ext: ".ts", mime: "video/mp2t", desc: "MPEG transport stream" },
  { ext: ".png", mime: "image/png", desc: "Portable Network Graphics" },
  { ext: ".jpg, .jpeg", mime: "image/jpeg", desc: "JPEG compressed image" },
  { ext: ".webp", mime: "image/webp", desc: "Modern WebP lossy/lossless image" },
  { ext: ".svg", mime: "image/svg+xml", desc: "Scalable Vector Graphics" },
  { ext: ".gif", mime: "image/gif", desc: "Graphics Interchange Format" },
  { ext: ".ico", mime: "image/vnd.microsoft.icon", desc: "Favicon / Icon format" },
  { ext: ".pdf", mime: "application/pdf", desc: "Adobe Portable Document Format" },
  { ext: ".zip", mime: "application/zip", desc: "ZIP compressed archive" },
  { ext: ".tar", mime: "application/x-tar", desc: "Tape Archive container" },
  { ext: ".gz", mime: "application/gzip", desc: "Gnu Zip archive" },
  { ext: ".mp3", mime: "audio/mpeg", desc: "MPEG Layer-3 Audio" },
  { ext: ".wav", mime: "audio/wav", desc: "Waveform Audio File" },
  { ext: ".mp4", mime: "video/mp4", desc: "MPEG-4 Part 14 Video container" },
  { ext: ".webm", mime: "video/webm", desc: "WebM open video format" },
  { ext: ".xml", mime: "application/xml", desc: "Extensible Markup Language" },
  { ext: ".yaml, .yml", mime: "application/x-yaml", desc: "YAML Ain't Markup Language" },
  { ext: ".woff2", mime: "font/woff2", desc: "Web Open Font Format 2" },
  { ext: ".woff", mime: "font/woff", desc: "Web Open Font Format" },
  { ext: ".ttf", mime: "font/ttf", desc: "TrueType Font" },
  { ext: ".otf", mime: "font/otf", desc: "OpenType Font" },
  { ext: ".txt", mime: "text/plain", desc: "Plain text format" },
  { ext: ".md", mime: "text/markdown", desc: "Markdown documentation file" },
  { ext: ".doc", mime: "application/msword", desc: "Microsoft Word Legacy Doc" },
  { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", desc: "Microsoft Word OpenXML" },
  { ext: ".xls", mime: "application/vnd.ms-excel", desc: "Microsoft Excel Legacy" },
  { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", desc: "Microsoft Excel OpenXML" },
  { ext: ".ppt", mime: "application/vnd.ms-powerpoint", desc: "Microsoft PowerPoint Legacy" },
  { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", desc: "Microsoft PowerPoint OpenXML" },
];

export function MimeTypesTool({ tool }: { tool: ToolDef }) {
  const [search, setSearch] = useState("");
  const [copiedMime, setCopiedMime] = useState<string | null>(null);

  const filtered = MIME_DATA.filter(
    (m) =>
      m.ext.toLowerCase().includes(search.toLowerCase()) ||
      m.mime.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase())
  );

  const copyMime = async (mime: string) => {
    try {
      await navigator.clipboard.writeText(mime);
      setCopiedMime(mime);
      toast.success(`Copied "${mime}"!`);
      setTimeout(() => setCopiedMime(null), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <ToolWorkspace maxWidth="default">
      {/* Search Input Toolbar */}
      <div className="w-full p-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[rgb(var(--muted))] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by file extension, MIME type, or file description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs sm:text-sm h-11 bg-[rgb(var(--card-2))]"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--card-2))] flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-[rgb(var(--muted))]">
            Matching Content Types ({filtered.length})
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-refined">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-[rgb(var(--border))] text-xs font-semibold text-[rgb(var(--muted))] uppercase tracking-wider">
                <th className="p-3.5 sm:p-4">Extension</th>
                <th className="p-3.5 sm:p-4">MIME Content-Type</th>
                <th className="p-3.5 sm:p-4">Description</th>
                <th className="p-3.5 sm:p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--border))] text-xs sm:text-sm">
              {filtered.map((item) => (
                <tr
                  key={item.mime}
                  className="hover:bg-[rgb(var(--card-2))]/50 transition-colors"
                >
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-indigo-500 whitespace-nowrap">
                    {item.ext}
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono text-[rgb(var(--fg))] whitespace-nowrap">
                    {item.mime}
                  </td>
                  <td className="p-3.5 sm:p-4 text-[rgb(var(--muted))]">
                    {item.desc}
                  </td>
                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => copyMime(item.mime)}
                      className="p-1.5 rounded-lg text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--card-2))] transition-colors"
                      title={`Copy ${item.mime}`}
                    >
                      {copiedMime === item.mime ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 inline-block" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 inline-block" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-[rgb(var(--muted))]">
                    No MIME types found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ToolWorkspace>
  );
}
