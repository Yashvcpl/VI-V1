import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { sendLeadNotificationEmail } from "@/lib/email";
import { leadFormRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Strip anything that isn't plain text before it ever touches the DB or an
// email body - defence in depth even though Drizzle already parameterizes queries.
function sanitize(value: string): string {
  return value
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[\r\n]{3,}/g, "\n\n") // collapse excessive newlines
    .trim()
    .slice(0, 5000);
}

const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number"),
  companyName: z.string().trim().max(200).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  source: z.enum(["contact-us", "loan-eligibility", "careers"]),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  loanType: z.string().trim().max(100).optional().or(z.literal("")),
  requestedAmount: z.string().trim().max(50).optional().or(z.literal("")),
  // Honeypot field: real users never see or fill this (hidden via CSS in the form
  // component). Any non-empty value here means a bot filled every field it found.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped -> pretend success so the bot doesn't learn to adapt, but
  // never write it to the DB or send an email.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (leadFormRateLimit) {
    const { success } = await leadFormRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }
  }

  const newLead = {
    fullName: sanitize(data.fullName),
    email: sanitize(data.email),
    phone: sanitize(data.phone),
    companyName: data.companyName ? sanitize(data.companyName) : null,
    subject: data.subject ? sanitize(data.subject) : null,
    source: data.source,
    message: data.message ? sanitize(data.message) : null,
    loanType: data.loanType ? sanitize(data.loanType) : null,
    requestedAmount: data.requestedAmount ? sanitize(data.requestedAmount) : null,
    ipAddress: ip,
    userAgent: request.headers.get("user-agent") ?? null,
    isSpam: false,
  };

  try {
    await db.insert(leads).values(newLead);
  } catch (error) {
    console.error("Failed to store lead:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again shortly." },
      { status: 500 }
    );
  }

  // Email failure should never fail the user-facing request - the lead is already
  // safely stored. Log it for ops to notice and follow up manually if needed.
  try {
    await sendLeadNotificationEmail(newLead);
  } catch (error) {
    console.error("Lead stored, but notification email failed:", error);
  }

  return NextResponse.json({ ok: true });
}
