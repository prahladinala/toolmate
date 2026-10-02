export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ToolMate",
    description: "Everyday developer tools, in one place.",
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
    name: "ToolMate",
    url: "https://toolmate.co.in",
    logo: "https://toolmate.co.in/icon-512x512.png",
    sameAs: []
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
