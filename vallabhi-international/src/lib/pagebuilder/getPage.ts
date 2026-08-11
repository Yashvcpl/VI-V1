import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pages, pageSections } from "@/lib/db/schema";
import type { Page, PageSection } from "@/lib/db/schema";

export type SerializablePage = Omit<Page, "updatedAt"> & { updatedAt: string | null };

export function serializePageForClient(page: Page): SerializablePage {
  return {
    ...page,
    updatedAt: page.updatedAt?.toISOString() ?? null,
  };
}

export async function getPageWithSections(
  slug: string
): Promise<{ page: SerializablePage; sections: PageSection[] } | null> {
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1).catch(() => []);
  if (!page) return null;

  const sections = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageId, page.id))
    .orderBy(asc(pageSections.sortOrder))
    .catch(() => []);

  return { page: serializePageForClient(page), sections };
}
