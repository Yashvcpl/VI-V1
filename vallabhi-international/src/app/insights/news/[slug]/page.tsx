import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/json-ld";
import { renderMarkdown } from "@/lib/markdown";
import { db } from "@/lib/db/client";
import { newsItems as newsItemsTable } from "@/lib/db/schema";

export const revalidate = 1800;

export async function generateStaticParams() {
  const rows: Array<{ slug: string }> = await db
    .select({ slug: newsItemsTable.slug })
    .from(newsItemsTable)
    .catch(() => [] as Array<{ slug: string }>);
  return rows.map((r) => ({ slug: r.slug }));
}

async function getNewsItem(slug: string) {
  const [row] = await db.select().from(newsItemsTable).where(eq(newsItemsTable.slug, slug)).limit(1).catch(() => []);
  return row ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await getNewsItem(params.slug);
  if (!item) {
    return buildMetadata({ title: "News", description: "Vallabhi International news.", path: `/insights/news/${params.slug}`, index: false });
  }
  return buildMetadata({
    title: item.title,
    description: item.seoDescription || item.summary,
    path: `/insights/news/${item.slug}`,
  });
}

export default async function NewsItemPage({ params }: { params: { slug: string } }) {
  const item = await getNewsItem(params.slug);
  if (!item) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Insights", path: "/insights/news" },
          { name: "News", path: "/insights/news" },
          { name: item.title, path: `/insights/news/${item.slug}` },
        ]}
      />

      <JsonLd
        data={articleSchema({
          title: item.title,
          description: item.seoDescription || item.summary,
          path: `/insights/news/${item.slug}`,
          publishedAt: item.publishedAt.toISOString(),
          authorName: "Vallabhi International",
        })}
      />

      <article className="py-16">
        <div className="container-content max-w-3xl">
          <time dateTime={item.publishedAt.toISOString()} className="font-mono text-xs text-ledger/50">
            {item.publishedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <h1 className="mt-3 text-4xl">{item.title}</h1>
          <p className="mt-4 font-body text-lg text-ledger/80">{item.summary}</p>

          {item.body && (
            <div
              className="prose-ledger mt-10 font-body text-ledger/85"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body) }}
            />
          )}

          {item.externalSourceUrl && (
            <p className="mt-8 font-body text-sm text-ledger/60">
              Originally covered at{" "}
              <a href={item.externalSourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-growth-700">
                the original source
              </a>
              .
            </p>
          )}
        </div>
      </article>
    </>
  );
}
