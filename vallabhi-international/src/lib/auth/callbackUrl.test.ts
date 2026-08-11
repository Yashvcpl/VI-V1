import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCallbackUrl } from "./callbackUrl";

test("rewrites localhost callback URLs to the current origin", () => {
  assert.equal(
    normalizeCallbackUrl("http://localhost:3000/admin/homepageHero", "http://localhost:3001"),
    "http://localhost:3001/admin/homepageHero"
  );
});

test("preserves relative callback paths", () => {
  assert.equal(normalizeCallbackUrl("/admin", "http://localhost:3001"), "/admin");
});
