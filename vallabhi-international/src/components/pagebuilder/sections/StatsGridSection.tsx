import { parsePairLines } from "@/lib/pagebuilder/parseLines";

interface StatsGridData {
  eyebrow?: string;
  heading?: string;
  items: string;
}

export function StatsGridSection({ data }: { data: StatsGridData }) {
  const items = parsePairLines(data.items);
  return (
    <section className="py-16">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        {data.heading && <h2 className="mt-3 text-3xl">{data.heading}</h2>}
        <dl className="mt-10 grid grid-cols-2 gap-8 font-mono text-sm sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.a}>
              <dt className="text-ledger/50">{item.a}</dt>
              <dd className="mt-1 text-2xl text-ledger">{item.b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
