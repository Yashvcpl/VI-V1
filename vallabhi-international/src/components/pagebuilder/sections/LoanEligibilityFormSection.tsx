import { LoanEligibility } from "@/components/sections/LoanEligibility";

interface Data {
  eyebrow?: string;
  heading: string;
  subheading?: string;
}

export function LoanEligibilityFormSection({ data }: { data: Data }) {
  // LoanEligibility already renders its own full section incl. eyebrow/heading -
  // pass the CMS copy through via props so this stays admin-editable.
  return <LoanEligibility eyebrow={data.eyebrow} heading={data.heading} subheading={data.subheading} />;
}
