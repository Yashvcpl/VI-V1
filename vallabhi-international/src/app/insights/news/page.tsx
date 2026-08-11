import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { serializeForClient } from "@/lib/serializeForClient";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("insights-news");
  return buildMetadata({
    title: result?.page.seoTitle || "News",
    description: result?.page.seoDescription || "Company announcements and press coverage for Vallabhi International and Vallabhi Capital.",
    path: "/insights/news",
  });
}

export default async function NewsListingPage() {
  const result = await getPageWithSections("insights-news");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Insights", path: "/insights/news" }, { name: "News", path: "/insights/news" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
