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
    slug: "jwt-builder",
    name: "JWT Builder & Signer",
    shortDescription: "Build and sign JWT tokens locally.",
    category: "Developer",
    tags: ["JWT", "Build", "Sign"],
    seo: {
      title: "JWT Builder - ToolMate",
      description: "Build and sign JSON Web Tokens (JWT) locally.",
      keywords: ["jwt", "builder", "sign", "json web token"],
    },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "text-diff",
    name: "Text Diff Tool",
    shortDescription: "Compare two texts and highlight differences instantly.",
    category: "Developer",
    tags: ["Diff", "Compare", "Text", "Changes"],
    seo: {
      title: "Text Diff Checker Tool — ToolMate",
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
  {
    slug: "dns-lookup",
    name: "DNS Lookup Tool",
    shortDescription:
      "Lookup DNS records (A, AAAA, MX, TXT, NS, CNAME) instantly.",
    category: "Developer",
    tags: ["DNS", "Domain", "Lookup", "Network"],
    seo: {
      title: "DNS Lookup Tool — ToolMate",
      description:
        "Lookup DNS records online. Fetch A, AAAA, MX, TXT, NS and more instantly.",
      keywords: ["dns lookup", "dns checker", "a record lookup"],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "accessibility-refactor",
    name: "Accessibility Refactor Assistant",
    shortDescription:
      "Analyze and refactor HTML/JSX to improve accessibility with rule-based fixes.",
    category: "Developer",
    tags: ["Accessibility", "WCAG", "Refactor", "A11y"],
    seo: {
      title: "Accessibility Refactor Assistant — ToolMate",
      description:
        "Improve accessibility of your HTML or JSX. Get score, issues, and auto-fixes instantly.",
      keywords: [
        "accessibility checker",
        "wcag analyzer",
        "html accessibility tool",
        "jsx accessibility checker",
      ],
    },
    persistence: {
      persistInput: true,
      persistSettings: true,
      persistOutput: true,
    },
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter & Minifier",
    shortDescription: "Format and minify HTML instantly.",
    category: "Developer",
    tags: ["HTML", "Format", "Minify"],
    seo: { title: "HTML Formatter & Minifier — ToolMate", description: "Format and minify HTML code in the browser.", keywords: ["html formatter", "html minify", "beautify html"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "css-formatter",
    name: "CSS Formatter & Minifier",
    shortDescription: "Format and minify CSS code.",
    category: "Developer",
    tags: ["CSS", "Format", "Minify"],
    seo: { title: "CSS Formatter & Minifier — ToolMate", description: "Format and minify CSS stylesheets instantly.", keywords: ["css formatter", "css minify", "beautify css"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "js-formatter",
    name: "JS / TS Formatter",
    shortDescription: "Format JavaScript and TypeScript code.",
    category: "Developer",
    tags: ["JavaScript", "TypeScript", "Format"],
    seo: { title: "JavaScript Formatter — ToolMate", description: "Format JavaScript and TypeScript instantly.", keywords: ["javascript formatter", "typescript formatter", "js prettier"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "wcag-contrast-checker",
    name: "WCAG Contrast Checker",
    shortDescription: "Check color contrast for accessibility.",
    category: "Design",
    tags: ["WCAG", "Color", "Contrast", "Accessibility", "A11y"],
    seo: {
      title: "WCAG Color Contrast Checker - ToolMate",
      description: "Check if your foreground and background colors meet WCAG accessibility standards.",
      keywords: ["wcag", "contrast checker", "accessibility", "a11y", "color contrast"],
    },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "cron-parser",
    name: "Cron Expression Parser",
    shortDescription: "Parse and explain CRON expressions in plain English.",
    category: "Developer",
    tags: ["CRON", "Parser", "Schedule"],
    seo: { title: "Cron Expression Parser — ToolMate", description: "Parse and explain CRON expressions in plain English.", keywords: ["cron parser", "cron explainer", "cron expression"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "base-converter",
    name: "Base Converter",
    shortDescription: "Convert numbers between Decimal, Hex, Binary, and Octal.",
    category: "Converters",
    tags: ["Base", "Hex", "Binary", "Converter"],
    seo: { title: "Number Base Converter — ToolMate", description: "Convert numbers between Decimal, Hex, Binary, and Octal.", keywords: ["base converter", "hex to decimal", "binary to decimal"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "html-entity-encoder",
    name: "HTML Entity Encoder",
    shortDescription: "Encode and decode HTML entities.",
    category: "Converters",
    tags: ["HTML", "Entity", "Encode", "Decode"],
    seo: { title: "HTML Entity Encoder / Decoder — ToolMate", description: "Encode and decode HTML entities online.", keywords: ["html entity encoder", "html entity decoder"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    shortDescription: "Convert colors between HEX, RGB, and HSL.",
    category: "Design",
    tags: ["Color", "HEX", "RGB", "HSL", "Converter"],
    seo: { title: "Color HEX RGB HSL Converter — ToolMate", description: "Convert colors between HEX, RGB, and HSL.", keywords: ["color converter", "hex to rgb", "rgb to hsl"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    shortDescription: "Convert text to Camel Case, Snake Case, etc.",
    category: "Converters",
    tags: ["Text", "Case", "Converter"],
    seo: { title: "Text Case Converter Tool — ToolMate", description: "Convert text to Camel Case, Snake Case, Kebab Case, and more.", keywords: ["text case converter", "camel case converter", "snake case converter"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription: "Count words, characters, lines, and bytes in text.",
    category: "Information",
    tags: ["Word", "Character", "Count", "Text"],
    seo: { title: "Word & Character Counter — ToolMate", description: "Count words, characters, lines, and bytes in any text.", keywords: ["word counter", "character counter", "text length"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    shortDescription: "Parse URLs to extract protocol, host, path, and query params.",
    category: "Developer",
    tags: ["URL", "Parser", "Query"],
    seo: { title: "URL & Query String Parser — ToolMate", description: "Parse URLs to extract protocol, host, path, and query params.", keywords: ["url parser", "parse url", "query string parser"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "chmod-calculator",
    name: "Chmod Calculator",
    shortDescription: "Calculate Linux chmod permissions visually.",
    category: "Developer",
    tags: ["Chmod", "Linux", "Permissions"],
    seo: { title: "Linux Chmod Permissions Calculator — ToolMate", description: "Calculate Linux chmod permissions visually.", keywords: ["chmod calculator", "linux permissions", "chmod 777"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "mime-types",
    name: "MIME Types List",
    shortDescription: "Searchable directory of file extensions and MIME types.",
    category: "Information",
    tags: ["MIME", "Extension", "File"],
    seo: { title: "MIME Types Directory — ToolMate", description: "Searchable directory of file extensions and MIME types.", keywords: ["mime types", "file extensions", "content type"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "key-code-info",
    name: "Key Code Info",
    shortDescription: "Press any key to get its JavaScript key code and event info.",
    category: "Developer",
    tags: ["Key", "Code", "Event", "Keyboard"],
    seo: { title: "Key Code Info Tracker — ToolMate", description: "Press any key to get its JavaScript key code and event info.", keywords: ["key code", "javascript keycode", "event.key"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    shortDescription: "Generate linear and radial CSS gradients visually.",
    category: "Design",
    tags: ["CSS", "Gradient", "Generator"],
    seo: { title: "CSS Gradient Generator — ToolMate", description: "Generate linear and radial CSS gradients visually.", keywords: ["css gradient generator", "linear gradient", "radial gradient"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "css-box-shadow",
    name: "CSS Box Shadow",
    shortDescription: "Generate CSS box-shadows visually.",
    category: "Design",
    tags: ["CSS", "Shadow", "Generator"],
    seo: { title: "CSS Box Shadow Generator — ToolMate", description: "Generate CSS box-shadows visually.", keywords: ["css box shadow", "box shadow generator", "shadow css"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "svg-to-jsx",
    name: "SVG to JSX Converter",
    shortDescription: "Convert raw SVG strings to React JSX components.",
    category: "Converters",
    tags: ["SVG", "JSX", "React", "Converter"],
    seo: { title: "SVG to JSX Converter — ToolMate", description: "Convert raw SVG strings to React JSX components.", keywords: ["svg to jsx", "svg to react", "react icon generator"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    shortDescription: "Live preview Markdown editor.",
    category: "Developer",
    tags: ["Markdown", "Editor", "Preview"],
    seo: { title: "Markdown Editor & Previewer — ToolMate", description: "Live preview Markdown editor.", keywords: ["markdown editor", "live markdown", "markdown preview"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "markdown-table-generator",
    name: "Markdown Table Generator",
    shortDescription: "Visually build perfectly aligned markdown tables.",
    category: "Developer",
    tags: ["Markdown", "Table", "Generator", "Grid"],
    seo: { title: "Markdown Table Generator - ToolMate", description: "Visually build and edit perfectly aligned Markdown tables. Export raw markdown instantly.", keywords: ["markdown table generator", "markdown table maker", "markdown grid builder", "table to markdown"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "stopwatch-timer",
    name: "Stopwatch & Timer",
    shortDescription: "Developer stopwatch with lap functionality.",
    category: "Information",
    tags: ["Stopwatch", "Timer", "Time"],
    seo: { title: "Stopwatch & Timer — ToolMate", description: "Developer stopwatch with lap functionality.", keywords: ["stopwatch", "timer", "lap timer"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "yaml-formatter",
    name: "YAML Formatter & Validator",
    shortDescription: "Format and validate YAML files.",
    category: "Developer",
    tags: ["YAML", "Format", "Validate"],
    seo: { title: "YAML Formatter & Validator — ToolMate", description: "Format and validate YAML files.", keywords: ["yaml formatter", "yaml validator", "beautify yaml"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "bcrypt-generator",
    name: "Bcrypt Generator & Checker",
    shortDescription: "Hash and verify strings using bcrypt.",
    category: "Security",
    tags: ["Bcrypt", "Hash", "Security"],
    seo: { title: "Bcrypt Hash Generator — ToolMate", description: "Generate and verify Bcrypt hashes.", keywords: ["bcrypt generator", "bcrypt checker", "hash password"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "csv-to-sql",
    name: "CSV to SQL Converter",
    shortDescription: "Convert CSV datasets into raw SQL INSERT statements.",
    category: "Converters",
    tags: ["CSV", "SQL", "Database"],
    seo: { title: "CSV to SQL Converter — ToolMate", description: "Convert CSV datasets into SQL INSERT queries.", keywords: ["csv to sql", "csv to insert", "convert csv"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "json-to-graphql",
    name: "JSON to GraphQL Schema",
    shortDescription: "Generate GraphQL type definitions from a JSON object.",
    category: "Developer",
    tags: ["JSON", "GraphQL", "Schema"],
    seo: { title: "JSON to GraphQL Schema — ToolMate", description: "Generate GraphQL types from JSON payloads.", keywords: ["json to graphql", "graphql generator", "json schema to graphql"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "math-evaluator",
    name: "Math Expression Evaluator",
    shortDescription: "Evaluate mathematical expressions and unit conversions line-by-line.",
    category: "Developer",
    tags: ["Math", "Calculator", "Evaluate"],
    seo: { title: "Math Expression Evaluator — ToolMate", description: "Evaluate mathematical expressions.", keywords: ["math evaluator", "expression evaluator", "developer calculator"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "json-stringifier",
    name: "JSON Stringifier / Unstringifier",
    shortDescription: "Escape and unescape stringified JSON objects.",
    category: "Developer",
    tags: ["JSON", "Stringify", "Escape"],
    seo: { title: "JSON Stringifier — ToolMate", description: "Escape and unescape JSON objects.", keywords: ["json stringify", "escape json", "unescape json"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "docker-to-compose",
    name: "Docker Run to Compose",
    shortDescription: "Convert 'docker run' commands to docker-compose.yml.",
    category: "Developer",
    tags: ["Docker", "Compose", "Converter"],
    seo: { title: "Docker Run to Docker Compose — ToolMate", description: "Convert long docker run commands to compose files.", keywords: ["docker run to docker compose", "composerize", "docker run parser"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "sql-to-prisma",
    name: "SQL to Prisma Schema",
    shortDescription: "Convert SQL CREATE TABLE statements to Prisma Schema.",
    category: "Developer",
    tags: ["SQL", "Prisma", "Database"],
    seo: { title: "SQL to Prisma Schema — ToolMate", description: "Convert SQL to Prisma schema.", keywords: ["sql to prisma", "create table to prisma", "prisma schema generator"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "git-command-builder",
    name: "Git Command Builder",
    shortDescription: "Visually build complex git commands.",
    category: "Developer",
    tags: ["Git", "Command", "Builder"],
    seo: { title: "Git Command Builder — ToolMate", description: "Interactively build git commands.", keywords: ["git command builder", "git cheat sheet", "generate git command"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "css-layout-generator",
    name: "CSS Layout Generator",
    shortDescription: "Visually build CSS Flexbox and Grid layouts.",
    category: "Design",
    tags: ["CSS", "Flexbox", "Grid", "Layout"],
    seo: { title: "CSS Flexbox & Grid Generator — ToolMate", description: "Visually build and export CSS Flexbox and Grid layouts.", keywords: ["css flexbox generator", "css grid generator", "css layout generator"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: true },
  },
  {
    slug: "app-icon-generator",
    name: "App Icon Generator",
    shortDescription: "Generate standard iOS and Android app icons from a single image.",
    category: "Design",
    tags: ["App Icon", "iOS", "Android", "Mobile"],
    seo: { title: "App Icon Generator for iOS & Android — ToolMate", description: "Upload an image and instantly download a ZIP containing all iOS and Android standard icon sizes.", keywords: ["app icon generator", "android icon generator", "ios icon generator"] },
    persistence: { persistInput: false, persistSettings: true, persistOutput: false },
  },
  {
    slug: "gitignore-generator",
    name: ".gitignore Generator",
    shortDescription: "Generate useful .gitignore files for your project.",
    category: "Developer",
    tags: ["Git", "Gitignore", "Repository"],
    seo: { title: ".gitignore Generator — ToolMate", description: "Instantly generate useful .gitignore files for your project by selecting your operating system, IDE, or programming language.", keywords: ["gitignore generator", "gitignore file generator", "create gitignore"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    shortDescription: "Generate HTML meta tags for SEO and social sharing.",
    category: "Developer",
    tags: ["Meta Tags", "SEO", "Open Graph", "HTML"],
    seo: { title: "HTML Meta Tag Generator — ToolMate", description: "Generate complete HTML meta tags for SEO, Facebook (Open Graph), and Twitter.", keywords: ["meta tag generator", "seo meta tags", "open graph generator", "twitter card generator"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML Converter",
    shortDescription: "Convert Markdown to formatted HTML code.",
    category: "Converters",
    tags: ["Markdown", "HTML", "Converter"],
    seo: { title: "Markdown to HTML Converter — ToolMate", description: "Instantly convert raw Markdown text into properly formatted HTML code.", keywords: ["markdown to html", "md to html", "markdown parser"] },
    persistence: { persistInput: true, persistSettings: true, persistOutput: true },
  }
  ,{
  "slug": "blob-generator",
  "name": "SVG Blob Generator",
  "shortDescription": "Generate organic SVG blob shapes for your UI.",
  "category": "Design",
  "tags": [
    "SVG",
    "Blob",
    "Design",
    "Generator"
  ],
  "seo": {
    "title": "SVG Blob Generator — ToolMate",
    "description": "Generate custom SVG blob shapes instantly.",
    "keywords": [
      "blob generator",
      "svg blob",
      "organic shape generator"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "svg-background-generator",
  "name": "SVG Background Generator",
  "shortDescription": "Generate seamless SVG background patterns.",
  "category": "Design",
  "tags": [
    "SVG",
    "Background",
    "Pattern",
    "Generator"
  ],
  "seo": {
    "title": "SVG Background Pattern Generator — ToolMate",
    "description": "Create lightweight SVG background patterns.",
    "keywords": [
      "svg background",
      "pattern generator",
      "svg grid pattern"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "terms-generator",
  "name": "Terms & Conditions Generator",
  "shortDescription": "Generate boilerplate Terms and Conditions.",
  "category": "Information",
  "tags": [
    "Legal",
    "Terms",
    "Generator"
  ],
  "seo": {
    "title": "Terms & Conditions Generator — ToolMate",
    "description": "Generate standard Terms and Conditions for your app.",
    "keywords": [
      "terms generator",
      "terms and conditions template"
    ]
  },
  "persistence": {
    "persistInput": true,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "privacy-policy-generator",
  "name": "Privacy Policy Generator",
  "shortDescription": "Generate boilerplate Privacy Policy.",
  "category": "Information",
  "tags": [
    "Legal",
    "Privacy",
    "Generator"
  ],
  "seo": {
    "title": "Privacy Policy Generator — ToolMate",
    "description": "Generate standard Privacy Policy for your app.",
    "keywords": [
      "privacy policy generator",
      "privacy policy template"
    ]
  },
  "persistence": {
    "persistInput": true,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "avatar-generator",
  "name": "Avatar Generator",
  "shortDescription": "Generate unique avatars using DiceBear.",
  "category": "Design",
  "tags": [
    "Avatar",
    "Generator",
    "Profile",
    "DiceBear"
  ],
  "seo": {
    "title": "Avatar Generator — ToolMate",
    "description": "Generate unique vector avatars instantly.",
    "keywords": [
      "avatar generator",
      "dicebear generator",
      "random avatar"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "whiteboard-app",
  "name": "Simple Whiteboard",
  "shortDescription": "A fully functional drawing whiteboard.",
  "category": "Design",
  "tags": [
    "Whiteboard",
    "Drawing",
    "Canvas"
  ],
  "seo": {
    "title": "Simple Whiteboard — ToolMate",
    "description": "Draw and sketch ideas on a simple whiteboard.",
    "keywords": [
      "whiteboard app",
      "online drawing",
      "tldraw tool"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": false,
    "persistOutput": false
  }
},
  {
  "slug": "meme-generator",
  "name": "Meme Generator",
  "shortDescription": "Generate trending memes instantly.",
  "category": "Generators",
  "tags": [
    "Meme",
    "Generator",
    "Image"
  ],
  "seo": {
    "title": "Meme Generator — ToolMate",
    "description": "Create trending memes directly in your browser.",
    "keywords": [
      "meme generator",
      "imgflip memes"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "neumorphism-generator",
  "name": "Neumorphism Generator",
  "shortDescription": "Generate soft-UI CSS shadows.",
  "category": "Design",
  "tags": [
    "CSS",
    "Neumorphism",
    "Shadow",
    "Generator"
  ],
  "seo": {
    "title": "Neumorphism Generator — ToolMate",
    "description": "Visually generate neumorphism CSS shadows.",
    "keywords": [
      "neumorphism generator",
      "soft ui generator",
      "css neumorphism"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "glassmorphism-generator",
  "name": "Glassmorphism Generator",
  "shortDescription": "Generate CSS frosted glass effects.",
  "category": "Design",
  "tags": [
    "CSS",
    "Glassmorphism",
    "Generator"
  ],
  "seo": {
    "title": "Glassmorphism Generator — ToolMate",
    "description": "Visually generate CSS glassmorphism effects.",
    "keywords": [
      "glassmorphism generator",
      "frosted glass css",
      "backdrop-filter"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "image-resizer",
  "name": "Image Resizer",
  "shortDescription": "Resize and compress images entirely in the browser.",
  "category": "Design",
  "tags": [
    "Image",
    "Resize",
    "Utility"
  ],
  "seo": {
    "title": "Image Resizer — ToolMate",
    "description": "Quickly resize images in the browser. No server upload required.",
    "keywords": [
      "image resizer",
      "resize image online",
      "client side image resizer"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "robots-txt-generator",
  "name": "robots.txt Generator",
  "shortDescription": "Generate rules for search engine crawlers.",
  "category": "Developer",
  "tags": [
    "SEO",
    "Robots",
    "Generator"
  ],
  "seo": {
    "title": "robots.txt Generator — ToolMate",
    "description": "Generate a robots.txt file to instruct web crawlers.",
    "keywords": [
      "robots.txt generator",
      "seo crawler rules"
    ]
  },
  "persistence": {
    "persistInput": true,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "css-animation-generator",
  "name": "CSS Animation Generator",
  "shortDescription": "Build and preview CSS keyframe animations.",
  "category": "Design",
  "tags": [
    "CSS",
    "Animation",
    "Keyframes",
    "Generator"
  ],
  "seo": {
    "title": "CSS Animation Generator — ToolMate",
    "description": "Visually build CSS animations and export keyframes.",
    "keywords": [
      "css animation generator",
      "keyframes generator",
      "animate css online"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "tailwind-text-gradient",
  "name": "Tailwind Text Gradient",
  "shortDescription": "Generate text gradient classes for Tailwind CSS.",
  "category": "Design",
  "tags": [
    "Tailwind",
    "CSS",
    "Gradient",
    "Text"
  ],
  "seo": {
    "title": "Tailwind Text Gradient Generator — ToolMate",
    "description": "Build text gradients visually with Tailwind arbitrary values.",
    "keywords": [
      "tailwind text gradient",
      "tailwind gradient generator",
      "text-transparent bg-clip-text"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "css-cursor-generator",
  "name": "CSS Cursor Generator",
  "shortDescription": "Preview CSS cursors and generate custom cursor CSS.",
  "category": "Design",
  "tags": [
    "CSS",
    "Cursor",
    "Generator"
  ],
  "seo": {
    "title": "CSS Cursor Generator — ToolMate",
    "description": "Preview all CSS cursors and generate code.",
    "keywords": [
      "css cursor generator",
      "cursor pointer",
      "custom cursor css"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": false,
    "persistOutput": false
  }
},
  {
  "slug": "css-transform-generator",
  "name": "CSS Transform Generator",
  "shortDescription": "Generate CSS transforms (translate, rotate, scale, skew).",
  "category": "Design",
  "tags": [
    "CSS",
    "Transform",
    "Generator"
  ],
  "seo": {
    "title": "CSS Transform Generator — ToolMate",
    "description": "Visually construct CSS transform values.",
    "keywords": [
      "css transform generator",
      "translate css",
      "rotate css"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
  "slug": "css-filter-generator",
  "name": "CSS Filter Generator",
  "shortDescription": "Visually build CSS filters (blur, contrast, brightness).",
  "category": "Design",
  "tags": [
    "CSS",
    "Filter",
    "Image",
    "Generator"
  ],
  "seo": {
    "title": "CSS Filter Generator — ToolMate",
    "description": "Visually build CSS filters like blur and brightness.",
    "keywords": [
      "css filter generator",
      "image filters css",
      "backdrop filter"
    ]
  },
  "persistence": {
    "persistInput": false,
    "persistSettings": true,
    "persistOutput": false
  }
},
  {
    "slug": "image-compressor",
    "name": "Image Compressor",
    "shortDescription": "Compress JPEG, PNG, and WebP images in your browser without uploading.",
    "category": "Images",
    "tags": [
      "Image",
      "Compress",
      "Optimize",
      "WebP",
      "PNG",
      "JPEG"
    ],
    "seo": {
      "title": "Image Compressor — 100% Client-Side Image Compression | ToolMate",
      "description": "Compress JPEG, PNG, and WebP images in your browser without quality loss. Safe, private, and fast.",
      "keywords": [
        "image compressor",
        "compress png",
        "compress jpeg",
        "compress webp",
        "reduce image size"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "background-remover",
    "name": "AI Background Remover",
    "shortDescription": "Remove background from photos and logos instantly with transparent PNG export.",
    "category": "Images",
    "tags": [
      "Image",
      "Background Remover",
      "Transparent PNG",
      "Cutout"
    ],
    "seo": {
      "title": "AI Background Remover — Free Online Background Removal | ToolMate",
      "description": "Remove photo backgrounds instantly in your browser. Download high-resolution transparent PNG images for free.",
      "keywords": [
        "background remover",
        "remove background from image",
        "transparent background png",
        "photo cutout"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "background-changer",
    "name": "Background Changer",
    "shortDescription": "Replace photo backgrounds with colors, modern gradients, or studio backdrops.",
    "category": "Images",
    "tags": [
      "Image",
      "Background Changer",
      "Gradients",
      "Studio"
    ],
    "seo": {
      "title": "Background Changer — Replace Photo Backgrounds Online | ToolMate",
      "description": "Replace photo backgrounds with solid colors, vibrant gradients, or custom backdrops directly in your browser.",
      "keywords": [
        "background changer",
        "change photo background",
        "replace background online",
        "photo backdrop"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "portrait-blur",
    "name": "Portrait Blur (Bokeh Effect)",
    "shortDescription": "Create professional DSLR bokeh blur while keeping subjects sharp.",
    "category": "Images",
    "tags": [
      "Image",
      "Portrait",
      "Bokeh",
      "Blur",
      "Depth of Field"
    ],
    "seo": {
      "title": "Portrait Blur & Bokeh Effect Maker — ToolMate",
      "description": "Add professional depth-of-field and smooth bokeh blur to portrait photos. 100% client-side.",
      "keywords": [
        "portrait blur",
        "bokeh effect",
        "blur background",
        "depth of field online"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "passport-photo",
    "name": "Passport Photo Maker",
    "shortDescription": "Create official passport and visa photos with printable 4x6 inch sheets.",
    "category": "Images",
    "tags": [
      "Image",
      "Passport",
      "Visa",
      "Biometric",
      "Print"
    ],
    "seo": {
      "title": "Passport Photo Maker — Official Biometric Photos & 4x6 Sheets | ToolMate",
      "description": "Create compliant passport photos for US, UK, India, Schengen, Canada, and Australia with 300 DPI 4x6 print sheets.",
      "keywords": [
        "passport photo maker",
        "visa photo maker",
        "2x2 inch photo",
        "passport photo printable sheet"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "sticker-maker",
    "name": "Custom Sticker Maker",
    "shortDescription": "Turn photos and graphics into die-cut stickers with white border contours.",
    "category": "Images",
    "tags": [
      "Image",
      "Sticker",
      "Die-Cut",
      "Contour",
      "PNG"
    ],
    "seo": {
      "title": "Custom Sticker Maker — Die-Cut Outline & Shadow | ToolMate",
      "description": "Create custom stickers with die-cut white borders, soft drop shadows, and transparent PNG downloads.",
      "keywords": [
        "sticker maker",
        "die cut sticker generator",
        "photo to sticker",
        "sticker border generator"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "headshot-generator",
    "name": "Professional Headshot Generator",
    "shortDescription": "Enhance portrait photos with studio lighting grades for LinkedIn and resumes.",
    "category": "Images",
    "tags": [
      "Image",
      "Headshot",
      "LinkedIn",
      "Resume",
      "Studio"
    ],
    "seo": {
      "title": "Professional Headshot Generator — Studio Lighting & Crop | ToolMate",
      "description": "Enhance personal photos into studio-quality executive headshots for LinkedIn, resumes, and corporate bios.",
      "keywords": [
        "headshot generator",
        "linkedin photo enhancer",
        "professional profile picture maker"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "image-converter",
    "name": "Universal Image Converter",
    "shortDescription": "Convert between JPG, PNG, WebP, AVIF, HEIC, and BMP formats instantly.",
    "category": "Converters",
    "tags": [
      "Converter",
      "Image",
      "Format",
      "WebP",
      "PNG",
      "JPG"
    ],
    "seo": {
      "title": "Universal Image Converter — Free Online Image Format Converter | ToolMate",
      "description": "Convert images between JPG, PNG, WebP, AVIF, HEIC, and BMP online. 100% private and fast.",
      "keywords": [
        "image converter",
        "convert image format",
        "jpg to png",
        "png to webp",
        "universal image converter"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "batch-convert",
    "name": "Batch Image Converter",
    "shortDescription": "Convert multiple images at once to JPG, PNG, or WebP with bulk download.",
    "category": "Converters",
    "tags": [
      "Converter",
      "Batch",
      "Image",
      "Bulk",
      "WebP"
    ],
    "seo": {
      "title": "Batch Image Converter — Convert Multiple Images Online | ToolMate",
      "description": "Bulk convert multiple images simultaneously to WebP, PNG, or JPG. Fast client-side batch processing.",
      "keywords": [
        "batch image converter",
        "bulk image convert",
        "convert multiple images online"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "heic-to-jpg",
    "name": "HEIC to JPG Converter",
    "shortDescription": "Convert Apple iPhone HEIC and HEIF photos to standard JPG format.",
    "category": "Converters",
    "tags": [
      "Converter",
      "HEIC",
      "JPG",
      "iPhone",
      "Apple"
    ],
    "seo": {
      "title": "HEIC to JPG Converter — Convert iPhone Photos Online | ToolMate",
      "description": "Convert Apple HEIC photos to JPG format instantly in your browser without uploading your files.",
      "keywords": [
        "heic to jpg",
        "convert heic to jpg",
        "heic converter",
        "iphone photo converter"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "jpeg-to-png",
    "name": "JPEG to PNG Converter",
    "shortDescription": "Convert JPEG and JPG images to lossless PNG format.",
    "category": "Converters",
    "tags": [
      "Converter",
      "JPEG",
      "PNG",
      "Lossless"
    ],
    "seo": {
      "title": "JPEG to PNG Converter — Lossless Image Conversion | ToolMate",
      "description": "Convert JPG and JPEG files to transparent lossless PNG format online for free.",
      "keywords": [
        "jpeg to png",
        "jpg to png converter",
        "convert jpeg to png"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "jpeg-to-webp",
    "name": "JPEG to WebP Converter",
    "shortDescription": "Convert JPEG images to WebP format to reduce website payload sizes.",
    "category": "Converters",
    "tags": [
      "Converter",
      "JPEG",
      "WebP",
      "Compression"
    ],
    "seo": {
      "title": "JPEG to WebP Converter — Reduce File Size by 35% | ToolMate",
      "description": "Convert JPEG images to modern WebP format for faster web page loads and reduced bandwidth.",
      "keywords": [
        "jpeg to webp",
        "jpg to webp converter",
        "convert jpeg to webp"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "webp-to-png",
    "name": "WebP to PNG Converter",
    "shortDescription": "Convert WebP images into universal lossless PNG files.",
    "category": "Converters",
    "tags": [
      "Converter",
      "WebP",
      "PNG"
    ],
    "seo": {
      "title": "WebP to PNG Converter — Instant Free Conversion | ToolMate",
      "description": "Convert modern WebP images to standard PNG files compatible with all software and platforms.",
      "keywords": [
        "webp to png",
        "convert webp to png",
        "webp image converter"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "png-to-webp",
    "name": "PNG to WebP Converter",
    "shortDescription": "Convert PNG images to WebP format to save up to 80% file size.",
    "category": "Converters",
    "tags": [
      "Converter",
      "PNG",
      "WebP",
      "Optimize"
    ],
    "seo": {
      "title": "PNG to WebP Converter — Save Up to 80% Size | ToolMate",
      "description": "Convert heavy PNG graphics to lightweight WebP format with alpha channel transparency preserved.",
      "keywords": [
        "png to webp",
        "convert png to webp",
        "png compression webp"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "avif-to-jpg",
    "name": "AVIF to JPG Converter",
    "shortDescription": "Convert modern AVIF image files into universal standard JPG photos.",
    "category": "Converters",
    "tags": [
      "Converter",
      "AVIF",
      "JPG"
    ],
    "seo": {
      "title": "AVIF to JPG Converter — Convert AVIF Images Online | ToolMate",
      "description": "Convert AVIF image files to standard JPG format for full compatibility across devices.",
      "keywords": [
        "avif to jpg",
        "convert avif to jpg",
        "avif converter"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "merge-pdf",
    "name": "Merge PDF",
    "shortDescription": "Combine multiple PDF documents into a single document with custom ordering.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Merge",
      "Combine",
      "Document"
    ],
    "seo": {
      "title": "Merge PDF Online — Combine Multiple PDFs for Free | ToolMate",
      "description": "Combine multiple PDF documents into one single PDF file. Drag and drop reordering, 100% private in-browser.",
      "keywords": [
        "merge pdf",
        "combine pdf",
        "pdf merger online",
        "join pdf files"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "split-pdf",
    "name": "Split PDF",
    "shortDescription": "Split PDF into multiple files by custom page ranges or extract all pages.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Split",
      "Extract",
      "Pages"
    ],
    "seo": {
      "title": "Split PDF Online — Extract PDF Pages for Free | ToolMate",
      "description": "Split a PDF file into separate documents by page ranges or extract each page into individual files.",
      "keywords": [
        "split pdf",
        "extract pdf pages",
        "pdf splitter online",
        "separate pdf"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "compress-pdf",
    "name": "Compress PDF",
    "shortDescription": "Reduce PDF document file size while preserving reading quality.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Compress",
      "Optimize",
      "Reduce Size"
    ],
    "seo": {
      "title": "Compress PDF Online — Reduce PDF File Size | ToolMate",
      "description": "Optimize and reduce PDF document file size for easier emailing and storage. 100% client-side security.",
      "keywords": [
        "compress pdf",
        "reduce pdf size",
        "pdf compressor online",
        "shrink pdf file"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "pdf-to-images",
    "name": "PDF to Images",
    "shortDescription": "Convert PDF pages into high-resolution JPG or PNG pictures.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Images",
      "JPG",
      "PNG",
      "Convert"
    ],
    "seo": {
      "title": "PDF to Images Converter — Convert PDF to JPG or PNG | ToolMate",
      "description": "Convert every page of your PDF into high-resolution JPG or PNG images. Fast and private in-browser.",
      "keywords": [
        "pdf to images",
        "convert pdf to jpg",
        "pdf to png converter",
        "extract images from pdf"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "images-to-pdf",
    "name": "Images to PDF",
    "shortDescription": "Convert JPG, PNG, and WebP images into a single professional PDF.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Images to PDF",
      "Combine",
      "A4"
    ],
    "seo": {
      "title": "Images to PDF Converter — Turn Photos into PDF | ToolMate",
      "description": "Convert multiple JPG, PNG, or WebP images into a single PDF document with custom margins and page formats.",
      "keywords": [
        "images to pdf",
        "jpg to pdf",
        "photos to pdf converter",
        "convert images to pdf"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "rotate-pdf",
    "name": "Rotate PDF",
    "shortDescription": "Rotate PDF pages 90°, 180°, or 270° permanently per page or for all pages.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Rotate",
      "Orientation"
    ],
    "seo": {
      "title": "Rotate PDF Online — Rotate PDF Pages Permanently | ToolMate",
      "description": "Rotate individual PDF pages or the entire document by 90, 180, or 270 degrees clockwise online.",
      "keywords": [
        "rotate pdf",
        "rotate pdf pages",
        "pdf orientation changer"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "pdf-page-numbers",
    "name": "Add Page Numbers to PDF",
    "shortDescription": "Stamp formatted page numbers on your PDF document with custom positions.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Page Numbers",
      "Pagination",
      "Stamp"
    ],
    "seo": {
      "title": "Add Page Numbers to PDF — Online PDF Pagination | ToolMate",
      "description": "Add clean, formatted page numbers to your PDF documents with customizable alignment, formatting, and fonts.",
      "keywords": [
        "add page numbers to pdf",
        "pdf page numbering",
        "paginate pdf online"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "pdf-watermark",
    "name": "Add Watermark to PDF",
    "shortDescription": "Stamp custom text watermarks across every page of your PDF.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Watermark",
      "Security",
      "Stamp"
    ],
    "seo": {
      "title": "Add Watermark to PDF Online — Protect Documents | ToolMate",
      "description": "Stamp diagonal or horizontal text watermarks like CONFIDENTIAL or DRAFT onto every page of your PDF.",
      "keywords": [
        "add watermark to pdf",
        "pdf watermark online",
        "stamp pdf document"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "reorder-pdf",
    "name": "Reorder PDF Pages",
    "shortDescription": "Visually rearrange and resequence PDF pages with thumbnail cards.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Reorder",
      "Rearrange",
      "Sort Pages"
    ],
    "seo": {
      "title": "Reorder PDF Pages — Rearrange PDF Pages Online | ToolMate",
      "description": "Change the page sequence of your PDF document with intuitive visual reordering controls.",
      "keywords": [
        "reorder pdf pages",
        "rearrange pdf",
        "organize pdf pages"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "remove-pdf-pages",
    "name": "Remove PDF Pages",
    "shortDescription": "Select and delete unwanted pages from any PDF document.",
    "category": "PDF",
    "tags": [
      "PDF",
      "Delete Pages",
      "Remove Pages"
    ],
    "seo": {
      "title": "Remove PDF Pages — Delete Unwanted Pages from PDF | ToolMate",
      "description": "Select unwanted pages visually and remove them from your PDF file permanently.",
      "keywords": [
        "remove pdf pages",
        "delete pages from pdf",
        "delete pdf page online"
      ]
    },
    "persistence": {
      "persistInput": false,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "json-to-struct",
    "name": "JSON to Code Structs & Models",
    "shortDescription": "Generate Go structs, Rust serde, TypeScript, Python Pydantic, and Kotlin models from JSON.",
    "category": "Developer",
    "tags": [
      "JSON",
      "Go",
      "Rust",
      "TypeScript",
      "Python",
      "Pydantic",
      "Kotlin",
      "Java",
      "C#",
      "Swift"
    ],
    "seo": {
      "title": "JSON to Code Structs — Go, Rust, TypeScript, Python, Kotlin | ToolMate",
      "description": "Convert JSON objects into Go structs, Rust serde models, TypeScript interfaces, Python Pydantic classes, and Kotlin serialization.",
      "keywords": [
        "json to struct",
        "json to go struct",
        "json to rust serde",
        "json to pydantic",
        "json to kotlin"
      ]
    },
    "persistence": {
      "persistInput": true,
      "persistSettings": true,
      "persistOutput": true
    }
  },
  {
    "slug": "yaml-validator",
    "name": "YAML Validator & Linter",
    "shortDescription": "Validate YAML syntax, detect exact error lines and columns, and preview equivalent JSON.",
    "category": "Developer",
    "tags": [
      "YAML",
      "Validate",
      "Lint",
      "Syntax",
      "JSON"
    ],
    "seo": {
      "title": "YAML Validator & Linter — Check YAML Syntax Online | ToolMate",
      "description": "Validate YAML syntax with exact line and column error reporting, code formatting, and real-time JSON preview.",
      "keywords": [
        "yaml validator",
        "validate yaml",
        "yaml linter",
        "yaml syntax checker"
      ]
    },
    "persistence": {
      "persistInput": true,
      "persistSettings": true,
      "persistOutput": true
    }
  },
  {
    "slug": "explain-visualizer",
    "name": "EXPLAIN Plan Visualizer",
    "shortDescription": "Visualize PostgreSQL & MySQL EXPLAIN query execution plans with cost heatmaps.",
    "category": "Developer",
    "tags": [
      "Database",
      "SQL",
      "Postgres",
      "MySQL",
      "EXPLAIN",
      "Performance",
      "Visualizer"
    ],
    "seo": {
      "title": "EXPLAIN Plan Visualizer — PostgreSQL & MySQL Query Profiler | ToolMate",
      "description": "Visualize PostgreSQL and MySQL EXPLAIN execution plans. Identify slow sequential scans, high-cost joins, and query bottlenecks.",
      "keywords": [
        "explain visualizer",
        "postgres explain analyze visualizer",
        "mysql explain visualizer",
        "query plan profiler"
      ]
    },
    "persistence": {
      "persistInput": true,
      "persistSettings": true,
      "persistOutput": false
    }
  },
  {
    "slug": "json-diff",
    "name": "JSON Diff & Compare",
    "shortDescription": "Compare two JSON objects and see deep structural differences highlighted.",
    "category": "Developer",
    "tags": [
      "JSON",
      "Diff",
      "Compare",
      "Developer"
    ],
    "seo": {
      "title": "JSON Diff Tool — Compare Two JSON Objects Online | ToolMate",
      "description": "Compare two JSON documents with deep structural difference highlighting for added, removed, and modified keys.",
      "keywords": [
        "json diff",
        "compare json objects",
        "json comparison tool",
        "json difference finder"
      ]
    },
    "persistence": {
      "persistInput": true,
      "persistSettings": true,
      "persistOutput": true
    }
  }
];

export function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug);
}
