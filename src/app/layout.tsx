import "./globals.css";
import { ThemeProvider } from "@/features/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolmate.co.in"),
  title: {
    default: "ToolMate — Everyday tools, in one place",
    template: "%s | ToolMate",
  },
  description:
    "ToolMate provides fast, browser-based developer tools including JSON formatter, DNS lookup, UUID generator and more.",
  keywords: [
    "developer tools",
    "json formatter",
    "dns lookup",
    "uuid generator",
    "accessibility checker",
  ],
  openGraph: {
    title: "ToolMate",
    description: "Everyday tools, in one place.",
    url: "https://toolmate.co.in",
    siteName: "ToolMate",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://toolmate.co.in/favicon.ico",
        width: 64,
        height: 64,
        alt: "ToolMate Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolMate",
    description: "Everyday tools, in one place.",
    images: ["https://toolmate.co.in/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
