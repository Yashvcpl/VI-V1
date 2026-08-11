import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { partners as partnersTable } from "@/lib/db/schema";

export async function ClientLogosSection({ data }: { data: { heading?: string } }) {
  const partners: Array<{ name: string; logoUrl: string; websiteUrl?: string | null }> = await db
    .select()
    .from(partnersTable)
    .orderBy(asc(partnersTable.sortOrder))
    .catch(() => [] as Array<{ name: string; logoUrl: string; websiteUrl?: string | null }>);
  if (partners.length === 0) return null;

  return (
    <section className="bg-paper-dim py-16">
      <div className="container-content">
        {data.heading && <p className="eyebrow text-center">{data.heading}</p>}
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {partners.map((partner) => (
            <li key={partner.name} className="grayscale transition hover:grayscale-0">
              {partner.websiteUrl ? (
                <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
                  <Image src={partner.logoUrl} alt={partner.name} width={160} height={60} />
                </a>
              ) : (
                <Image src={partner.logoUrl} alt={partner.name} width={160} height={60} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
