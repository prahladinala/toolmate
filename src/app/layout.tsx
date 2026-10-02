import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/CommandPalette";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://toolmate.co.in"),
  applicationName: "ToolMate - Prahlad Inala",
  title: {
    default: "ToolMate - Prahlad Inala — Everyday tools, in one place",
    template: "%s | ToolMate - Prahlad Inala",
  },
  description:
    "ToolMate by Prahlad Inala provides fast, free, browser-based developer tools including JSON formatter, DNS lookup, UUID generator, CSS generators, and more.",
  keywords: [
    "ToolMate",
    "Prahlad Inala",
    "ToolMate Prahlad Inala",
    "Prahlad Inala tools",
    "toolmate online",
    "developer tools",
    "json formatter",
    "dns lookup",
    "uuid generator",
    "accessibility checker",
    "free online tools"
  ],
  openGraph: {
    title: "ToolMate - Prahlad Inala — Everyday tools, in one place",
    description: "Fast, free, browser-based developer tools by Prahlad Inala with privacy and efficiency in mind.",
    url: "https://toolmate.co.in",
    siteName: "ToolMate - Prahlad Inala",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://toolmate.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolMate - Prahlad Inala Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolMate - Prahlad Inala — Everyday tools, in one place",
    description: "Fast, free, browser-based developer tools by Prahlad Inala.",
    images: ["https://toolmate.co.in/og-image.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192x192.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ToolMate - Prahlad Inala",
    "alternateName": ["ToolMate", "Prahlad Inala Tools", "ToolMate App", "Tool Mate"],
    "url": "https://toolmate.co.in",
    "author": {
      "@type": "Person",
      "name": "Prahlad Inala",
      "url": "https://toolmate.co.in"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Prahlad Inala",
    "url": "https://toolmate.co.in",
    "jobTitle": "Creator & Lead Developer of ToolMate"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                const r = String(event.reason);
                if (r === '[object Event]' || r === '[object Object]' || r.includes('Monaco')) {
                  event.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className={`min-h-screen ${inter.className}`} suppressHydrationWarning>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <CommandPalette />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
