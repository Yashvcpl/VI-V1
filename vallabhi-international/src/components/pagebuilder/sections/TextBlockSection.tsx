import Image from "next/image";
import { renderMarkdown } from "@/lib/markdown";

interface TextBlockData {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  body: string;
  imageUrl?: string;
  twoColumn?: boolean;
  greenHeading?: boolean;
  headingSize?: string;
}

export function TextBlockSection({ data, isFirstOnPage }: { data: TextBlockData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container-content">
        {data.twoColumn ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-14">
            <div className="rounded-[32px] border border-ledger/10 bg-paper px-8 py-10 shadow-[0_28px_90px_-48px_rgba(16,48,80,0.18)] sm:px-10 sm:py-12">
              {data.eyebrow ? <p className="eyebrow text-growth-700">{data.eyebrow}</p> : null}
              <Heading className={`mt-4 font-display font-bold leading-tight ${data.headingSize ?? "text-4xl sm:text-5xl"} ${data.greenHeading ? "text-growth-700" : "text-ledger"}`}>
                {data.heading}
              </Heading>
              {data.subheading ? <p className="mt-4 text-lg text-ledger/70">{data.subheading}</p> : null}
              <div className="prose-ledger mt-8 font-body text-ledger/80" dangerouslySetInnerHTML={{ __html: renderMarkdown(data.body) }} />
            </div>

            {data.imageUrl ? (
              <div className="overflow-hidden rounded-[32px] border border-ledger/10 bg-paper shadow-[0_28px_90px_-48px_rgba(16,48,80,0.18)]">
                <Image
                  src={data.imageUrl}
                  alt={data.heading}
                  width={900}
                  height={820}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full rounded-[32px] bg-paper-dim" aria-hidden="true" />
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl text-center">
            {data.eyebrow ? <p className="eyebrow text-growth-700">{data.eyebrow}</p> : null}
            <Heading className={`mt-4 font-display text-4xl font-bold leading-tight ${data.greenHeading ? "text-growth-700" : "text-ledger"} sm:text-5xl`}>
              {data.heading}
            </Heading>
            {data.subheading && <p className="mt-4 text-lg text-ledger/70">{data.subheading}</p>}
            <div className="prose-ledger mx-auto mt-8 font-body text-ledger/80" dangerouslySetInnerHTML={{ __html: renderMarkdown(data.body) }} />
          </div>
        )}
      </div>
    </section>
  );
}
