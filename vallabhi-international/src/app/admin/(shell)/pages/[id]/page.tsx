import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pages, pageSections } from "@/lib/db/schema";
import { PageBuilder } from "@/components/admin/PageBuilder";
import { serializePageForClient } from "@/lib/pagebuilder/getPage";
import { serializeForClient } from "@/lib/serializeForClient";

export const dynamic = "force-dynamic";

export default async function AdminPageBuilderPage({ params }: { params: { id: string } }) {
  const pageId = Number(params.id);
  const [page] = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  if (!page) notFound();

  const sections = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId))
    .orderBy(asc(pageSections.sortOrder));

  return <PageBuilder page={serializePageForClient(page)} initialSections={serializeForClient(sections) as typeof sections} />;
}
