import { notFound, redirect } from "next/navigation";
import { getEntity } from "@/lib/admin/entities";
import { AdminEntityForm } from "@/components/admin/AdminEntityForm";

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

export default async function NewEntityPage(props: { params: Promise<{ entity: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) notFound();
  if (entity.singleton) redirect(`/admin/${entity.key}`);

  const initialValues: Record<string, unknown> = {};
  for (const field of entity.fields) {
    if (field.type === "boolean") initialValues[field.key] = false;
    if (field.type === "number") initialValues[field.key] = 0;
  }

  return (
    <div>
      <h1 className="text-2xl">New {entity.label}</h1>
      <div className="mt-8">
        <AdminEntityForm entity={serializeEntityForClient(entity)} initialValues={initialValues} />
      </div>
    </div>
  );
}
