import "dotenv/config";
import { db } from "../src/lib/db/client";
import { faqs } from "../src/lib/db/schema";

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  const existing = await db.select().from(faqs).limit(1).catch(() => []);
  if (existing && existing.length > 0) {
    console.log("FAQs already present; skipping seed.");
    process.exit(0);
  }

  const sample = [
    {
      question: "What services does Vallabhi International offer?",
      answer: "We offer debt syndication, credit assessment, private equity advisory, and other tailored financial services to businesses.",
      published: true,
      sortOrder: 0,
    },
    {
      question: "How can I schedule a consultation?",
      answer: "Use the 'Schedule Your Free Financial Consultation' form on the homepage or contact us via the Contact Us page.",
      published: true,
      sortOrder: 1,
    },
  ];

  for (const item of sample) {
    await db.insert(faqs).values(item).catch((err: unknown) => {
      console.error("Failed to insert FAQ:", err);
    });
  }

  console.log("Seeded sample FAQs.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
