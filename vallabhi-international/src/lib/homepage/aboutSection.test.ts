import test from "node:test";
import assert from "node:assert/strict";
import { getAboutSectionImage } from "./aboutSection";

test("getAboutSectionImage returns the configured about image and alt text", () => {
  const hero = {
    aboutSectionImageUrl: "/uploads/about.jpg",
    aboutSectionImageAlt: "Team discussing strategy",
  };

  const result = getAboutSectionImage(hero as any);

  assert.equal(result.url, "/uploads/about.jpg");
  assert.equal(result.alt, "Team discussing strategy");
});

test("getAboutSectionImage falls back to a default alt text", () => {
  const hero = {
    aboutSectionImageUrl: "/uploads/about.jpg",
  };

  const result = getAboutSectionImage(hero as any);

  assert.equal(result.url, "/uploads/about.jpg");
  assert.equal(result.alt, "About image");
});
