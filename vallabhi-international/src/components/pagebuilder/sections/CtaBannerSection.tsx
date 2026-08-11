import Link from "next/link";

interface CtaBannerData {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CtaBannerSection({ data, isFirstOnPage }: { data: CtaBannerData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  return (
    <section className="bg-ledger py-16 text-paper">
      <div className="container-content flex flex-col items-center gap-6 text-center">
        <Heading className="max-w-2xl text-3xl">{data.heading}</Heading>
        {data.subheading && <p className="max-w-xl font-body text-paper/80">{data.subheading}</p>}
        {data.ctaLabel && data.ctaHref && (
          <Link href={data.ctaHref} className="btn-primary bg-growth hover:bg-growth-700">{data.ctaLabel}</Link>
        )}
      </div>
    </section>
  );
}
