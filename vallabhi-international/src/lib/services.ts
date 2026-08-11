import { asc, eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { services, type Service } from "@/lib/db/schema";

export type ServiceSummary = {
  title: string;
  slug: string;
  summary: string;
  iconUrl: string | null;
};

export async function getAllServices(): Promise<ServiceSummary[]> {
  if (!db) return [];

  return await db
    .select({
      title: services.title,
      slug: services.slug,
      summary: services.summary,
      iconUrl: services.iconUrl,
    })
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder))
    .catch(() => []);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!db) return null;

  const normalizedSlug = decodeURIComponent(slug);

  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.slug, slug), eq(services.published, true)))
    .limit(1)
    .catch(() => []);

  if (service) return service;

  if (normalizedSlug !== slug) {
    const [decodedService] = await db
      .select()
      .from(services)
      .where(and(eq(services.slug, normalizedSlug), eq(services.published, true)))
      .limit(1)
      .catch(() => []);
    return decodedService ?? null;
  }

  return null;
}

export async function getServiceSlugs(): Promise<Array<{ slug: string }>> {
  if (!db) return [];

  return await db
    .select({ slug: services.slug })
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder))
    .catch(() => []);
}
