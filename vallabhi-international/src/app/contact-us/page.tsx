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
  const result = await getPageWithSections("contact-us");
  return buildMetadata({
    title: result?.page.seoTitle || "Contact Us",
    description: result?.page.seoDescription || "Get in touch with Vallabhi International for MSME loans, loan against property, equipment finance and general enquiries.",
    path: "/contact-us",
  });
}

export default async function ContactUsPage() {
  const result = await getPageWithSections("contact-us");
  if (!result) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Contact Us", path: "/contact-us" }]} />
      <PageRenderer sections={serializeForClient(result.sections)} />
    </>
  );
}
