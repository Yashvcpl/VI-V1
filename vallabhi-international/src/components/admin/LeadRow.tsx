"use client";

import { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { leads } from "@/lib/db/schema";

export type Lead = InferSelectModel<typeof leads>;

export function LeadRow({ lead }: { lead: Lead }) {
  const [removed, setRemoved] = useState(false);
  const [status, setStatus] = useState<string>(lead.status ?? "new");

  async function handleDelete() {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
    setRemoved(true);
  }

  async function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus);
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
  }

  if (removed) return null;

  return (
    <li className="rounded-card border border-ledger/10 bg-paper p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body font-medium text-ledger">
            {lead.fullName} <span className="font-mono text-xs text-ledger/40">· {lead.source}</span>
          </p>
          <p className="font-body text-sm text-ledger/60">{lead.email} · {lead.phone}</p>
          {lead.companyName && <p className="font-body text-sm text-ledger/60">{lead.companyName}</p>}
          {lead.subject && <p className="font-body text-sm text-ledger/60">Subject: {lead.subject}</p>}
          {(lead.loanType || lead.requestedAmount) && (
            <p className="font-body text-sm text-ledger/60">
              {[lead.loanType, lead.requestedAmount && `₹${lead.requestedAmount}`].filter(Boolean).join(" · ")}
            </p>
          )}
          {lead.message && <p className="mt-2 font-body text-sm text-ledger/80">{lead.message}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <time className="font-mono text-xs text-ledger/40">
            {lead.createdAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <label className="flex items-center gap-2 text-xs text-ledger/70">
            Status
            <select
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="rounded border border-ledger/15 px-2 py-1 text-xs"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <button type="button" onClick={handleDelete} className="font-body text-xs text-red-700 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
