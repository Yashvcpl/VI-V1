import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { serializeForClient } from "@/lib/serializeForClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("careers");
  return buildMetadata({
    title: result?.page.seoTitle || "Careers",
    description: result?.page.seoDescription || "Join Vallabhi International - explore open roles and build a career closing India's MSME credit gap.",
    path: "/careers",
  });
}

export default async function CareersPage() {
  const result = await getPageWithSections("careers");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Careers", path: "/careers" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
