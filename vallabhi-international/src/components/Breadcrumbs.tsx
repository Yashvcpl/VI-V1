import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const allItems = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="container-content pt-6">
      <JsonLd data={breadcrumbSchema(allItems)} />
      <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-ledger/50">
        {allItems.map((item, index) => (
          <li key={item.path} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === allItems.length - 1 ? (
              <span aria-current="page" className="text-ledger">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-growth-700">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
