import test from "node:test";
import assert from "node:assert/strict";
import { normalizePayloadForEntitySave } from "./singletonPayload";

test("normalizePayloadForEntitySave fills homepage hero defaults for database-required fields", () => {
  const entity = {
    key: "homepageHero",
    fields: [
      { key: "bannerImageUrl", required: false },
      { key: "bannerImageAlt", required: false },
    ],
  } as const;

  const normalized = normalizePayloadForEntitySave(entity as any, { bannerImageAlt: "Hero banner" });

  assert.equal(normalized.heading, "Helping businesses raise capital");
  assert.equal(normalized.subheading, "Trusted advisory for growth, risk, and funding strategy.");
  assert.equal(normalized.bannerImageAlt, "Hero banner");
});
