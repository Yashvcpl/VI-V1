import { db } from '../src/lib/db/client';
import { homepageHero } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  const rows = await db.select().from(homepageHero).where(eq(homepageHero.id, 1));
  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
