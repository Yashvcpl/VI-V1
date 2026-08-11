import { normalizePublicAssetUrl } from "@/lib/uploads/heroBanner";

export function getAboutSectionImage(hero: { aboutSectionImageUrl?: string | null; aboutSectionImageAlt?: string | null }) {
  return {
    url: normalizePublicAssetUrl(hero?.aboutSectionImageUrl) ?? null,
    alt: hero?.aboutSectionImageAlt?.trim() || "About image",
  };
}
