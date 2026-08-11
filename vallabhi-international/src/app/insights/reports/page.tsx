import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { serializeForClient } from "@/lib/serializeForClient";

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("insights-reports");
  return buildMetadata({
    title: result?.page.seoTitle || "Reports",
    description: result?.page.seoDescription || "Download research reports and disclosures published by Vallabhi International.",
    path: "/insights/reports",
  });
}

export default async function ReportsListingPage() {
  const result = await getPageWithSections("insights-reports");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Insights", path: "/insights/reports" }, { name: "Reports", path: "/insights/reports" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
