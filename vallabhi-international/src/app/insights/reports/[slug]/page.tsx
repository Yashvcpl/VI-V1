import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { db } from "@/lib/db/client";
import { reports as reportsTable } from "@/lib/db/schema";

export const revalidate = 1800;

export async function generateStaticParams() {
  const rows: Array<{ slug: string }> = await db
    .select({ slug: reportsTable.slug })
    .from(reportsTable)
    .catch(() => [] as Array<{ slug: string }>);
  return rows.map((r) => ({ slug: r.slug }));
}

async function getReport(slug: string) {
  const [row] = await db.select().from(reportsTable).where(eq(reportsTable.slug, slug)).limit(1).catch(() => []);
  return row ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const report = await getReport(params.slug);
  if (!report) {
    return buildMetadata({ title: "Report", description: "Vallabhi International reports.", path: `/insights/reports/${params.slug}`, index: false });
  }
  return buildMetadata({
    title: report.title,
    description: report.seoDescription || report.summary,
    path: `/insights/reports/${report.slug}`,
  });
}

export default async function ReportDetailPage({ params }: { params: { slug: string } }) {
  const report = await getReport(params.slug);
  if (!report) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Insights", path: "/insights/reports" },
          { name: "Reports", path: "/insights/reports" },
          { name: report.title, path: `/insights/reports/${report.slug}` },
        ]}
      />

      <article className="py-16">
        <div className="container-content max-w-2xl">
          <h1 className="text-4xl">{report.title}</h1>
          <p className="mt-4 font-body text-lg text-ledger/80">{report.summary}</p>

          {report.pdfUrl ? (
            <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex">
              Download PDF
            </a>
          ) : (
            <p className="mt-8 font-body text-sm text-ledger/50">PDF not yet uploaded.</p>
          )}
        </div>
      </article>
    </>
  );
}
