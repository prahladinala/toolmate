"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { TOOLS } from "@/features/tools/registry";
import type { ToolDef } from "./registry";
import { ToolNotImplemented } from "./ToolNotImplemented";
import { ShareModal } from "./ShareModal";
const JsonFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-formatter').then(m => m.JsonFormatterTool), { ssr: false });
// const Base64Tool = dynamic<{ tool: ToolDef }>(() => import('./tools/base64').then(m => m.Base64Tool), { ssr: false });
// const UrlEncodeTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-encode').then(m => m.UrlEncodeTool), { ssr: false });
// const UuidTool = dynamic<{ tool: ToolDef }>(() => import('./tools/uuid').then(m => m.UuidTool), { ssr: false });
// const PasswordTool = dynamic<{ tool: ToolDef }>(() => import('./tools/password').then(m => m.PasswordTool), { ssr: false });
const DeviceDetailsTool = dynamic<{ tool: ToolDef }>(() => import('./tools/device-details'), { ssr: false });
const PlaceholderGenerator = dynamic<{ tool: ToolDef }>(() => import('./tools/placeholder-generator'), { ssr: false });
const RegexTesterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/regex-tester'), { ssr: false });
const TimestampConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/timestamp-converter'), { ssr: false });
const Base64Tool = dynamic<{ tool: ToolDef }>(() => import('./tools/base64-encoder-decoder'), { ssr: false });
const UuidGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/uuid-generator'), { ssr: false });
const UrlEncoderDecoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-encoder-decoder'), { ssr: false });
const PasswordGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/password-generator'), { ssr: false });
const TextDiffTool = dynamic<{ tool: ToolDef }>(() => import('./tools/text-diff'), { ssr: false });
const QrCodeGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/qr-code-generator'), { ssr: false });
const DnsLookupTool = dynamic<{ tool: ToolDef }>(() => import('./tools/dns-lookup'), { ssr: false });
const AccessibilityRefactorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/accessibility-refactor'), { ssr: false });
const HtmlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/html-formatter').then(m => m.HtmlFormatterTool), { ssr: false });
const CssFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-formatter').then(m => m.CssFormatterTool), { ssr: false });
const JsFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/js-formatter').then(m => m.JsFormatterTool), { ssr: false });
const SqlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/sql-formatter').then(m => m.SqlFormatterTool), { ssr: false });
const XmlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/xml-formatter').then(m => m.XmlFormatterTool), { ssr: false });
const JsonToCsvTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-csv').then(m => m.JsonToCsvTool), { ssr: false });
const CsvToJsonTool = dynamic<{ tool: ToolDef }>(() => import('./tools/csv-to-json').then(m => m.CsvToJsonTool), { ssr: false });
const JsonToYamlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-yaml').then(m => m.JsonToYamlTool), { ssr: false });
const YamlToJsonTool = dynamic<{ tool: ToolDef }>(() => import('./tools/yaml-to-json').then(m => m.YamlToJsonTool), { ssr: false });
const JsonToTsTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-ts').then(m => m.JsonToTsTool), { ssr: false });
const HashGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/hash-generator').then(m => m.HashGeneratorTool), { ssr: false });
const RsaKeyGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/rsa-key-generator').then(m => m.RsaKeyGeneratorTool), { ssr: false });
const LoremIpsumGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/lorem-ipsum-generator').then(m => m.LoremIpsumGeneratorTool), { ssr: false });
const CronParserTool = dynamic<{ tool: ToolDef }>(() => import('./tools/cron-parser').then(m => m.CronParserTool), { ssr: false });
const BaseConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/base-converter').then(m => m.BaseConverterTool), { ssr: false });
const HtmlEntityEncoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/html-entity-encoder').then(m => m.HtmlEntityEncoderTool), { ssr: false });
const ColorConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/color-converter').then(m => m.ColorConverterTool), { ssr: false });
const TextCaseConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/text-case-converter').then(m => m.TextCaseConverterTool), { ssr: false });
const WordCounterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/word-counter').then(m => m.WordCounterTool), { ssr: false });
const UrlParserTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-parser').then(m => m.UrlParserTool), { ssr: false });
const ChmodCalculatorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/chmod-calculator').then(m => m.ChmodCalculatorTool), { ssr: false });
const MimeTypesTool = dynamic<{ tool: ToolDef }>(() => import('./tools/mime-types').then(m => m.MimeTypesTool), { ssr: false });
const KeyCodeInfoTool = dynamic<{ tool: ToolDef }>(() => import('./tools/key-code-info').then(m => m.KeyCodeInfoTool), { ssr: false });
const CssGradientGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-gradient-generator').then(m => m.CssGradientGeneratorTool), { ssr: false });
const CssBoxShadowTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-box-shadow').then(m => m.CssBoxShadowTool), { ssr: false });
const SvgToJsxTool = dynamic<{ tool: ToolDef }>(() => import('./tools/svg-to-jsx').then(m => m.SvgToJsxTool), { ssr: false });
const MarkdownEditorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/markdown-editor').then(m => m.MarkdownEditorTool), { ssr: false });
const StopwatchTimerTool = dynamic<{ tool: ToolDef }>(() => import('./tools/stopwatch-timer').then(m => m.StopwatchTimerTool), { ssr: false });
const YamlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/yaml-formatter').then(m => m.YamlFormatterTool), { ssr: false });
const BcryptGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/bcrypt-generator').then(m => m.BcryptGeneratorTool), { ssr: false });
const CsvToSqlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/csv-to-sql').then(m => m.CsvToSqlTool), { ssr: false });
const JsonToGraphqlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-graphql').then(m => m.JsonToGraphqlTool), { ssr: false });
const MathEvaluatorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/math-evaluator').then(m => m.MathEvaluatorTool), { ssr: false });
const JsonStringifierTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-stringifier').then(m => m.JsonStringifierTool), { ssr: false });
const DockerToComposeTool = dynamic<{ tool: ToolDef }>(() => import('./tools/docker-to-compose').then(m => m.DockerToComposeTool), { ssr: false });
const SqlToPrismaTool = dynamic<{ tool: ToolDef }>(() => import('./tools/sql-to-prisma').then(m => m.SqlToPrismaTool), { ssr: false });
const GitCommandBuilderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/git-command-builder').then(m => m.GitCommandBuilderTool), { ssr: false });
const CssLayoutGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-layout-generator').then(m => m.CssLayoutGeneratorTool), { ssr: false });
const AppIconGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/app-icon-generator').then(m => m.AppIconGeneratorTool), { ssr: false });
const GitignoreGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/gitignore-generator').then(m => m.GitignoreGeneratorTool), { ssr: false });
const MetaTagGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/meta-tag-generator').then(m => m.MetaTagGeneratorTool), { ssr: false });
const MarkdownToHtmlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/markdown-to-html').then(m => m.MarkdownToHtmlTool), { ssr: false });

