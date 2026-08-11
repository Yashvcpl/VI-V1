import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/services";
import { db } from "@/lib/db/client";
import { blogPosts, newsItems, reports } from "@/lib/db/schema";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceRows, blogRows, newsRows, reportRows]: [
    Array<{ slug: string }>,
    Array<{ slug: string }>,
    Array<{ slug: string }>,
    Array<{ slug: string }>
  ] = await Promise.all([
    getServiceSlugs(),
    db ? db.select({ slug: blogPosts.slug }).from(blogPosts).catch(() => [] as Array<{ slug: string }>) : Promise.resolve([] as Array<{ slug: string }>),
    db ? db.select({ slug: newsItems.slug }).from(newsItems).catch(() => [] as Array<{ slug: string }>) : Promise.resolve([] as Array<{ slug: string }>),
    db ? db.select({ slug: reports.slug }).from(reports).catch(() => [] as Array<{ slug: string }>) : Promise.resolve([] as Array<{ slug: string }>),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/insights/blogs`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/insights/news`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/insights/reports`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/careers`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...serviceRows.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...blogRows.map((b) => ({ url: `${SITE_URL}/insights/blogs/${b.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...newsRows.map((n) => ({ url: `${SITE_URL}/insights/news/${n.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
    ...reportRows.map((r) => ({ url: `${SITE_URL}/insights/reports/${r.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
