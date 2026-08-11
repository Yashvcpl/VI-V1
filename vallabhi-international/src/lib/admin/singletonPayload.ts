import type { FieldConfig } from "@/lib/admin/entities";

type FieldLike = { key: string; required?: boolean; type?: string };
type EntityLike = { key?: string; fields?: FieldLike[] };

const DEFAULTS: Record<string, Record<string, string>> = {
  homepageHero: {
    heading: "Helping businesses raise capital",
    subheading: "Trusted advisory for growth, risk, and funding strategy.",
  },
};

export function normalizePayloadForEntitySave(entity: EntityLike, body: Record<string, unknown>) {
  const normalized = { ...body };
  const defaults = DEFAULTS[entity.key ?? ""] ?? {};

  console.log(`[normalizePayloadForEntitySave] entity.key=${entity.key}, defaults=${JSON.stringify(defaults)}, body=${JSON.stringify(body)}`);

  // Always fill defaults for known singletons, even if not in admin form.
  for (const [fieldKey, defaultValue] of Object.entries(defaults)) {
    const value = normalized[fieldKey];
    const hasMeaningfulValue = typeof value === "string" && value.trim().length > 0;
    if (!hasMeaningfulValue) {
      console.log(`[normalizePayloadForEntitySave] filling ${fieldKey}=${defaultValue}`);
      normalized[fieldKey] = defaultValue;
    }
  }

  // Also handle form-declared required fields.
  for (const field of entity.fields ?? []) {
    if (!field.required) continue;

    const value = normalized[field.key];
    const hasMeaningfulValue = typeof value === "string" && value.trim().length > 0;
    if (!hasMeaningfulValue) {
      const defaultValue = defaults[field.key];
      if (defaultValue) {
        normalized[field.key] = defaultValue;
      }
    }
  }

  // Convert datetime strings into Date objects for DB persistence.
  for (const field of entity.fields ?? []) {
    if (field.type !== "datetime") continue;

    const value = normalized[field.key];
    if (typeof value === "string" && value.trim().length > 0) {
      const parsedDate = new Date(value);
      if (!Number.isNaN(parsedDate.getTime())) {
        normalized[field.key] = parsedDate;
      }
    }
  }

  return normalized;
}
