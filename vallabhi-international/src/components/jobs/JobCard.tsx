import Link from "next/link";
import React from "react";

export function JobCard({ job }: { job: any }) {
  return (
    <article className="flex h-full w-full max-w-[320px] flex-col rounded-[20px] border border-ledger/10 p-5 text-left shadow-sm">
      <h3 className="text-base font-semibold">{job.title}</h3>
      <p className="mt-1 text-sm text-ledger/60">{[job.department, job.location, job.employmentType].filter(Boolean).join(' · ')}</p>
      {job.summary ? <p className="mt-3 text-sm text-ledger/70">{job.summary}</p> : null}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <Link href={`/careers/${encodeURIComponent(String(job.slug))}`} className="text-sm font-medium text-growth-700 hover:underline">View Details</Link>
        {job.isOpen ? (
          <span className="rounded-full bg-growth/10 px-3 py-1 text-sm font-semibold text-growth-700">Open</span>
        ) : (
          <span className="rounded-full bg-ledger/10 px-3 py-1 text-sm font-medium text-ledger/70">Closed</span>
        )}
      </div>
    </article>
  );
}

export default JobCard;
