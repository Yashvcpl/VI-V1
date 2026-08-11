import { normalizePublicAssetUrl } from "@/lib/uploads/heroBanner";

export function getConsultationSectionImage(hero: { consultationSectionImageUrl?: string | null; consultationSectionImageAlt?: string | null }) {
  return {
    url: normalizePublicAssetUrl(hero?.consultationSectionImageUrl) ?? null,
    alt: hero?.consultationSectionImageAlt?.trim() || "Consultation image",
  };
}
