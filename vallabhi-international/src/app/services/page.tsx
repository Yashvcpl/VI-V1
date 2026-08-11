import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { serializeForClient } from "@/lib/serializeForClient";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("services");
  return buildMetadata({
    title: result?.page.seoTitle || "Services",
    description:
      result?.page.seoDescription ||
      "Explore Vallabhi International's lending products: MSME loans, loan against property, equipment and machinery finance, and affordable housing finance.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const result = await getPageWithSections("services");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
