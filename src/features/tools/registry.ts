import type { Category } from "./categories";

export type ToolDef = {
  slug: string;
  name: string;
  shortDescription: string;
  category: Category;
  tags: string[];

  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  persistence: {
    persistInput: boolean;
    persistSettings: boolean;
    persistOutput: boolean;
  };
};

export const TOOLS: ToolDef[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDescription: "Format and validate JSON. Shows exact error location.",
    category: "Developer",
    tags: ["JSON", "Validate", "Format"],
    seo: {
      title: "JSON Formatter & Validator — ToolMate",
      description:
        "Format, minify, and validate JSON instantly. See errors with location hints.",
      keywords: [
        "json formatter",
        "json validator",
        "minify json",
        "pretty json",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    shortDescription:
      "Encode text or files to Base64 and decode Base64 back to text or files.",
    category: "Converters",
    tags: ["Base64", "Encoding", "Decoding", "Converter"],
    seo: {
      title: "Base64 Encoder & Decoder — ToolMate",
      description:
        "Convert text or files to Base64 and decode Base64 back to readable content instantly.",
      keywords: [
        "base64 encode",
        "base64 decode",
        "base64 converter",
        "base64 online tool",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    shortDescription: "Encode and decode URLs or query parameters instantly.",
    category: "Converters",
    tags: ["URL", "Encode", "Decode", "Query"],
    seo: {
      title: "URL Encoder & Decoder — ToolMate",
      description:
        "Encode and decode URLs or query strings instantly. Parse query parameters and convert to JSON.",
      keywords: [
        "url encode",
        "url decode",
        "query string decoder",
        "encodeURIComponent tool",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription:
      "Generate secure UUIDs (v4) instantly with bulk options and export tools.",
    category: "Generators",
    tags: ["UUID", "GUID", "Random", "Generator"],
    seo: {
      title: "UUID Generator — ToolMate",
      description:
        "Generate secure UUID v4 values instantly. Bulk generation, copy, export and customization supported.",
      keywords: [
        "uuid generator",
        "guid generator",
        "uuid v4",
        "generate uuid online",
      ],
    },
    persistence: {
      persistInput: false,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    shortDescription:
      "Convert Unix timestamps to human-readable dates and vice versa.",
    category: "Developer",
    tags: ["Timestamp", "Unix", "Epoch", "Date"],
    seo: {
      title: "Timestamp Converter — ToolMate",
      description:
        "Convert Unix timestamps (seconds or milliseconds) to human-readable date formats instantly.",
      keywords: [
        "timestamp converter",
        "unix timestamp",
        "epoch converter",
        "milliseconds to date",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription:
      "Generate secure passwords with strength indicator and advanced customization.",
    category: "Security",
    tags: ["Password", "Security", "Generator", "Strong Password"],
    seo: {
      title: "Password Generator — ToolMate",
      description:
        "Generate strong secure passwords with custom options and live strength indicator.",
      keywords: [
        "password generator",
        "strong password",
        "secure password tool",
      ],
    },
    persistence: {
      persistInput: false,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "device-details",
    name: "Device Details",
    shortDescription:
      "View browser/device capabilities for debugging and support.",
    category: "Information",
    tags: ["Browser", "Device", "Support"],
    seo: {
      title: "Device Details — ToolMate",
      description:
        "Get browser/device details (screen, touch, memory, GPU hints) with copy-ready output.",
      keywords: [
        "device details",
        "browser details",
        "user agent",
        "screen size",
      ],
    },
    persistence: {
      persistInput: false,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode and validate JWT tokens.",
    category: "Developer",
    tags: ["JWT", "Decode", "Validate"],
    seo: {
      title: "JWT Decoder — ToolMate",
      description: "Decode and validate JWT tokens. Great for debugging.",
      keywords: ["jwt decoder", "jwt validate", "jwt decode"],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "placeholder-generator",
    name: "Placeholder Image Generator",
    shortDescription:
      "Create customizable placeholder images with text, color, format and download options.",
    category: "Design",
    tags: ["Placeholder", "Image", "Mockup", "Generator"],
    seo: {
      title: "Placeholder Image Generator — ToolMate",
      description:
        "Generate custom placeholder images. Control size, colors, text, format and download instantly.",
      keywords: [
        "placeholder image",
        "image placeholder generator",
        "dummy image generator",
        "mockup image generator",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    shortDescription:
      "Test regular expressions live with flags, highlighting and match details.",
    category: "Developer",
    tags: ["Regex", "Pattern", "Tester", "Validation"],
    seo: {
      title: "Regex Tester — ToolMate",
      description:
        "Test and debug regular expressions live. Supports flags, match highlighting and capture groups.",
      keywords: [
        "regex tester",
        "regular expression tester",
        "regex online",
        "regex debug tool",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "text-diff",
    name: "Text Diff Tool",
    shortDescription: "Compare two texts and highlight differences instantly.",
    category: "Developer",
    tags: ["Diff", "Compare", "Text", "Changes"],
    seo: {
      title: "Text Diff Tool — ToolMate",
      description:
        "Compare two texts side by side and highlight differences instantly.",
      keywords: [
        "text diff tool",
        "compare text online",
        "highlight differences",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortDescription:
      "Generate customizable QR codes for URLs, text, WiFi, and more.",
    category: "Generators",
    tags: ["QR", "Barcode", "Generator", "Scan"],
    seo: {
      title: "QR Code Generator — ToolMate",
      description:
        "Create customizable QR codes instantly. Download PNG, SVG or share directly.",
      keywords: ["qr code generator", "generate qr code", "qr code online"],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}
