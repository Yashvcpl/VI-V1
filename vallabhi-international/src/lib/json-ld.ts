import { SITE_URL } from "@/lib/seo";

/**
 * Renders as <script type="application/ld+json">. Use via the <JsonLd> component
 * in src/components/JsonLd.tsx rather than dumping raw <script> tags in pages.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Vallabhi Capital Private Limited",
    alternateName: "Vallabhi International",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    description:
      "RBI-registered NBFC providing MSME loans, loan against property, and equipment finance to businesses across India.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "SF-4C, Second Floor, Rishabh Ipex Mall, Patparganj, IP Extension",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      postalCode: "110092",
      addressCountry: "IN",
    },
    sameAs: [
      // TODO: confirm and fill official social profile URLs before launch
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function articleSchema(args: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    mainEntityOfPage: `${SITE_URL}${args.path}`,
    datePublished: args.publishedAt,
    dateModified: args.updatedAt ?? args.publishedAt,
    author: { "@type": "Person", name: args.authorName },
    publisher: {
      "@type": "Organization",
      name: "Vallabhi International",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.jpg` },
    },
    image: args.imageUrl ? [args.imageUrl] : undefined,
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: args.name,
    name: args.name,
    description: args.description,
    url: `${SITE_URL}${args.path}`,
    provider: {
      "@type": "FinancialService",
      name: "Vallabhi Capital Private Limited",
      url: SITE_URL,
    },
    areaServed: "IN",
  };
}
