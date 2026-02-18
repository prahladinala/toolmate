"use client";
import React from "react";
import { TOOLS } from "@/features/tools/registry";
import type { ToolDef } from "./registry";
import { ToolNotImplemented } from "./ToolNotImplemented";
import { JsonFormatterTool } from "./tools/json-formatter";
// import { Base64Tool } from "./tools/base64";
// import { UrlEncodeTool } from "./tools/url-encode";
// import { UuidTool } from "./tools/uuid";
// import { PasswordTool } from "./tools/password";
import DeviceDetailsTool from "./tools/device-details";
import PlaceholderGenerator from "./tools/placeholder-generator";
import RegexTesterTool from "./tools/regex-tester";
import TimestampConverterTool from "./tools/timestamp-converter";
import Base64Tool from "./tools/base64-encoder-decoder";
import UuidGeneratorTool from "./tools/uuid-generator";
import UrlEncoderDecoderTool from "./tools/url-encoder-decoder";
import PasswordGeneratorTool from "./tools/password-generator";
import TextDiffTool from "./tools/text-diff";
import QrCodeGeneratorTool from "./tools/qr-code-generator";
import DnsLookupTool from "./tools/dns-lookup";

import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/motion/motion";
import JwtDecoderTool from "./tools/jwt-decoder";
import Link from "next/link";

const MAP: Record<string, React.ComponentType<{ tool: ToolDef }>> = {
  "json-formatter": JsonFormatterTool,
  //   "url-encode": UrlEncodeTool,
  //   password: PasswordTool,
  "device-details": DeviceDetailsTool,
  "jwt-decoder": JwtDecoderTool,
  "placeholder-generator": PlaceholderGenerator,
  "regex-tester": RegexTesterTool,
  "timestamp-converter": TimestampConverterTool,
  "base64-encoder-decoder": Base64Tool,
  "uuid-generator": UuidGeneratorTool,
  "url-encoder-decoder": UrlEncoderDecoderTool,
  "password-generator": PasswordGeneratorTool,
  "text-diff": TextDiffTool,
  "qr-code-generator": QrCodeGeneratorTool,
  "dns-lookup": DnsLookupTool,
};

// Helper: pick suggestions by category first, then fallback to others.
// Also optionally prioritize tools that are implemented (exist in MAP).
function getSuggestions(current: ToolDef, limit = 6): ToolDef[] {
  const isImplemented = (t: ToolDef) => Boolean(MAP[t.slug]);

  const pool = TOOLS.filter((t) => t.slug !== current.slug);

  const sameCategory = pool
    .filter((t) => t.category === current.category)
    .sort((a, b) => Number(isImplemented(b)) - Number(isImplemented(a)));

  const otherCategories = pool
    .filter((t) => t.category !== current.category)
    .sort((a, b) => Number(isImplemented(b)) - Number(isImplemented(a)));

  const combined = [...sameCategory, ...otherCategories];

  // Dedup just in case + limit
  const out: ToolDef[] = [];
  const seen = new Set<string>();
  for (const t of combined) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
    if (out.length >= limit) break;
  }
  return out;
}

export function ToolRenderer({ tool }: { tool: ToolDef }) {
  const Comp = MAP[tool.slug];

  if (!Comp) {
    return (
      <ToolNotImplemented tool={tool} suggestions={getSuggestions(tool, 6)} />
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-4 text-s text-[rgb(var(--muted))]">
        <Link
          href="/tools"
          className="
    hover:text-[rgb(var(--accent))]
    hover:underline
    transition
  "
        >
          Tools
        </Link>{" "}
        / <span className="text-[rgb(var(--fg))]">{tool.name}</span>
      </div>

      {/* TOOL HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-[var(--radius-lg)] border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-[var(--shadow-md)]"
      >
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, rgba(var(--accent),0.15), transparent 70%)",
          }}
        />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[rgb(var(--muted))]">
              {tool.seo.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>{tool.category}</Badge>

            {/* Future-proof actions */}
            <button
              className="
                rounded-[var(--radius)]
                border border-[rgb(var(--border))]
                bg-[rgb(var(--card-2))]
                px-3 py-1 text-xs
                hover:border-[rgba(var(--accent),0.55)]
                hover:bg-[rgba(var(--accent),0.08)]
                transition
              "
            >
              Share
            </button>
          </div>
        </div>
      </motion.div>

      {/* TOOL BODY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Comp tool={tool} />
      </motion.div>
    </main>
  );
}
