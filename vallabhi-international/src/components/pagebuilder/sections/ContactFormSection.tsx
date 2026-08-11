import { SimpleLeadForm } from "@/components/SimpleLeadForm";

interface Data {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  introText?: string;
  showCompanyName?: boolean;
  showSubject?: boolean;
  subjectLabel?: string;
  formSource: "contact-us" | "careers";
  messageLabel?: string;
  submitLabel?: string;
}

export function ContactFormSection({ data, isFirstOnPage }: { data: Data; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  return (
    <div className="rounded-[32px] border border-ledger/10 bg-paper px-5 py-7 shadow-[0_18px_60px_rgba(9,45,72,0.10)] sm:px-8 sm:py-9" aria-labelledby="contact-form-heading">
      {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
      <Heading id="contact-form-heading" className="mx-auto mt-3 max-w-3xl text-center text-4xl text-ledger md:text-5xl">{data.heading}</Heading>
      {data.subheading && <p className="mt-4 max-w-xl font-body text-lg text-ledger/80">{data.subheading}</p>}
      {data.introText && <p className="mt-6 font-body text-base text-ledger/75">{data.introText}</p>}
      <div className="mt-6">
        <SimpleLeadForm
          source={data.formSource}
          messageLabel={data.messageLabel || "Message"}
          submitLabel={data.submitLabel || "Submit"}
          showCompanyName={data.showCompanyName ?? true}
          showSubject={data.showSubject ?? true}
          subjectLabel={data.subjectLabel || "Subject"}
        />
      </div>
    </div>
  );
}
