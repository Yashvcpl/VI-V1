export const SERVICE_ICON_VARIANTS = [
  "syndication",
  "market",
  "assessment",
  "equity",
  "financial",
  "nri",
  "valuation",
  "insolvency",
] as const;

export type ServiceIconVariant = (typeof SERVICE_ICON_VARIANTS)[number];

export function getServiceIconVariant(slug: string): ServiceIconVariant {
  if (slug.includes("syndication")) return "syndication";
  if (slug.includes("capital-market") || slug.includes("market")) return "market";
  if (slug.includes("assessment") || slug.includes("credit")) return "assessment";
  if (slug.includes("financial")) return "financial";
  if (slug.includes("nri")) return "nri";
  if (slug.includes("valuation")) return "valuation";
  if (slug.includes("insolvency")) return "insolvency";
  return "equity";
}
