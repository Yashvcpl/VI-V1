import React from "react";
import { JobCard } from "./JobCard";

export function JobList({ jobs }: { jobs: any[] }) {
  if (!jobs || jobs.length === 0) {
    return <p className="mt-6 font-body text-ledger/60">There are currently no openings.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 md:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default JobList;
