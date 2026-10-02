"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { TOOLS } from "@/features/tools/registry";
import type { ToolDef } from "./registry";
import { ToolNotImplemented } from "./ToolNotImplemented";
import { ShareModal } from "./ShareModal";
const JsonFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-formatter').then(m => m.JsonFormatterTool));
// const Base64Tool = dynamic<{ tool: ToolDef }>(() => import('./tools/base64').then(m => m.Base64Tool));
// const UrlEncodeTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-encode').then(m => m.UrlEncodeTool));
// const UuidTool = dynamic<{ tool: ToolDef }>(() => import('./tools/uuid').then(m => m.UuidTool));
// const PasswordTool = dynamic<{ tool: ToolDef }>(() => import('./tools/password').then(m => m.PasswordTool));
const DeviceDetailsTool = dynamic<{ tool: ToolDef }>(() => import('./tools/device-details'));
const PlaceholderGenerator = dynamic<{ tool: ToolDef }>(() => import('./tools/placeholder-generator'));
const RegexTesterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/regex-tester'));
const TimestampConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/timestamp-converter'));
const Base64Tool = dynamic<{ tool: ToolDef }>(() => import('./tools/base64-encoder-decoder'));
const UuidGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/uuid-generator'));
const UrlEncoderDecoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-encoder-decoder'));
const PasswordGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/password-generator'));
const TextDiffTool = dynamic<{ tool: ToolDef }>(() => import('./tools/text-diff'));
const QrCodeGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/qr-code-generator'));
const DnsLookupTool = dynamic<{ tool: ToolDef }>(() => import('./tools/dns-lookup'));
const AccessibilityRefactorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/accessibility-refactor'));
const HtmlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/html-formatter').then(m => m.HtmlFormatterTool));
const CssFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-formatter').then(m => m.CssFormatterTool));
const JsFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/js-formatter').then(m => m.JsFormatterTool));
const SqlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/sql-formatter').then(m => m.SqlFormatterTool));
const XmlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/xml-formatter').then(m => m.XmlFormatterTool));
const JsonToCsvTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-csv').then(m => m.JsonToCsvTool));
const CsvToJsonTool = dynamic<{ tool: ToolDef }>(() => import('./tools/csv-to-json').then(m => m.CsvToJsonTool));
const JsonToYamlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-yaml').then(m => m.JsonToYamlTool));
const YamlToJsonTool = dynamic<{ tool: ToolDef }>(() => import('./tools/yaml-to-json').then(m => m.YamlToJsonTool));
const JsonToTsTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-ts').then(m => m.JsonToTsTool));
const HashGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/hash-generator').then(m => m.HashGeneratorTool));
const RsaKeyGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/rsa-key-generator').then(m => m.RsaKeyGeneratorTool));
const LoremIpsumGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/lorem-ipsum-generator').then(m => m.LoremIpsumGeneratorTool));
const CronParserTool = dynamic<{ tool: ToolDef }>(() => import('./tools/cron-parser').then(m => m.CronParserTool));
const BaseConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/base-converter').then(m => m.BaseConverterTool));
const HtmlEntityEncoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/html-entity-encoder').then(m => m.HtmlEntityEncoderTool));
const ColorConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/color-converter').then(m => m.ColorConverterTool));
const TextCaseConverterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/text-case-converter').then(m => m.TextCaseConverterTool));
const WordCounterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/word-counter').then(m => m.WordCounterTool));
const UrlParserTool = dynamic<{ tool: ToolDef }>(() => import('./tools/url-parser').then(m => m.UrlParserTool));
const ChmodCalculatorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/chmod-calculator').then(m => m.ChmodCalculatorTool));
const MimeTypesTool = dynamic<{ tool: ToolDef }>(() => import('./tools/mime-types').then(m => m.MimeTypesTool));
const KeyCodeInfoTool = dynamic<{ tool: ToolDef }>(() => import('./tools/key-code-info').then(m => m.KeyCodeInfoTool));
const CssGradientGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-gradient-generator').then(m => m.CssGradientGeneratorTool));
const CssBoxShadowTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-box-shadow').then(m => m.CssBoxShadowTool));
const SvgToJsxTool = dynamic<{ tool: ToolDef }>(() => import('./tools/svg-to-jsx').then(m => m.SvgToJsxTool));
const MarkdownEditorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/markdown-editor').then(m => m.MarkdownEditorTool));
const StopwatchTimerTool = dynamic<{ tool: ToolDef }>(() => import('./tools/stopwatch-timer').then(m => m.StopwatchTimerTool));
const YamlFormatterTool = dynamic<{ tool: ToolDef }>(() => import('./tools/yaml-formatter').then(m => m.YamlFormatterTool));
const BcryptGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/bcrypt-generator').then(m => m.BcryptGeneratorTool));
const CsvToSqlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/csv-to-sql').then(m => m.CsvToSqlTool));
const JsonToGraphqlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-to-graphql').then(m => m.JsonToGraphqlTool));
const MathEvaluatorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/math-evaluator').then(m => m.MathEvaluatorTool));
const JsonStringifierTool = dynamic<{ tool: ToolDef }>(() => import('./tools/json-stringifier').then(m => m.JsonStringifierTool));
const DockerToComposeTool = dynamic<{ tool: ToolDef }>(() => import('./tools/docker-to-compose').then(m => m.DockerToComposeTool));
const SqlToPrismaTool = dynamic<{ tool: ToolDef }>(() => import('./tools/sql-to-prisma').then(m => m.SqlToPrismaTool));
const GitCommandBuilderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/git-command-builder').then(m => m.GitCommandBuilderTool));
const CssLayoutGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-layout-generator').then(m => m.CssLayoutGeneratorTool));
const AppIconGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/app-icon-generator').then(m => m.AppIconGeneratorTool));
const GitignoreGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/gitignore-generator').then(m => m.GitignoreGeneratorTool));
const MetaTagGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/meta-tag-generator').then(m => m.MetaTagGeneratorTool));
const MarkdownToHtmlTool = dynamic<{ tool: ToolDef }>(() => import('./tools/markdown-to-html').then(m => m.MarkdownToHtmlTool));