import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/motion/motion";
const JwtDecoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/jwt-decoder'), { ssr: false });
import Link from "next/link";
const BlobGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/blob-generator').then(m => m.BlobGeneratorTool), { ssr: false });
const SvgBackgroundGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/svg-background-generator').then(m => m.SvgBackgroundGeneratorTool), { ssr: false });
const TermsGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/terms-generator').then(m => m.TermsGeneratorTool), { ssr: false });
const PrivacyPolicyGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/privacy-policy-generator').then(m => m.PrivacyPolicyGeneratorTool), { ssr: false });
const AvatarGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/avatar-generator').then(m => m.AvatarGeneratorTool), { ssr: false });
const WhiteboardAppTool = dynamic<{ tool: ToolDef }>(() => import('./tools/whiteboard-app'), { ssr: false });
const MemeGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/meme-generator').then(m => m.MemeGeneratorTool), { ssr: false });
const NeumorphismGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/neumorphism-generator').then(m => m.NeumorphismGeneratorTool), { ssr: false });
const GlassmorphismGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/glassmorphism-generator').then(m => m.GlassmorphismGeneratorTool), { ssr: false });
const ImageResizerTool = dynamic<{ tool: ToolDef }>(() => import('./tools/image-resizer').then(m => m.ImageResizerTool), { ssr: false });
const RobotsTxtGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/robots-txt-generator').then(m => m.RobotsTxtGeneratorTool), { ssr: false });
const CssAnimationGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-animation-generator').then(m => m.CssAnimationGeneratorTool), { ssr: false });
const TailwindTextGradientTool = dynamic<{ tool: ToolDef }>(() => import('./tools/tailwind-text-gradient').then(m => m.TailwindTextGradientTool), { ssr: false });
const CssCursorGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-cursor-generator').then(m => m.CssCursorGeneratorTool), { ssr: false });
const CssTransformGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-transform-generator').then(m => m.CssTransformGeneratorTool), { ssr: false });
const CssFilterGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-filter-generator').then(m => m.CssFilterGeneratorTool), { ssr: false });


