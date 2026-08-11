import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug, listOpenJobs } from "@/lib/jobs";
import JobDetail from "@/components/jobs/JobDetail";
import { renderMarkdown } from "@/lib/markdown";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return {};
  return { title: job.seoTitle || job.title, description: job.seoDescription || job.summary };
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();

  // Render markdown fields to HTML for safe client rendering
  const prepared = {
    ...job,
    description: renderMarkdown(job.description),
    responsibilities: renderMarkdown(job.responsibilities),
    qualifications: renderMarkdown(job.qualifications),
    benefits: renderMarkdown(job.benefits),
  };

  return (
    <main>
      <div className="container-content py-12">
        <JobDetail job={prepared} />
      </div>
    </main>
  );
}
