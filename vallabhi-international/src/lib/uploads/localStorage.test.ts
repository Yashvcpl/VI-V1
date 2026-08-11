import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { LocalStorageProvider } from "./storage";

test("LocalStorageProvider creates folders and returns a public path", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-test-"));
  const provider = new LocalStorageProvider({ rootDir: tempDir });

  const file = new File(["abc"], "hero-banner.png", { type: "image/png" });
  const result = await provider.upload(file, { folder: "content/hero" });

  assert.equal(result.url, "/uploads/content/hero/" + path.basename(result.url));
  const absolutePath = path.join(tempDir, "public", "uploads", "content", "hero", path.basename(result.url));
  assert.equal(await fs.stat(absolutePath).then(() => true).catch(() => false), true);

  await fs.rm(tempDir, { recursive: true, force: true });
});

test("LocalStorageProvider uses the uploads root by default", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-test-default-"));
  const provider = new LocalStorageProvider({ rootDir: tempDir });

  const file = new File(["abc"], "team-photo.jpg", { type: "image/jpeg" });
  const result = await provider.upload(file);

  assert.match(result.url, /^\/uploads\/\d+-team-photo\.jpg$/);
  const absolutePath = path.join(tempDir, "public", "uploads", path.basename(result.url));
  assert.equal(await fs.stat(absolutePath).then(() => true).catch(() => false), true);

  await fs.rm(tempDir, { recursive: true, force: true });
});
