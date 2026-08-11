import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { jobApplications } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form" }, { status: 400 });

  const jobId = Number(form.get("jobId"));
  const fullName = String(form.get("fullName") ?? "");
  const email = String(form.get("email") ?? "");
  if (!jobId || !fullName || !email) return NextResponse.json({ error: "Missing required fields" }, { status: 422 });

  const resumeUrl = String(form.get("resumeUrl") ?? "");
  if (!resumeUrl) return NextResponse.json({ error: "Resume is required" }, { status: 422 });

  const record = {
    jobId,
    fullName,
    email,
    phone: String(form.get("phone") ?? ""),
    currentLocation: String(form.get("currentLocation") ?? ""),
    linkedinUrl: String(form.get("linkedinUrl") ?? ""),
    portfolioUrl: String(form.get("portfolioUrl") ?? ""),
    coverLetter: String(form.get("coverLetter") ?? ""),
    resumeUrl,
    status: "new",
  };

  try {
    const [row] = await db.insert(jobApplications).values(record).returning();
    return NextResponse.json({ ok: true, row }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }
}
