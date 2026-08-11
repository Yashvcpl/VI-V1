import Image from "next/image";
import { SimpleLeadForm } from "@/components/SimpleLeadForm";

interface ConsultationFormData {
  heading: string;
  subheading?: string;
  sideImageUrl?: string;
  formSource: "contact-us" | "careers";
  messageLabel?: string;
  submitLabel?: string;
}

export function ConsultationFormSection({ data, isFirstOnPage }: { data: ConsultationFormData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";

  return (
    <section className="py-16">
      <div className="container-content overflow-hidden rounded-[32px] border border-ledger/10 bg-paper shadow-[0_20px_80px_-40px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
          <div className="relative h-full min-h-[420px] bg-paper-dim md:min-h-[560px]">
            {data.sideImageUrl ? (
              <Image src={data.sideImageUrl} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-ledger/10" aria-hidden="true" />
            )}
          </div>

          <div className="bg-growth-700 p-8 text-paper md:p-10">
            <Heading className="font-display text-3xl font-bold">{data.heading}</Heading>
            {data.subheading && <p className="mt-4 max-w-xl font-body text-base text-paper/85">{data.subheading}</p>}
            <div className="mt-8">
              <SimpleLeadForm
                source={data.formSource}
                messageLabel={data.messageLabel || "Message"}
                submitLabel={data.submitLabel || "Submit"}
                showCompanyName={false}
                variant="dark"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
