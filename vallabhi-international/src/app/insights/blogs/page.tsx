import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { serializeForClient } from "@/lib/serializeForClient";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("insights-blogs");
  return buildMetadata({
    title: result?.page.seoTitle || "Blogs",
    description: result?.page.seoDescription || "Perspectives on MSME lending, financial inclusion and small business growth from the Vallabhi International team.",
    path: "/insights/blogs",
  });
}

export default async function BlogsListingPage() {
  const result = await getPageWithSections("insights-blogs");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Insights", path: "/insights/blogs" }, { name: "Blogs", path: "/insights/blogs" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
