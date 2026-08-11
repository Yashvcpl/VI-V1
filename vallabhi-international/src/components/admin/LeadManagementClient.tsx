"use client";

import { useMemo, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { leads } from "@/lib/db/schema";
import { LeadRow } from "@/components/admin/LeadRow";

export type Lead = InferSelectModel<typeof leads>;

export function LeadManagementClient({ rows }: { rows: Lead[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((lead) => {
      const matchesQuery = !q || [lead.fullName, lead.email, lead.phone, lead.companyName, lead.subject, lead.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesStatus = statusFilter === "all" || (lead.status ?? "new") === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      return matchesQuery && matchesStatus && matchesSource;
    });
  }, [query, rows, sourceFilter, statusFilter]);

  function exportCsv() {
    const headers = ["id", "fullName", "email", "phone", "companyName", "subject", "source", "status", "message", "createdAt"];
    const csvRows = [headers.join(",")];
    filteredRows.forEach((lead) => {
      const values = headers.map((header) => {
        const value = (lead as Record<string, unknown>)[header] ?? "";
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "contact-enquiries.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 rounded-card border border-ledger/10 bg-paper p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search enquiries"
            className="w-full rounded border border-ledger/15 px-3 py-2 font-body text-sm md:max-w-xs"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded border border-ledger/15 px-3 py-2 font-body text-sm">
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="rounded border border-ledger/15 px-3 py-2 font-body text-sm">
            <option value="all">All sources</option>
            <option value="contact-us">Contact Us</option>
            <option value="loan-eligibility">Loan Eligibility</option>
            <option value="careers">Careers</option>
          </select>
        </div>
        <button type="button" onClick={exportCsv} className="btn-primary self-start md:self-auto">
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="font-body text-sm text-ledger/70">Showing {filteredRows.length} of {rows.length} enquiries</p>
      </div>

      {filteredRows.length === 0 ? (
        <p className="mt-6 font-body text-ledger/60">No matching submissions.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {filteredRows.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </ul>
      )}
    </div>
  );
}
