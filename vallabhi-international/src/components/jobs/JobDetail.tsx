"use client";
import React from "react";
import { ApplicationForm } from "./ApplicationForm";

export function JobDetail({ job }: { job: any }) {
  return (
    <div className="space-y-8">
      <div className="rounded-card border p-6">
        <h1 className="text-2xl font-semibold">{job.title}</h1>
        <p className="mt-2 text-sm text-ledger/60">{[job.department, job.location, job.employmentType, job.experience].filter(Boolean).join(' · ')}</p>
        {job.salary ? <p className="mt-2 font-medium">Salary: {job.salary}</p> : null}
        {job.description ? <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} /> : null}
        {job.responsibilities ? <div className="mt-4"><h3 className="text-lg font-semibold">Roles & Responsibilities</h3><div className="prose" dangerouslySetInnerHTML={{ __html: job.responsibilities }} /></div> : null}
        {job.skills ? <div className="mt-4"><h3 className="text-lg font-semibold">Required Skills</h3><p className="prose">{job.skills}</p></div> : null}
        {job.qualifications ? <div className="mt-4"><h3 className="text-lg font-semibold">Qualifications</h3><div className="prose" dangerouslySetInnerHTML={{ __html: job.qualifications }} /></div> : null}
        {job.benefits ? <div className="mt-4"><h3 className="text-lg font-semibold">Benefits</h3><div className="prose" dangerouslySetInnerHTML={{ __html: job.benefits }} /></div> : null}
      </div>

      <div className="rounded-card border p-6">
        <h2 className="text-xl font-semibold">Apply for this Position</h2>
        <ApplicationForm jobId={job.id} />
      </div>
    </div>
  );
}

export default JobDetail;
