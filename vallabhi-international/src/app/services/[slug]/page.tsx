import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema } from "@/lib/json-ld";
import { getServiceBySlug, getServiceSlugs } from "@/lib/services";
import { ServiceDetailPageContent } from "@/components/services/ServiceDetailPageContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const rows = await getServiceSlugs();
  return rows.map((s: { slug: string }) => ({ slug: s.slug }));
}

async function getService(slug: string) {
  return await getServiceBySlug(slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) {
    return buildMetadata({ title: "Service", description: "Vallabhi International lending services.", path: `/services/${params.slug}`, index: false });
  }
  return buildMetadata({
    title: service.seoTitle || service.title,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />

      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.seoDescription,
          path: `/services/${service.slug}`,
        })}
      />

      <ServiceDetailPageContent service={service} />
    </>
  );
}
