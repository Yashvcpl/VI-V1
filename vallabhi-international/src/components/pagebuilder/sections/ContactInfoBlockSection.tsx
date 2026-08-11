import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { siteSettings as siteSettingsTable } from "@/lib/db/schema";

interface Data {
  eyebrow?: string;
  heading: string;
  subheading?: string;
}

function formatSocialLinks(raw?: string | null) {
  if (!raw) return [];
  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((part) => part.trim());
      return { label: label || "Link", url: url || "#" };
    });
}

export async function ContactInfoBlockSection({ data, isFirstOnPage }: { data: Data; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  const [settings] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1)).limit(1).catch(() => []);

  const address = settings?.contactAddress ?? "B-303, Rustomjee Central Park Business Spaces Andheri - Kurla Rd, Chakala, Andheri East, Mumbai, Maharashtra - 400093";
  const phone = settings?.contactPhone ?? "+91 11 4000 0000";
  const email = settings?.contactEmail ?? "info@vallabhicapital.com";
  const businessHours = settings?.businessHours ?? "Mon - Sat: 9:00 AM - 6:00 PM";
  const mapUrl = settings?.googleMapUrl ?? "https://maps.google.com";
  const socialLinks = formatSocialLinks(settings?.socialLinks);

  return (
    <div>
      {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
      <Heading className="mt-3 text-4xl text-ledger md:text-5xl">{data.heading}</Heading>
      {data.subheading && <p className="mt-4 max-w-xl font-body text-lg text-ledger/80">{data.subheading}</p>}

      <dl className="mt-10 space-y-6 font-body text-ledger/85">
        <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
          <dt className="eyebrow">Office Address</dt>
          <dd className="mt-2 text-base leading-7">{address}</dd>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
            <dt className="eyebrow">Phone Number</dt>
            <dd className="mt-2 text-base"><a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-growth-700">{phone}</a></dd>
          </div>
          <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
            <dt className="eyebrow">Email Address</dt>
            <dd className="mt-2 text-base"><a href={`mailto:${email}`} className="hover:text-growth-700">{email}</a></dd>
          </div>
        </div>
        {businessHours && (
          <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
            <dt className="eyebrow">Business Hours</dt>
            <dd className="mt-2 text-base">{businessHours}</dd>
          </div>
        )}
        {mapUrl && (
          <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
            <dt className="eyebrow">Google Map</dt>
            <dd className="mt-2 text-base"><a href={mapUrl} target="_blank" rel="noreferrer" className="text-growth-700 hover:underline">Open map</a></dd>
          </div>
        )}
        {socialLinks.length > 0 && (
          <div className="rounded-[24px] border border-ledger/10 bg-paper p-5 shadow-[0_8px_30px_rgba(9,45,72,0.06)]">
            <dt className="eyebrow">Social Media</dt>
            <dd className="mt-2 flex flex-wrap gap-3 text-base">
              {socialLinks.map((item) => (
                <a key={`${item.label}-${item.url}`} href={item.url} target="_blank" rel="noreferrer" className="rounded-full border border-ledger/15 px-3 py-1.5 text-sm text-ledger hover:border-growth-700 hover:text-growth-700">
                  {item.label}
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
