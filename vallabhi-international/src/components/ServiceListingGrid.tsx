import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import { getServiceIconVariant } from "@/lib/serviceIcons";

export interface ServiceListItem {
  title: string;
  summary: string;
  slug: string;
  iconUrl?: string | null;
}

interface ServiceListingGridProps {
  eyebrow?: string;
  heading: string;
  services: ServiceListItem[];
  showViewAllLink?: boolean;
  sectionId?: string;
  isFirstOnPage?: boolean;
}

export function ServiceListingGrid({
  eyebrow,
  heading,
  services,
  showViewAllLink,
  sectionId,
  isFirstOnPage = false,
}: ServiceListingGridProps) {
  const Heading = isFirstOnPage ? "h1" : "h2";

  return (
    <section className="bg-paper-dim py-24" id={sectionId}>
      <div className="container-content">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <Heading className="mt-3 font-display text-3xl font-bold text-ledger">{heading}</Heading>
        </div>

        {services.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-ledger/10 bg-paper p-8 text-center shadow-[0_20px_60px_-35px_rgba(16,48,80,0.18)]">
            <p className="text-ledger">Add services in the admin to show them here.</p>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard
                  title={service.title}
                  description={service.summary}
                  href={`/services/${service.slug}`}
                  icon={getServiceIconVariant(service.slug)}
                  iconUrl={service.iconUrl}
                />
              </li>
            ))}
          </ul>
        )}

        {showViewAllLink ? (
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-secondary">
              View all services
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
