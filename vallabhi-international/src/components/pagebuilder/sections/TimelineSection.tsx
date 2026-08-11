import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { journeyMilestones as journeyTable } from "@/lib/db/schema";

export async function TimelineSection({ data, isFirstOnPage }: { data: { eyebrow?: string; heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const milestones: Array<{ id: string; year: string; description: string }> = await db
    .select()
    .from(journeyTable)
    .orderBy(asc(journeyTable.sortOrder))
    .catch(() => [] as Array<{ id: string; year: string; description: string }>);

  return (
    <section className="py-16">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 text-3xl">{data.heading}</Heading>
        <ol className="mt-12 flex flex-col gap-8">
          {milestones.map((m) => (
            <li key={m.id} className="ledger-rule grid grid-cols-[80px_1fr] gap-6 pt-6 sm:grid-cols-[120px_1fr]">
              <span className="font-mono text-xl text-growth-700">{m.year}</span>
              <p className="font-body text-ledger/80">{m.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
