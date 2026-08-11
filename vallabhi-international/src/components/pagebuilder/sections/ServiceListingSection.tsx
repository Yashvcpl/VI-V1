import { getAllServices } from "@/lib/services";
import { ServiceListingGrid } from "@/components/ServiceListingGrid";

interface ServiceListingData {
  eyebrow?: string;
  heading: string;
  showViewAllLink?: boolean;
}

export async function ServiceListingSection({ data, isFirstOnPage }: { data: ServiceListingData; isFirstOnPage: boolean }) {
  const services = await getAllServices();
  return (
    <ServiceListingGrid
      heading={data.heading}
      eyebrow={data.eyebrow}
      services={services}
      showViewAllLink={data.showViewAllLink}
      sectionId="services"
      isFirstOnPage={isFirstOnPage}
    />
  );
}
