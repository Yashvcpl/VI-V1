import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getEntity } from "@/lib/admin/entities";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";
import { serializeForClient } from "@/lib/serializeForClient";

function serializeEntityForClient(entity: NonNullable<ReturnType<typeof getEntity>>) {
  return {
    key: entity.key,
    label: entity.label,
    pluralLabel: entity.pluralLabel,
    singleton: entity.singleton,
    titleField: entity.titleField,
    subtitleField: entity.subtitleField,
    fields: entity.fields.map((field) => ({ ...field })),
  };
}

export const dynamic = "force-dynamic";

export default async function EntityIndexPage(props: { params: Promise<{ entity: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = entity.table as any;

  if (entity.singleton) {
    if (!db) {
      notFound();
    }

    const [row] = await db.select().from(table).where(eq(table.id, 1)).limit(1);
    const initialValues: Record<string, unknown> = serializeForClient({ ...row }) as Record<string, unknown>;
    delete initialValues.id;

    return (
      <div className="space-y-6">
        <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Content</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ledger/60">
            <Link href="/admin" className="hover:text-growth-700">Dashboard</Link>
            <span>/</span>
            <span>{entity.pluralLabel}</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-ledger">{entity.pluralLabel}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ledger/70">Manage this shared content block using a calm, focused form with clear field grouping.</p>
        </div>
        <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm sm:p-6">
          <AdminEntityForm entity={serializeEntityForClient(entity)} initialValues={initialValues} recordId={1} />
        </div>
      </div>
    );
  }

  if (!db) {
    notFound();
  }

  const rows = (await db.select().from(table)) as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Manage</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ledger/60">
              <Link href="/admin" className="hover:text-growth-700">Dashboard</Link>
              <span>/</span>
              <span>{entity.pluralLabel}</span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-ledger">{entity.pluralLabel}</h1>
            <p className="mt-2 text-sm leading-7 text-ledger/70">Browse, search, and update entries without leaving the main workflow.</p>
          </div>
          <Link href={`/admin/${entity.key}/new`} className="inline-flex items-center justify-center rounded-full bg-growth px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-growth-700">
            + New {entity.label}
          </Link>
        </div>
      </div>

      <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-ledger/10 bg-paper-dim p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-ledger">Search</label>
            <input className="mt-2 w-full rounded-2xl border border-ledger/10 bg-paper px-3 py-2 text-sm" placeholder={`Find ${entity.label.toLowerCase()}...`} />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="rounded-2xl border border-ledger/10 bg-paper px-3 py-2 text-sm text-ledger/70">Filters</button>
            <button type="button" className="rounded-2xl border border-ledger/10 bg-paper px-3 py-2 text-sm text-ledger/70">Sort</button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-ledger/15 bg-paper-dim p-8 text-center text-sm text-ledger/65">Nothing here yet. Create your first item to get started.</div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-ledger/10">
            <div className="hidden grid-cols-[1.4fr_1fr_auto] bg-paper-dim px-4 py-3 text-sm font-semibold text-ledger/70 md:grid">
              <span>Name</span>
              <span>Details</span>
              <span>Actions</span>
            </div>
            <ul className="divide-y divide-ledger/10 bg-paper">
              {rows.map((row) => (
                <li key={String(row.id)} className="grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_auto] md:items-center">
                  <div>
                    <p className="font-medium text-ledger">{String(row[entity.titleField] ?? `#${row.id}`)}</p>
                    {entity.subtitleField && row[entity.subtitleField] ? (
                      <p className="mt-1 text-sm text-ledger/60">{String(row[entity.subtitleField])}</p>
                    ) : null}
                  </div>
                  <div className="text-sm text-ledger/60">Updated through the existing admin workflow</div>
                  <div className="flex flex-wrap items-center gap-3">
                    {entity.previewPath && (
                      <a href={entity.previewPath(row)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-growth-700 hover:underline">
                        View ↗
                      </a>
                    )}
                    <Link href={`/admin/${entity.key}/${row.id}`} className="text-sm font-medium text-ledger hover:text-growth-700">
                      See
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
