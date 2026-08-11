import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { homepageHero } from "../src/lib/db/schema";

async function run() {
  const url = process.argv[2] ?? "/hero-team-photo.webp";
  const alt = process.argv[3] ?? "The Vallabhi International advisory team";

  try {
    if (!db) {
      console.error("Database client is not initialized.");
      process.exit(1);
    }

    const [existing] = await db.select().from(homepageHero).limit(1).catch(() => []);
    if (existing) {
      await db.update(homepageHero).set({ bannerImageUrl: url, bannerImageAlt: alt }).where(eq(homepageHero.id, existing.id as any)).catch(() => {});
      console.log("Updated homepage_hero with:", { url, alt });
    } else {
      await db.insert(homepageHero).values({ id: 1, heading: "Homepage Hero", subheading: "", bannerImageUrl: url, bannerImageAlt: alt }).catch(() => {});
      console.log("Inserted homepage_hero with:", { url, alt });
    }
  } catch (err) {
    console.error("Failed to set homepage hero:", err);
    process.exit(1);
  }
}

run();
