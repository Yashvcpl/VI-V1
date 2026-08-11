import "dotenv/config";
import { db } from "../src/lib/db/client";
import { homepageHero, pages, pageSections, mediaAssets } from "../src/lib/db/schema";
import { eq, asc } from "drizzle-orm";

async function run() {
  if (!db) {
    console.error("Database is not configured; set DATABASE_URL first.");
    process.exit(1);
  }

  try {
    const [hero] = await db.select().from(homepageHero).where(eq(homepageHero.id, 1)).limit(1).catch(() => []);
    console.log("homepage_hero row:", hero ?? null);

    const [homePage] = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1).catch(() => []);
    console.log("pages.home:", homePage ?? null);

    const sections = await db.select().from(pageSections).where(eq(pageSections.pageId, homePage?.id ?? -1)).orderBy(asc(pageSections.sortOrder)).catch(() => []);
    console.log("page_sections for home (count):", sections.length);
    const heroSection = sections.find((s: any) => s.type === "hero");
    console.log("hero section:", heroSection ?? null);

    const latestMedia = await db.select().from(mediaAssets).orderBy(asc(mediaAssets.uploadedAt)).limit(5).catch(() => []);
    console.log("sample media assets:", latestMedia);
  } catch (err) {
    console.error("Error checking DB:", err);
    process.exit(1);
  }
}

run();
