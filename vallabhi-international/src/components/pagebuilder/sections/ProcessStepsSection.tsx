import { parsePairLines } from "@/lib/pagebuilder/parseLines";

interface ProcessStepsData {
  heading: string;
  items: string;
}

export function ProcessStepsSection({ data, isFirstOnPage }: { data: ProcessStepsData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const steps = parsePairLines(data.items);

  return (
    <section className="py-16">
      <div className="container-content text-center">
        <Heading className="font-display text-3xl font-bold text-ledger">{data.heading}</Heading>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-[32px] bg-ledger py-16 text-paper">
        <div className="absolute inset-x-0 top-0 h-24 bg-growth/5" aria-hidden="true" />
        <div className="container-content">
          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.a} className="relative rounded-3xl border border-white/10 bg-ledger/95 p-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-growth-100 font-display text-lg font-bold text-growth-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-paper">{step.a}</h3>
                {step.b && <p className="mt-3 font-body text-sm leading-relaxed text-paper/75">{step.b}</p>}
                {index < steps.length - 1 && (
                  <span className="pointer-events-none absolute right-4 top-1/2 hidden h-px w-16 -translate-y-1/2 bg-paper/30 lg:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
