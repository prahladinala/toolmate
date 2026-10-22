import { TOOLS, ToolDef } from "./registry";

export interface ToolSeoData {
  overview: string;
  howTo: { step: number; title: string; text: string }[];
  features: { title: string; text: string }[];
  useCases: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
}

export function getToolSeoData(tool: ToolDef): ToolSeoData {
  const isConverter =
    tool.category === "Converters" ||
    tool.slug.includes("to-") ||
    tool.slug.includes("converter");
  const isGenerator =
    tool.category === "Generators" || tool.slug.includes("generator");
  const isSecurity =
    tool.category === "Security" ||
    tool.slug.includes("hash") ||
    tool.slug.includes("key") ||
    tool.slug.includes("password");
  const isPdf = tool.category === "PDF" || tool.slug.includes("pdf");
  const isImage =
    tool.category === "Images" ||
    tool.slug.includes("image") ||
    tool.slug.includes("png") ||
    tool.slug.includes("webp") ||
    tool.slug.includes("svg");
  const isDesign =
    tool.category === "Design" ||
    tool.slug.includes("css") ||
    tool.slug.includes("color") ||
    tool.slug.includes("contrast");

  // Dynamic Overview
  let overview = `${tool.name} is a fast, free, browser-based online utility designed to help developers, designers, and tech professionals streamline their workflows. Built with a local-first architecture, it processes your input instantly inside your browser without uploading your sensitive data to external servers.`;
  if (isConverter) {
    overview = `${tool.name} provides instant, bidirectional conversion with precision and syntax validation. Convert code, documents, or data structures directly in your browser with zero latency and full privacy.`;
  } else if (isGenerator) {
    overview = `Generate production-ready configurations, code snippets, or assets in seconds with ${tool.name}. Customize parameters with an interactive UI and copy or download the results immediately.`;
  } else if (isPdf) {
    overview = `${tool.name} offers fast, browser-powered PDF manipulation. Reorder, split, rotate, or transform PDF documents locally with WebAssembly—your confidential documents never leave your device.`;
  } else if (isImage) {
    overview = `${tool.name} delivers client-side image transformation, optimization, and conversion. Process images with lightning speed directly in your browser using modern Canvas and WebAssembly engines.`;
  } else if (isSecurity) {
    overview = `${tool.name} utilizes the standard Web Cryptography API to generate secure keys, hashes, or credentials locally. Eliminate security risks with zero server transmission or logging.`;
  }

  // Dynamic How-To Steps
  let howTo = [
    {
      step: 1,
      title: "Input or Paste Your Data",
      text: `Enter, paste, or upload your source data into the editor or input field provided above for ${tool.name}.`,
    },
    {
      step: 2,
      title: "Customize Options & Settings",
      text: `Select your desired configuration options, formatting preferences, or parameters. The tool updates and validates in real-time.`,
    },
    {
      step: 3,
      title: "Copy or Download the Result",
      text: `Once the output is generated, use the one-click copy button to save the result to your clipboard or download it directly.`,
    },
  ];

  if (isPdf) {
    howTo = [
      {
        step: 1,
        title: "Select or Drag & Drop PDF",
        text: `Choose your PDF file from your device or drag and drop it into the secure upload area above.`,
      },
      {
        step: 2,
        title: "Configure Pages & Options",
        text: `Preview thumbnails, select page ranges, rearrange pages, or adjust transformation settings.`,
      },
      {
        step: 3,
        title: "Process & Save PDF",
        text: `Click the process button to generate your modified PDF locally, then download the finalized file instantly.`,
      },
    ];
  } else if (isImage) {
    howTo = [
      {
        step: 1,
        title: "Upload Your Image",
        text: `Select an image file from your computer or mobile device. Supported formats include PNG, JPG, WebP, SVG, and more.`,
      },
      {
        step: 2,
        title: "Adjust Image Settings",
        text: `Fine-tune quality, dimensions, blur radius, or conversion formats with real-time visual feedback.`,
      },
      {
        step: 3,
        title: "Export Optimized Image",
        text: `Download your processed image in high quality without any compression artifacts or watermarks.`,
      },
    ];
  }

  // Key Features
  const features = [
    {
      title: "100% Client-Side Privacy",
      text: isPdf || isImage
        ? "Your files never leave your computer. Processing runs entirely in browser memory with zero server uploads."
        : isSecurity
        ? "Cryptographic calculations run locally using window.crypto. No passwords or secret keys are ever transmitted."
        : "All data transformations occur locally in your browser. No server roundtrips, logging, or third-party tracking.",
    },
    {
      title: "Instant Real-Time Execution",
      text: "Eliminate wait times and server queues. Calculations, conversions, and rendering happen instantaneously.",
    },
    {
      title: "Mobile-First & Accessible",
      text: "Engineered with responsive design, keyboard shortcuts, high-contrast themes, and full WCAG compliance.",
    },
    {
      title: "Zero Setup & Completely Free",
      text: "No account registration, no credit cards, and no usage caps. Access the full suite of developer tools anytime.",
    },
  ];

  // Practical Use Cases
  let useCases = [
    {
      title: "Software Engineering & Debugging",
      text: `Inspect payloads, validate syntax errors, and quickly reformat messy code or logs during active development.`,
    },
    {
      title: "API & Backend Integration",
      text: `Prepare clean data structures, verify response payloads, and generate standard configurations effortlessly.`,
    },
    {
      title: "Rapid Prototyping",
      text: `Speed up build iterations by generating assets and formatting inputs without opening heavyweight IDEs or CLI tools.`,
    },
  ];

  if (isDesign) {
    useCases = [
      {
        title: "Web & UI Design",
        text: `Generate accessible color palettes, check WCAG compliance ratios, and export clean CSS declarations.`,
      },
      {
        title: "Design System Maintenance",
        text: `Standardize styling tokens, test component contrast ratios, and verify layout properties across viewports.`,
      },
      {
        title: "Frontend Prototyping",
        text: `Rapidly test CSS effects, box shadows, gradients, and typography directly in the browser.`,
      },
    ];
  } else if (isPdf || isImage) {
    useCases = [
      {
        title: "Document & Media Preparation",
        text: `Prepare lightweight, web-optimized assets and clean documents for publishing, emailing, or archiving.`,
      },
      {
        title: "Privacy-Sensitive Processing",
        text: `Safely manipulate confidential business documents, contracts, or personal photos without third-party cloud risks.`,
      },
      {
        title: "Cross-Platform Workflow",
        text: `Quickly convert and optimize media on Chromebooks, tablets, or restricted developer workstations.`,
      },
    ];
  }

  // FAQs
  const faqs = [
    {
      question: `Is my data private and secure when using ${tool.name}?`,
      answer: isPdf || isImage
        ? `Yes, completely secure. All file processing, rendering, and conversion happen locally on your device using client-side WebAssembly and HTML5 Canvas. Your documents and photos are never uploaded to any remote server.`
        : isSecurity
        ? `Your cryptographic keys, hashes, and credentials are generated locally using the standard Web Cryptography API (window.crypto). No keys or sensitive data are ever logged, transmitted, or saved.`
        : `Yes, 100%. ToolMate processes your data entirely within your web browser using client-side JavaScript. None of your input code, text, or data structures are sent to remote servers or stored in any database. Your privacy is guaranteed.`,
    },
    {
      question: `How does ${tool.name} work?`,
      answer: `ToolMate's ${tool.name} leverages modern browser APIs and optimized client-side processing algorithms. It parses your input in real time, applies necessary validations or transformations, and outputs the result with zero latency and zero server dependencies.`,
    },
    {
      question: `Can I use ${tool.name} offline or on mobile devices?`,
      answer: `Yes. ToolMate is responsive and functions as a Progressive Web App (PWA). Once loaded in your browser, you can access and run the tool seamlessly on desktop, tablet, or smartphone even with intermittent or zero internet connectivity.`,
    },
    {
      question: `Is ${tool.name} completely free to use?`,
      answer: `Yes, ${tool.name} is completely free with no usage limits, hidden subscriptions, or account requirements. You can format, convert, or generate output as many times as you need.`,
    },
    {
      question: `Do I need to install any browser extensions or software?`,
      answer: `No software installation or plugins are required. ${tool.name} runs out of the box in any modern browser including Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, and Brave.`,
    },
  ];

  return {
    overview,
    howTo,
    features,
    useCases,
    faqs,
  };
}

export function getRelatedTools(currentTool: ToolDef, limit = 6): ToolDef[] {
  const currentTags = new Set(
    (currentTool.tags || []).map((t) => t.toLowerCase())
  );

  const scored = TOOLS.filter((t) => t.slug !== currentTool.slug)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === currentTool.category) {
        score += 5;
      }
      const candidateTags = (candidate.tags || []).map((t) => t.toLowerCase());
      for (const tag of candidateTags) {
        if (currentTags.has(tag)) {
          score += 2;
        }
      }
      return { tool: candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));

  return scored.slice(0, limit).map((s) => s.tool);
}

export function getApplicationCategory(category: string): string {
  switch (category) {
    case "Developer":
      return "DeveloperApplication";
    case "Design":
      return "DesignApplication";
    case "Converters":
    case "Generators":
      return "UtilitiesApplication";
    case "Security":
      return "SecurityApplication";
    case "Information":
      return "ReferenceApplication";
    case "Images":
      return "MultimediaApplication";
    case "PDF":
      return "BusinessApplication";
    default:
      return "UtilitiesApplication";
  }
}
