export function serializeForClient<T>(value: T): T {
  if (value instanceof Date) {
    return value.toISOString() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeForClient(item)) as T;
  }

  if (value && typeof value === "object") {
    const plainObject: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      plainObject[key] = serializeForClient(entry);
    }

    return plainObject as T;
  }

  return value;
}
