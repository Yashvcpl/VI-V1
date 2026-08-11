import test from "node:test";
import assert from "node:assert/strict";
import { getHeroBannerUrl, normalizePublicAssetUrl } from "./heroBanner";

test("prefers the first non-empty hero banner image across desktop, mobile, and fallback fields", () => {
  const result = getHeroBannerUrl(
    {
      bannerMobileImageUrl: "",
      bannerDesktopImageUrl: "/uploads/banner-desktop/hero.jpg",
      bannerImageUrl: "/uploads/content/fallback.jpg",
    } as Record<string, string | null | undefined>,
    "/uploads/content/fallback.jpg",
    false,
  );

  assert.equal(result, "/uploads/banner-desktop/hero.jpg");
});

test("normalizes asset URLs so they resolve correctly from the public uploads folder", () => {
  assert.equal(normalizePublicAssetUrl("uploads/banner/hero.jpg"), "/uploads/banner/hero.jpg");
  assert.equal(normalizePublicAssetUrl("https://cdn.example.com/hero.jpg"), "https://cdn.example.com/hero.jpg");
  assert.equal(normalizePublicAssetUrl("/uploads/banner/hero.jpg"), "/uploads/banner/hero.jpg");
});
