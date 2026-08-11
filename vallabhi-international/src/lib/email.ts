import { Resend } from "resend";
import type { NewLead } from "@/lib/db/schema";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendLeadNotificationEmail(lead: NewLead) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY not set - skipping lead notification email. " +
        "Configure it before production deploy."
    );
    return;
  }

  const to = process.env.LEAD_NOTIFICATION_TO_EMAIL;
  const from = process.env.LEAD_NOTIFICATION_FROM_EMAIL;

  if (!to || !from) {
    console.warn("LEAD_NOTIFICATION_TO_EMAIL / FROM_EMAIL not set - skipping email.");
    return;
  }

  await resend.emails.send({
    to,
    from,
    subject: `New ${lead.source} enquiry - ${lead.fullName}`,
    // Plain text is enough for an internal ops notification; kept deliberately
    // simple rather than a styled template, since this is not a marketing email.
    text: [
      `New enquiry received via ${lead.source}`,
      "",
      `Name: ${lead.fullName}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone}`,
      lead.companyName ? `Company: ${lead.companyName}` : null,
      lead.loanType ? `Loan type: ${lead.loanType}` : null,
      lead.requestedAmount ? `Requested amount: ${lead.requestedAmount}` : null,
      lead.message ? `\nMessage:\n${lead.message}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
