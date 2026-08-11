export function normalizePublicAssetUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

export function getHeroBannerUrl(
  hero: Record<string, string | null | undefined> | null | undefined,
  fallbackBannerUrl?: string | null,
  isMobile = false,
): string | null {
  const normalizedHero = hero ?? {};

  const candidates = isMobile
    ? [
        normalizedHero.bannerMobileImageUrl,
        normalizedHero.bannerDesktopImageUrl,
        normalizedHero.bannerImageUrl,
        fallbackBannerUrl,
      ]
    : [
        normalizedHero.bannerDesktopImageUrl,
        normalizedHero.bannerImageUrl,
        normalizedHero.bannerMobileImageUrl,
        fallbackBannerUrl,
      ];

  for (const candidate of candidates) {
    const normalized = normalizePublicAssetUrl(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}
