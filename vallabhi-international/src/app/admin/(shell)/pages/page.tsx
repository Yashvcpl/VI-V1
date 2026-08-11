import Link from "next/link";
import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  "about-us": "/about-us",
  services: "/services",
  "insights-blogs": "/insights/blogs",
  "insights-news": "/insights/news",
  "insights-reports": "/insights/reports",
  careers: "/careers",
  "contact-us": "/contact-us",
};

export default async function AdminPagesListPage() {
  const rows: Array<{ id: number; title: string; slug: string }> = await db.select().from(pages);

  return (
    <div>
      <h1 className="text-2xl">Pages</h1>
      <p className="mt-2 font-body text-ledger/70">
        Every page on the site is built from sections. Open a page to add, remove, reorder, or edit its sections.
      </p>

      <ul className="mt-8 divide-y divide-ledger/10 rounded-card border border-ledger/10 bg-paper">
        {rows.map((page: { id: number; title: string; slug: string }) => (
          <li key={page.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-body font-medium text-ledger">{page.title}</p>
              <p className="font-mono text-xs text-ledger/50">{SLUG_TO_PATH[page.slug] ?? `/${page.slug}`}</p>
            </div>
            <Link href={`/admin/pages/${page.id}`} className="font-body text-sm font-semibold text-growth-700 hover:underline">
              Edit sections →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
