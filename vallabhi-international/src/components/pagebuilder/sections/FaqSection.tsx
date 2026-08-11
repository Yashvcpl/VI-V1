import { parsePairLines } from "@/lib/pagebuilder/parseLines";

interface FaqData {
  eyebrow?: string;
  heading: string;
  items: string;
}

export function FaqSection({ data, isFirstOnPage }: { data: FaqData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const items = parsePairLines(data.items);

  return (
    <section className="py-16">
      <div className="container-content max-w-3xl">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 text-3xl">{data.heading}</Heading>
        <dl className="mt-10 flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.a} className="ledger-rule pt-6">
              <dt className="text-lg font-semibold text-ledger">{item.a}</dt>
              <dd className="mt-2 font-body text-ledger/75">{item.b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
