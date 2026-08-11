"use client";
import React, { useState } from "react";

export function ApplicationForm({ jobId }: { jobId: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("jobId", String(jobId));

    try {
      // If resume file present, upload it first via admin upload
      const resume = fd.get("resume") as File | null;
      if (resume && resume.size) {
        const upFd = new FormData();
        upFd.append("file", resume);
        upFd.append("folder", "resumes");
        const r = await fetch("/api/admin/upload", { method: "POST", body: upFd });
        const data = await r.json();
        if (data?.url) {
          fd.set("resumeUrl", data.url);
        }
      }

      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        setMessage("Application submitted — thank you!");
        form.reset();
      } else {
        setMessage(json?.error || "Submission failed");
      }
    } catch (err) {
      setMessage("Submission failed — check your connection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
      <input name="fullName" required placeholder="Full name" className="rounded-card border px-3 py-2" />
      <input name="email" type="email" required placeholder="Email" className="rounded-card border px-3 py-2" />
      <input name="phone" placeholder="Phone" className="rounded-card border px-3 py-2" />
      <input name="currentLocation" placeholder="Current location" className="rounded-card border px-3 py-2" />
      <input name="linkedinUrl" placeholder="LinkedIn profile (optional)" className="rounded-card border px-3 py-2" />
      <input name="portfolioUrl" placeholder="Portfolio URL (optional)" className="rounded-card border px-3 py-2" />
      <label className="text-sm">Resume (PDF/DOC/DOCX)</label>
      <input name="resume" type="file" accept=".pdf,.doc,.docx,application/pdf" required className="" />
      <textarea name="coverLetter" placeholder="Cover letter / message" rows={5} className="rounded-card border px-3 py-2" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary rounded-full px-4 py-2">
          {loading ? "Sending…" : "Submit Application"}
        </button>
        {message ? <p className="text-sm text-ledger/60">{message}</p> : null}
      </div>
    </form>
  );
}

export default ApplicationForm;
