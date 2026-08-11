import { parsePairLines } from "@/lib/pagebuilder/parseLines";

interface IconGridData {
  eyebrow?: string;
  heading: string;
  items: string;
}

export function IconGridSection({ data, isFirstOnPage }: { data: IconGridData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const items = parsePairLines(data.items);

  return (
    <section className="bg-paper-dim py-20">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 max-w-2xl text-3xl">{data.heading}</Heading>
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ledger/10 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.a} className="bg-paper-dim p-8">
              <h3 className="text-xl">{item.a}</h3>
              {item.b && <p className="mt-3 font-body text-ledger/75">{item.b}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
