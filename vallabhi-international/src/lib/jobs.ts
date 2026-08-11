import { db } from "@/lib/db/client";
import { jobOpenings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function listOpenJobs() {
  if (!db) return [];
  return await db.select().from(jobOpenings).where(eq(jobOpenings.isOpen, true)).orderBy(jobOpenings.sortOrder).catch(() => []);
}

export async function getJobBySlug(slug: string) {
  if (!db) return null;

  const normalizedSlug = decodeURIComponent(slug);
  const [job] = await db
    .select()
    .from(jobOpenings)
    .where(eq(jobOpenings.slug, slug))
    .limit(1)
    .catch(() => []);

  if (job) return job;

  if (normalizedSlug !== slug) {
    const [decodedJob] = await db
      .select()
      .from(jobOpenings)
      .where(eq(jobOpenings.slug, normalizedSlug))
      .limit(1)
      .catch(() => []);
    return decodedJob ?? null;
  }

  return null;
}
