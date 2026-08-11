import Image from "next/image";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { companyValues as valuesTable } from "@/lib/db/schema";

export async function ValuesGridSection({ data, isFirstOnPage }: { data: { eyebrow?: string; heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const fetchedValues: Array<{
    id: number;
    title: string;
    description: string;
    iconUrl?: string | null;
    iconAlt?: string | null;
  }> = await db
    .select()
    .from(valuesTable)
    .orderBy(asc(valuesTable.sortOrder))
    .catch(() => [] as Array<{
      id: number;
      title: string;
      description: string;
      iconUrl?: string | null;
      iconAlt?: string | null;
    }>);
  const defaultValuesItem = {
    id: -1,
    title: "Values",
    description:
      "Our values are built on integrity, transparency, excellence, innovation, and a client-first approach, guiding every decision we make. They inspire trust, foster lasting partnerships, and drive sustainable success for our clients.",
    iconUrl: undefined,
    iconAlt: undefined,
  };
  const values = fetchedValues.some((value) => String(value.title).toLowerCase() === "values")
    ? fetchedValues
    : [...fetchedValues, defaultValuesItem];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container-content">
        <div className="rounded-[36px] bg-[#eaf4df] p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-3xl text-center">
            {data.eyebrow && <p className="eyebrow text-growth-700">{data.eyebrow}</p>}
            <Heading className="mt-3 text-3xl font-bold text-ledger sm:text-4xl">{data.heading}</Heading>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.id ?? value.title}
                className="flex h-full flex-col items-center rounded-[28px] bg-paper p-8 text-center shadow-[0_20px_80px_-42px_rgba(16,48,80,0.24)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-growth-100 text-growth-700 shadow-sm">
                  {value.iconUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={value.iconUrl} alt={String(value.iconAlt ?? value.title)} fill className="object-cover" />
                    </div>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                      <path d="M12 3 4 7v5c0 4.1 2.5 7.8 8 9 5.5-1.2 8-4.9 8-9V7l-8-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-ledger">{value.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ledger/70">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
