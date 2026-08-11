import Link from "next/link";
import { entities } from "@/lib/admin/entities";

const QUICK_LINKS = [
  { key: "pages", label: "Pages", description: "Create and manage landing pages and section content", href: "/admin/pages" },
  { key: "media", label: "Media Library", description: "Upload and reuse images, PDFs, and other branded assets", href: "/admin/media" },
  { key: "forms", label: "Forms", description: "Review inquiries, applications, and lead submissions", href: "/admin/leads" },
  { key: "users", label: "Users & Roles", description: "Manage admin access and permissions", href: "/admin/users" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-ledger/10 bg-paper p-6 shadow-[0_18px_60px_-36px_rgba(16,48,80,0.28)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-ledger">Welcome back to your content workspace</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ledger/70">
              Keep your pages, services, media, and submissions organised in one calm, distraction-free place.
            </p>
          </div>
          <div className="rounded-2xl border border-growth/20 bg-growth/5 px-4 py-3 text-sm text-ledger/80">
            <p className="font-semibold text-growth-700">Next step</p>
            <p className="mt-1">Review homepage content and publish updates safely.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Quick access</p>
              <h2 className="mt-2 text-xl font-semibold text-ledger">Jump to the most-used tools</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {QUICK_LINKS.map((card) => (
              <Link key={card.key} href={card.href} className="rounded-2xl border border-ledger/10 bg-paper-dim p-4 transition hover:-translate-y-0.5 hover:border-growth/30 hover:shadow-sm">
                <h3 className="text-base font-semibold text-ledger">{card.label}</h3>
                <p className="mt-2 text-sm leading-6 text-ledger/65">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">At a glance</p>
          <div className="mt-5 space-y-3">
            {[
              { label: "Content modules", value: String(Object.keys(entities).length) },
              { label: "Pages ready to edit", value: "All" },
              { label: "Admin experience", value: "Modern UI" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-paper-dim px-4 py-3">
                <span className="text-sm text-ledger/70">{item.label}</span>
                <span className="font-semibold text-ledger">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Manage content</p>
            <h2 className="mt-2 text-xl font-semibold text-ledger">Everything is grouped so it feels easy to browse</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.values(entities).map((entity) => (
            <Link key={entity.key} href={`/admin/${entity.key}`} className="rounded-2xl border border-ledger/10 bg-paper-dim p-4 transition hover:-translate-y-0.5 hover:border-growth/30 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-ledger">{entity.pluralLabel}</h3>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-growth-700">
                  {entity.singleton ? "Single" : "List"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ledger/65">
                {entity.singleton ? "Manage this shared setting in one place" : "Create, review, and update entries with a simpler workflow"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
