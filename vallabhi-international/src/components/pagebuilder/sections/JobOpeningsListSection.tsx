import { listOpenJobs } from "@/lib/jobs";
import JobList from "@/components/jobs/JobList";

export async function JobOpeningsListSection({ data, isFirstOnPage }: { data: { heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const jobs = await listOpenJobs();

  return (
    <section className="py-16">
      <div className="container-content text-center">
        <Heading className="mx-auto w-fit text-center text-3xl font-bold">{data.heading ?? "Build Your Career With Us"}</Heading>
        <div className="mt-8">
          <JobList jobs={jobs} />
        </div>
      </div>
    </section>
  );
}
