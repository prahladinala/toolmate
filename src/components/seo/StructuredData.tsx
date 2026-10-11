export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ToolMate - Prahlad Inala",
    alternateName: ["ToolMate", "ToolMate Tools", "Prahlad Inala Tools"],
    description: "Everyday developer tools, in one place. Fast, free, browser-based utilities.",
    url: "https://toolmate.co.in",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolMate - Prahlad Inala",
    url: "https://toolmate.co.in",
    logo: "https://toolmate.co.in/icon-512x512.png",
    sameAs: [
      "https://resume.toolmate.co.in",
      "https://ui.toolmate.co.in"
    ],
    hasPart: [
      {
        "@type": "WebApplication",
        name: "ToolMate Resume — Free ATS Resume Builder",
        url: "https://resume.toolmate.co.in",
        description: "Free, privacy-first developer and professional resume builder with live preview and PDF download.",
        applicationCategory: "BusinessApplication"
      },
      {
        "@type": "WebApplication",
        name: "ToolMate UI — Modern Component Library",
        url: "https://ui.toolmate.co.in",
        description: "Modern, copy-paste React and Tailwind CSS UI components and design system for modern web apps.",
        applicationCategory: "DeveloperApplication"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd),
        }}
      />
    </>
  );
}
