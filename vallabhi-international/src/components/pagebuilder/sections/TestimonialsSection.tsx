import Image from "next/image";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { testimonials as testimonialsTable } from "@/lib/db/schema";

export async function TestimonialsSection({ data, isFirstOnPage }: { data: { eyebrow?: string; heading: string }; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const testimonials: Array<{
    clientName: string;
    quote: string;
    clientPhotoUrl?: string | null;
    clientBusiness?: string | null;
  }> = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.featured, true))
    .orderBy(asc(testimonialsTable.sortOrder))
    .catch(() => [] as Array<{
      clientName: string;
      quote: string;
      clientPhotoUrl?: string | null;
      clientBusiness?: string | null;
    }>);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 max-w-2xl text-3xl">{data.heading}</Heading>
        <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.clientName} className="ledger-rule flex flex-col gap-4 pt-6">
              <blockquote className="font-display text-lg italic leading-snug text-ledger">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                {t.clientPhotoUrl && <Image src={t.clientPhotoUrl} alt="" width={48} height={48} className="rounded-full object-cover" />}
                <div className="font-body text-sm">
                  <p className="font-semibold text-ledger">{t.clientName}</p>
                  {t.clientBusiness && <p className="text-ledger/60">{t.clientBusiness}</p>}
                </div>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
