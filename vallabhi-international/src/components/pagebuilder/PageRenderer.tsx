import type { PageSection } from "@/lib/db/schema";
import { HeroSection } from "@/components/pagebuilder/sections/HeroSection";
import { TextBlockSection } from "@/components/pagebuilder/sections/TextBlockSection";
import { IconGridSection } from "@/components/pagebuilder/sections/IconGridSection";
import { StatsGridSection } from "@/components/pagebuilder/sections/StatsGridSection";
import { ServiceListingSection } from "@/components/pagebuilder/sections/ServiceListingSection";
import { LoanEligibilityFormSection } from "@/components/pagebuilder/sections/LoanEligibilityFormSection";
import { ContactFormSection } from "@/components/pagebuilder/sections/ContactFormSection";
import { ContactInfoBlockSection } from "@/components/pagebuilder/sections/ContactInfoBlockSection";
import { ClientLogosSection } from "@/components/pagebuilder/sections/ClientLogosSection";
import { TestimonialsSection } from "@/components/pagebuilder/sections/TestimonialsSection";
import { TeamGridSection } from "@/components/pagebuilder/sections/TeamGridSection";
import { TimelineSection } from "@/components/pagebuilder/sections/TimelineSection";
import { ValuesGridSection } from "@/components/pagebuilder/sections/ValuesGridSection";
import { ImageGallerySection } from "@/components/pagebuilder/sections/ImageGallerySection";
import { FaqSection } from "@/components/pagebuilder/sections/FaqSection";
import { CtaBannerSection } from "@/components/pagebuilder/sections/CtaBannerSection";
import { VideoSection } from "@/components/pagebuilder/sections/VideoSection";
import { JobOpeningsListSection } from "@/components/pagebuilder/sections/JobOpeningsListSection";
import { ContentListingSection } from "@/components/pagebuilder/sections/ContentListingSection";
import { ProcessStepsSection } from "@/components/pagebuilder/sections/ProcessStepsSection";
import { ConsultationFormSection } from "@/components/pagebuilder/sections/ConsultationFormSection";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySectionComponent = (props: { data: any; isFirstOnPage: boolean }) => React.ReactNode;

const componentsByType: Record<string, AnySectionComponent> = {
  hero: HeroSection,
  textBlock: TextBlockSection,
  iconGrid: IconGridSection,
  statsGrid: StatsGridSection,
  serviceListing: ServiceListingSection,
  loanEligibilityForm: LoanEligibilityFormSection,
  contactForm: ContactFormSection,
  contactInfoBlock: ContactInfoBlockSection,
  clientLogos: ClientLogosSection,
  testimonials: TestimonialsSection,
  teamGrid: TeamGridSection,
  timeline: TimelineSection,
  valuesGrid: ValuesGridSection,
  imageGallery: ImageGallerySection,
  faq: FaqSection,
  ctaBanner: CtaBannerSection,
  video: VideoSection,
  jobOpeningsList: JobOpeningsListSection,
  contentListing: ContentListingSection,
  processSteps: ProcessStepsSection,
  consultationForm: ConsultationFormSection,
};

function safeParse(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function PageRenderer({ sections }: { sections: PageSection[] }) {
  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.sortOrder - b.sortOrder);

  const nodes: React.ReactNode[] = [];

  for (let index = 0; index < visibleSections.length; index += 1) {
    const section = visibleSections[index];
    const nextSection = visibleSections[index + 1];

    if (section.type === "contactInfoBlock" && nextSection?.type === "contactForm") {
      const InfoComponent = componentsByType[section.type];
      const FormComponent = componentsByType[nextSection.type];

      if (InfoComponent && FormComponent) {
        nodes.push(
          <section key={`${section.id}-${nextSection.id}`} className="py-16 md:py-20">
            <div className="container-content max-w-[1320px]">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <InfoComponent
                    data={safeParse(section.data)}
                    isFirstOnPage={index === 0}
                  />
                </div>
                <div>
                  <FormComponent
                    data={safeParse(nextSection.data)}
                    isFirstOnPage={false}
                  />
                </div>
              </div>
            </div>
          </section>,
        );

        index += 1;
        continue;
      }
    }

    if (section.type === "jobOpeningsList" && nextSection?.type === "contactForm") {
      const JobsComponent = componentsByType[section.type];
      const FormComponent = componentsByType[nextSection.type];

      if (JobsComponent && FormComponent) {
        nodes.push(
          <section key={`${section.id}-${nextSection.id}`} className="py-16 md:py-20">
            <div className="container-content max-w-[1320px]">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div>
                  <JobsComponent
                    data={safeParse(section.data)}
                    isFirstOnPage={index === 0}
                  />
                </div>
                <div>
                  <FormComponent
                    data={safeParse(nextSection.data)}
                    isFirstOnPage={false}
                  />
                </div>
              </div>
            </div>
          </section>,
        );

        index += 1;
        continue;
      }
    }

    const Component = componentsByType[section.type];
    if (!Component) {
      console.warn(`Unknown page-builder section type: ${section.type}`);
      continue;
    }

    nodes.push(
      <Component
        key={section.id}
        data={safeParse(section.data)}
        isFirstOnPage={index === 0}
      />,
    );
  }

  return <>{nodes}</>;
}