const MAP: Record<string, React.ComponentType<{ tool: ToolDef }>> = {
  "blob-generator": BlobGeneratorTool,
  "svg-background-generator": SvgBackgroundGeneratorTool,
  "terms-generator": TermsGeneratorTool,
  "privacy-policy-generator": PrivacyPolicyGeneratorTool,
  "avatar-generator": AvatarGeneratorTool,
  "whiteboard-app": WhiteboardAppTool,
  "meme-generator": MemeGeneratorTool,
  "neumorphism-generator": NeumorphismGeneratorTool,
  "glassmorphism-generator": GlassmorphismGeneratorTool,
  "image-resizer": ImageResizerTool,
  "robots-txt-generator": RobotsTxtGeneratorTool,
  "css-animation-generator": CssAnimationGeneratorTool,
  "tailwind-text-gradient": TailwindTextGradientTool,
  "css-cursor-generator": CssCursorGeneratorTool,
  "css-transform-generator": CssTransformGeneratorTool,
  "css-filter-generator": CssFilterGeneratorTool,

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
  "accessibility-refactor": AccessibilityRefactorTool,
  "html-formatter": HtmlFormatterTool,
  "css-formatter": CssFormatterTool,
  "js-formatter": JsFormatterTool,
  "sql-formatter": SqlFormatterTool,
  "xml-formatter": XmlFormatterTool,
  "json-to-csv": JsonToCsvTool,
  "csv-to-json": CsvToJsonTool,
  "json-to-yaml": JsonToYamlTool,
  "yaml-to-json": YamlToJsonTool,
  "json-to-ts": JsonToTsTool,
  "hash-generator": HashGeneratorTool,
  "rsa-key-generator": RsaKeyGeneratorTool,
  "lorem-ipsum-generator": LoremIpsumGeneratorTool,
  "cron-parser": CronParserTool,
  "base-converter": BaseConverterTool,
  "html-entity-encoder": HtmlEntityEncoderTool,
  "color-converter": ColorConverterTool,
  "text-case-converter": TextCaseConverterTool,
  "word-counter": WordCounterTool,
  "url-parser": UrlParserTool,
  "chmod-calculator": ChmodCalculatorTool,
  "mime-types": MimeTypesTool,
  "key-code-info": KeyCodeInfoTool,
  "css-gradient-generator": CssGradientGeneratorTool,
  "css-box-shadow": CssBoxShadowTool,
  "svg-to-jsx": SvgToJsxTool,
  "markdown-editor": MarkdownEditorTool,
  "stopwatch-timer": StopwatchTimerTool,
  "yaml-formatter": YamlFormatterTool,
  "bcrypt-generator": BcryptGeneratorTool,
  "csv-to-sql": CsvToSqlTool,
  "json-to-graphql": JsonToGraphqlTool,
  "math-evaluator": MathEvaluatorTool,
  "json-stringifier": JsonStringifierTool,
  "docker-to-compose": DockerToComposeTool,
  "sql-to-prisma": SqlToPrismaTool,
  "git-command-builder": GitCommandBuilderTool,
  "css-layout-generator": CssLayoutGeneratorTool,
  "app-icon-generator": AppIconGeneratorTool,
  "gitignore-generator": GitignoreGeneratorTool,
  "meta-tag-generator": MetaTagGeneratorTool,
  "markdown-to-html": MarkdownToHtmlTool,
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const Comp = MAP[tool.slug];

  if (!Comp) {
    return (
      <ToolNotImplemented tool={tool} suggestions={getSuggestions(tool, 6)} />
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-s text-[rgb(var(--muted))]">
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
        / <span aria-current="page" className="text-[rgb(var(--fg))]">{tool.name}</span>
      </nav>

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
              onClick={() => setIsShareModalOpen(true)}
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

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        toolName={tool.name} 
        toolSlug={tool.slug} 
        shortDescription={tool.shortDescription} 
      />
    </main>
  );
}
