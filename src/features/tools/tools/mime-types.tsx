"use client";

import React, { useState } from "react";
import type { ToolDef } from "../registry";

const MIME_DATA = [
  { ext: ".aac", mime: "audio/aac", desc: "AAC audio" },
  { ext: ".abw", mime: "application/x-abiword", desc: "AbiWord document" },
  { ext: ".arc", mime: "application/x-freearc", desc: "Archive document (multiple files embedded)" },
  { ext: ".avi", mime: "video/x-msvideo", desc: "AVI: Audio Video Interleave" },
  { ext: ".azw", mime: "application/vnd.amazon.ebook", desc: "Amazon Kindle eBook format" },
  { ext: ".bin", mime: "application/octet-stream", desc: "Any kind of binary data" },
  { ext: ".bmp", mime: "image/bmp", desc: "Windows OS/2 Bitmap Graphics" },
  { ext: ".bz", mime: "application/x-bzip", desc: "BZip archive" },
  { ext: ".bz2", mime: "application/x-bzip2", desc: "BZip2 archive" },
  { ext: ".csv", mime: "text/csv", desc: "Comma-separated values (CSV)" },
  { ext: ".doc", mime: "application/msword", desc: "Microsoft Word" },
  { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", desc: "Microsoft Word (OpenXML)" },
  { ext: ".eot", mime: "application/vnd.ms-fontobject", desc: "MS Embedded OpenType fonts" },
  { ext: ".epub", mime: "application/epub+zip", desc: "Electronic publication (EPUB)" },
  { ext: ".gz", mime: "application/gzip", desc: "GZip Compressed Archive" },
  { ext: ".gif", mime: "image/gif", desc: "Graphics Interchange Format (GIF)" },
  { ext: ".htm, .html", mime: "text/html", desc: "HyperText Markup Language (HTML)" },
  { ext: ".ico", mime: "image/vnd.microsoft.icon", desc: "Icon format" },
  { ext: ".ics", mime: "text/calendar", desc: "iCalendar format" },
  { ext: ".jar", mime: "application/java-archive", desc: "Java Archive (JAR)" },
  { ext: ".jpeg, .jpg", mime: "image/jpeg", desc: "JPEG images" },
  { ext: ".js", mime: "text/javascript", desc: "JavaScript" },
  { ext: ".json", mime: "application/json", desc: "JSON format" },
  { ext: ".jsonld", mime: "application/ld+json", desc: "JSON-LD format" },
  { ext: ".mid, .midi", mime: "audio/midi", desc: "Musical Instrument Digital Interface (MIDI)" },
  { ext: ".mjs", mime: "text/javascript", desc: "JavaScript module" },
  { ext: ".mp3", mime: "audio/mpeg", desc: "MP3 audio" },
  { ext: ".mpeg", mime: "video/mpeg", desc: "MPEG Video" },
  { ext: ".mpkg", mime: "application/vnd.apple.installer+xml", desc: "Apple Installer Package" },
  { ext: ".odp", mime: "application/vnd.oasis.opendocument.presentation", desc: "OpenDocument presentation document" },
  { ext: ".ods", mime: "application/vnd.oasis.opendocument.spreadsheet", desc: "OpenDocument spreadsheet document" },
  { ext: ".odt", mime: "application/vnd.oasis.opendocument.text", desc: "OpenDocument text document" },
  { ext: ".oga", mime: "audio/ogg", desc: "OGG audio" },
  { ext: ".ogv", mime: "video/ogg", desc: "OGG video" },
  { ext: ".ogx", mime: "application/ogg", desc: "OGG" },
  { ext: ".opus", mime: "audio/opus", desc: "Opus audio" },
  { ext: ".otf", mime: "font/otf", desc: "OpenType font" },
  { ext: ".png", mime: "image/png", desc: "Portable Network Graphics" },
  { ext: ".pdf", mime: "application/pdf", desc: "Adobe Portable Document Format (PDF)" },
  { ext: ".php", mime: "application/x-httpd-php", desc: "Hypertext Preprocessor (Personal Home Page)" },
  { ext: ".ppt", mime: "application/vnd.ms-powerpoint", desc: "Microsoft PowerPoint" },
  { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", desc: "Microsoft PowerPoint (OpenXML)" },
  { ext: ".rar", mime: "application/vnd.rar", desc: "RAR archive" },
  { ext: ".rtf", mime: "application/rtf", desc: "Rich Text Format (RTF)" },
  { ext: ".sh", mime: "application/x-sh", desc: "Bourne shell script" },
  { ext: ".svg", mime: "image/svg+xml", desc: "Scalable Vector Graphics (SVG)" },
  { ext: ".swf", mime: "application/x-shockwave-flash", desc: "Small web format (SWF) or Adobe Flash document" },
  { ext: ".tar", mime: "application/x-tar", desc: "Tape Archive (TAR)" },
  { ext: ".tif, .tiff", mime: "image/tiff", desc: "Tagged Image File Format (TIFF)" },
  { ext: ".ts", mime: "video/mp2t", desc: "MPEG transport stream" },
  { ext: ".ttf", mime: "font/ttf", desc: "TrueType Font" },
  { ext: ".txt", mime: "text/plain", desc: "Text, (generally ASCII or ISO 8859-n)" },
  { ext: ".vsd", mime: "application/vnd.visio", desc: "Microsoft Visio" },
  { ext: ".wav", mime: "audio/wav", desc: "Waveform Audio Format" },
  { ext: ".weba", mime: "audio/webm", desc: "WEBM audio" },
  { ext: ".webm", mime: "video/webm", desc: "WEBM video" },
  { ext: ".webp", mime: "image/webp", desc: "WEBP image" },
  { ext: ".woff", mime: "font/woff", desc: "Web Open Font Format (WOFF)" },
  { ext: ".woff2", mime: "font/woff2", desc: "Web Open Font Format (WOFF) - 2" },
  { ext: ".xhtml", mime: "application/xhtml+xml", desc: "XHTML" },
  { ext: ".xls", mime: "application/vnd.ms-excel", desc: "Microsoft Excel" },
  { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", desc: "Microsoft Excel (OpenXML)" },
  { ext: ".xml", mime: "application/xml", desc: "XML" },
  { ext: ".xul", mime: "application/vnd.mozilla.xul+xml", desc: "XUL" },
  { ext: ".zip", mime: "application/zip", desc: "ZIP archive" },
  { ext: ".3gp", mime: "video/3gpp", desc: "3GPP audio/video container" },
  { ext: ".3g2", mime: "video/3gpp2", desc: "3GPP2 audio/video container" },
  { ext: ".7z", mime: "application/x-7z-compressed", desc: "7-zip archive" }
];

export function MimeTypesTool({ tool }: { tool: ToolDef }) {
  const [search, setSearch] = useState("");

  const filtered = MIME_DATA.filter((m) =>
    m.ext.toLowerCase().includes(search.toLowerCase()) ||
    m.mime.toLowerCase().includes(search.toLowerCase()) ||
    m.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search extensions, MIME types, or descriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-[var(--radius)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 text-lg outline-none focus:border-blue-500 shadow-[var(--shadow-sm)]"
        />
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgb(var(--card-2))] border-b border-[rgb(var(--border))]">
                <th className="p-4 font-medium whitespace-nowrap">Extension</th>
                <th className="p-4 font-medium whitespace-nowrap">MIME Type</th>
                <th className="p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={idx} className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgba(var(--accent),0.02)] transition">
                  <td className="p-4 font-mono font-medium text-blue-500 whitespace-nowrap">{item.ext}</td>
                  <td className="p-4 font-mono text-sm whitespace-nowrap">{item.mime}</td>
                  <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-neutral-500">
                    No matching MIME types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
