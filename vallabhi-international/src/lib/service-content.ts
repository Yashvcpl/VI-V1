import { sanitizeHtml } from "@/lib/sanitizeHtml";

export type ServiceContentBlock = {
  id: string;
  heading: string;
  content: string;
  sortOrder: number;
};

const isLikelyObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function parseServiceContentBlocks(raw: string | null | undefined): ServiceContentBlock[] {
  if (!raw || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, index) => {
        if (!isLikelyObject(item)) return null;
        const heading = typeof item.heading === "string" ? item.heading.trim() : "";
        const content = typeof item.content === "string" ? item.content : "";
        if (!heading && !content.trim()) return null;

        return {
          id: typeof item.id === "string" && item.id ? item.id : `block-${index + 1}`,
          heading,
          content,
          sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
        };
      })
      .filter((item): item is ServiceContentBlock => Boolean(item));
  } catch {
    return [];
  }
}

export function serializeServiceContentBlocks(blocks: ServiceContentBlock[]): string {
  const sanitized = blocks
    .filter((block) => block && (block.heading.trim() || block.content.trim()))
    .map((block, index) => ({
      id: block.id || `block-${index + 1}`,
      heading: block.heading.trim(),
      content: sanitizeHtml(block.content),
      sortOrder: index,
    }));

  return JSON.stringify(sanitized);
}
