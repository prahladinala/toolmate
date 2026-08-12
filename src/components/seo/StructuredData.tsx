export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ToolMate",
    url: "https://toolmate.co.in",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolMate",
    url: "https://toolmate.co.in",
    logo: "https://toolmate.co.in/favicon.ico",
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
