import "dotenv/config";
import { db } from "../src/lib/db/client";
import { faqs } from "../src/lib/db/schema";

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  const rows = await db.select().from(faqs).catch((e: unknown) => {
    console.error("Query failed", e);
    return [];
  });

  console.log("FAQ rows:", rows);
  process.exit(0);
}

main();
