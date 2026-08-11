/**
 * Adds the 8 services shown in the approved homepage design, using the same
 * card copy. Safe to re-run - skips any slug that already exists, so it
 * won't duplicate or overwrite services you've since edited in the admin.
 *
 * Usage: npm run seed-services
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { services } from "../src/lib/db/schema";

const SHARED_SUMMARY =
  "Structured debt syndication solutions for Corporates, MSMEs, and Mid-Corporate enterprises.";

const seedServices = [
  {
    title: "Debt Syndication",
    slug: "debt-syndication",
    summary: SHARED_SUMMARY,
    sortOrder: 0,
    seoDescription: "Debt syndication advisory for Corporates, MSMEs, and Mid-Corporate enterprises from Vallabhi International.",
  },
  {
    title: "Debt Capital Market",
    slug: "debt-capital-market",
    summary: SHARED_SUMMARY,
    sortOrder: 1,
    seoDescription: "Debt capital market solutions and structuring advisory from Vallabhi International.",
  },
  {
    title: "Credit Assessment",
    slug: "credit-assessment",
    summary: SHARED_SUMMARY,
    sortOrder: 2,
    seoDescription: "Independent credit assessment and risk evaluation services from Vallabhi International.",
  },
  {
    title: "Private Equity",
    slug: "private-equity",
    summary: SHARED_SUMMARY,
    sortOrder: 3,
    seoDescription: "Private equity advisory and capital raising support from Vallabhi International.",
  },
  {
    title: "Financial Services",
    slug: "financial-services",
    summary: SHARED_SUMMARY,
    sortOrder: 4,
    seoDescription: "End-to-end financial advisory services for businesses from Vallabhi International.",
  },
  {
    title: "NRI Services",
    slug: "nri-services",
    summary: SHARED_SUMMARY,
    sortOrder: 5,
    seoDescription: "Financial and investment advisory services for NRIs from Vallabhi International.",
  },
  {
    title: "Valuation",
    slug: "valuation",
    summary: SHARED_SUMMARY,
    sortOrder: 6,
    seoDescription: "Business and asset valuation services from Vallabhi International.",
  },
  {
    title: "Insolvency",
    slug: "insolvency",
    summary: SHARED_SUMMARY,
    sortOrder: 7,
    seoDescription: "Insolvency resolution and restructuring advisory from Vallabhi International.",
  },
];

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  for (const service of seedServices) {
    const [existing] = await db.select().from(services).where(eq(services.slug, service.slug)).limit(1);
    if (existing) {
      console.log(`Skipping "${service.slug}" - already exists.`);
      continue;
    }
    await db.insert(services).values(service);
    console.log(`Added service: ${service.title}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to seed services:", error);
  process.exit(1);
});
