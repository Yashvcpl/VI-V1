import Image from "next/image";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { navigationItems, siteSettings } from "@/lib/db/schema";

const DEFAULT_SITE_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Insights", href: "/insights/blogs" },
  { label: "Careers", href: "/careers" },
];

const SERVICE_LINKS = [
  { label: "All Services", href: "/services" },
  { label: "Schedule Your Free Financial Consultation", href: "/#loan-eligibility" },
];

const DEFAULT_DESCRIPTION = "Vallabhi International helps businesses and founders unlock capital, structure credit strategy, and move with confidence.";

function stripMarkdown(value?: string | null) {
  return (value ?? "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[*_#`~-]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSocialLinks(raw?: string | null) {
  if (!raw) return [] as { label: string; href: string }[];

  return raw
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((part) => part.trim());
      return {
        label: label || "Social",
        href: href || "#",
      };
    })
    .filter((item) => item.href && item.href !== "#");
}

function getSocialIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12Z" />
        <path d="M5.5 10.17h2.88v7.33H5.5z" />
        <path d="M11.02 10.17h2.76v1h.04c.38-.72 1.31-1.48 2.7-1.48 2.88 0 3.41 1.9 3.41 4.36v3.45h-2.88v-3.24c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.08-1.6 2.2v3.32h-2.88z" />
      </svg>
    );
  }

  if (normalized.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (normalized.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <path d="M13.6 21v-7h2.6l.4-2.8h-3V8.3c0-.8.2-1.4 1.4-1.4H16V4.3c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8v2.8h2.6v7h3Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path d="M4 5.5h16v13H4z" />
      <path d="M7 9.5l5 4 5-4" />
    </svg>
  );
}

export async function Footer() {
  const [settings] = db
    ? await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.id, 1))
        .limit(1)
        .catch(() => [])
    : [null];

  const typedSettings = settings as typeof settings & {
    logoUrl?: string | null;
    companyOverview?: string | null;
    contactAddress?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    businessHours?: string | null;
    socialLinks?: string | null;
  };

  const logoUrl = typedSettings?.logoUrl ?? "/logo.jpg";
  const companyOverview = stripMarkdown(typedSettings?.companyOverview) || DEFAULT_DESCRIPTION;
  const address = typedSettings?.contactAddress ?? "SF-4C, Second Floor, Rishabh Ipex Mall, Patparganj, IP Extension, Delhi, India";
  const phone = typedSettings?.contactPhone ?? "+91 11 4000 0000";
  const email = typedSettings?.contactEmail ?? "info@vallabhicapital.com";
  const businessHours = typedSettings?.businessHours ?? "Mon - Sat: 9:00 AM - 6:00 PM";
  const socialLinks = parseSocialLinks(typedSettings?.socialLinks);

  const rows: Array<{ label: string; href: string }> = await db
    .select()
    .from(navigationItems)
    .where(eq(navigationItems.location, "footer"))
    .orderBy(asc(navigationItems.sortOrder))
    .catch(() => [] as Array<{ label: string; href: string }>);

  const siteLinks = rows.length > 0 ? rows.map((r) => ({ label: r.label, href: r.href })) : DEFAULT_SITE_LINKS;
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const mailHref = `mailto:${email}`;

  return (
    <footer className="border-t border-ledger/10 bg-ledger text-paper">
      <div className="container-content py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.4fr_0.9fr_0.9fr_1fr_1fr] xl:items-start">
          <div className="flex flex-col items-start gap-4 text-left md:items-start">
            <Link href="/" className="inline-flex items-center" aria-label="Vallabhi International home">
              <Image src={logoUrl} alt="Vallabhi International" width={180} height={84} className="h-11 w-auto object-contain" priority />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-paper/80">{companyOverview}</p>
          </div>

          <nav aria-label="Quick links" className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-paper/85 transition hover:text-growth-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-paper/85 transition hover:text-growth-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">Contact Information</h3>
            <ul className="flex flex-col gap-3 font-body text-sm text-paper/85">
              <li>
                <p className="leading-6">{address}</p>
              </li>
              <li>
                <a href={telHref} className="transition hover:text-growth-300">{phone}</a>
              </li>
              <li>
                <a href={mailHref} className="transition hover:text-growth-300">{email}</a>
              </li>
              <li>
                <p className="leading-6">{businessHours}</p>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-paper/60">Social Media</h3>
            <ul className="flex flex-wrap gap-2.5">
              {socialLinks.length > 0 ? socialLinks.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-3 py-2 text-sm text-paper/85 transition duration-200 hover:-translate-y-0.5 hover:border-growth-300 hover:text-growth-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center text-paper/85 transition group-hover:text-growth-300">
                      {getSocialIcon(item.label)}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              )) : (
                <li className="text-sm text-paper/70">Social media links will appear here.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

    </footer>
  );
}