import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/motion/motion";
const JwtDecoderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/jwt-decoder'));
import Link from "next/link";
const BlobGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/blob-generator').then(m => m.BlobGeneratorTool));
const SvgBackgroundGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/svg-background-generator').then(m => m.SvgBackgroundGeneratorTool));
const TermsGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/terms-generator').then(m => m.TermsGeneratorTool));
const PrivacyPolicyGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/privacy-policy-generator').then(m => m.PrivacyPolicyGeneratorTool));
const AvatarGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/avatar-generator').then(m => m.AvatarGeneratorTool));
const WhiteboardAppTool = dynamic<{ tool: ToolDef }>(() => import('./tools/whiteboard-app'));
const MemeGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/meme-generator').then(m => m.MemeGeneratorTool));
const NeumorphismGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/neumorphism-generator').then(m => m.NeumorphismGeneratorTool));
const GlassmorphismGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/glassmorphism-generator').then(m => m.GlassmorphismGeneratorTool));
const ImageResizerTool = dynamic<{ tool: ToolDef }>(() => import('./tools/image-resizer').then(m => m.ImageResizerTool));
const RobotsTxtGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/robots-txt-generator').then(m => m.RobotsTxtGeneratorTool));
const CssAnimationGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-animation-generator').then(m => m.CssAnimationGeneratorTool));
const TailwindTextGradientTool = dynamic<{ tool: ToolDef }>(() => import('./tools/tailwind-text-gradient').then(m => m.TailwindTextGradientTool));
const CssCursorGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-cursor-generator').then(m => m.CssCursorGeneratorTool));
const CssTransformGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-transform-generator').then(m => m.CssTransformGeneratorTool));
const CssFilterGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-filter-generator').then(m => m.CssFilterGeneratorTool));
const JwtBuilderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/jwt-builder'));
const CssKeyframesTool = dynamic<{ tool: ToolDef }>(() => import('./tools/css-keyframes'));
const MockDataGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/mock-data-generator'));
const CronBuilderTool = dynamic<{ tool: ToolDef }>(() => import('./tools/cron-builder'));
const WcagContrastCheckerTool = dynamic<{ tool: ToolDef }>(() => import('./tools/wcag-contrast-checker'));
const MarkdownTableGeneratorTool = dynamic<{ tool: ToolDef }>(() => import('./tools/markdown-table-generator'));



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
  "jwt-builder": JwtBuilderTool,
  "css-keyframes": CssKeyframesTool,
  "mock-data-generator": MockDataGeneratorTool,
  "cron-builder": CronBuilderTool,
  "wcag-contrast-checker": WcagContrastCheckerTool,
  "markdown-table-generator": MarkdownTableGeneratorTool,


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
  const Comp = MAP[tool.slug];

  if (!Comp) {
    return (
      <ToolNotImplemented tool={tool} suggestions={getSuggestions(tool, 6)} />
    );
  }

  return <Comp tool={tool} />;
}
