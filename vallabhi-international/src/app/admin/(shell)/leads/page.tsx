import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { LeadManagementClient } from "@/components/admin/LeadManagementClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).catch(() => []);

  return (
    <div>
      <h1 className="text-2xl">Contact Enquiries</h1>
      <p className="mt-2 font-body text-ledger/70">
        Every submission from the Contact Us, Loan Eligibility, and Careers forms lands here.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 font-body text-ledger/60">No submissions yet.</p>
      ) : (
        <LeadManagementClient rows={rows} />
      )}
    </div>
  );
}
