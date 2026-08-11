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

export default async function EditEntityPage(props: { params: Promise<{ entity: string; id: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) notFound();

  const id = Number(params.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = entity.table as any;

  if (!db) {
    notFound();
  }

  const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
  if (!row) notFound();

  const initialValues: Record<string, unknown> = serializeForClient({ ...row }) as Record<string, unknown>;
  delete initialValues.id;

  const previewUrl = entity.previewPath ? entity.previewPath(initialValues) : undefined;

  const heading = entity.readOnly ? "View" : "Edit";

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">{heading}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ledger/60">
          <Link href="/admin" className="hover:text-growth-700">Dashboard</Link>
          <span>/</span>
          <Link href={`/admin/${entity.key}`} className="hover:text-growth-700">{entity.pluralLabel}</Link>
          <span>/</span>
          <span>{heading}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-ledger">{heading} {entity.label}</h1>
        <p className="mt-2 text-sm leading-7 text-ledger/70">
          {entity.readOnly
            ? "This record is read-only and cannot be modified from the admin UI."
            : "Make focused updates in a streamlined layout without unnecessary visual clutter."}
        </p>
      </div>
      <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm sm:p-6">
        <AdminEntityForm entity={serializeEntityForClient(entity)} initialValues={initialValues} recordId={id} previewUrl={previewUrl} readOnly={entity.readOnly} />
      </div>
    </div>
  );
}
