import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vallabhiinternational.com";
const SITE_NAME = "Vallabhi International";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.jpg`;

interface BuildMetadataArgs {
  /** Page-specific title. Rendered as "{title} | Vallabhi International". */
  title: string;
  /** Page-specific meta description, ideally sourced from CMS/DB content. */
  description: string;
  /** Path starting with "/", e.g. "/services/msme-loans". Used for canonical + OG url. */
  path: string;
  /** Absolute OG image URL, if the page/CMS entry has one. Falls back to a site default. */
  ogImage?: string;
  /** Set false for pages that should not be indexed (e.g. thank-you pages). */
  index?: boolean;
}

/**
 * Every route on the site should call this and pass through CMS/DB-sourced
 * title + description so no two pages ever share a <title>/<meta description>.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  index = true,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export { SITE_URL, SITE_NAME };
