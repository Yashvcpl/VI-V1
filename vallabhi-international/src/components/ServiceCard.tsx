"use client";

import Image from "next/image";
import Link from "next/link";
import { normalizePublicAssetUrl } from "@/lib/uploads/heroBanner";
import type { ServiceIconVariant } from "@/lib/serviceIcons";

export function ServiceIcon({
  variant,
  iconUrl,
}: {
  variant: ServiceIconVariant;
  iconUrl?: string | null;
}) {
  const normalizedIconUrl = normalizePublicAssetUrl(iconUrl);

  if (normalizedIconUrl) {
    return (
      <Image
        src={normalizedIconUrl}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    );
  }

  if (variant === "syndication") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M8 30c0-4.4 3.6-8 8-8h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 14h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="30" y="18" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="2.2" />
        <path d="M10 38h28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M21 28l4 4 8-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === "market") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M10 34h28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 30V22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 30V14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M34 30V18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 16l6-4 6 6 8-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === "assessment") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M24 10l12 4v8c0 7-4.2 10.8-12 14-7.8-3.2-12-7-12-14v-8l12-4Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M18.5 24.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (variant === "financial") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <rect x="10" y="12" width="28" height="24" rx="4" stroke="currentColor" strokeWidth="2.2" />
        <path d="M16 20h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 26h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 32h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "nri") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M12 24c0-7.2 5.8-12 12-12s12 4.8 12 12-5.8 12-12 12-12-4.8-12-12Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M19 24h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 19v10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "valuation") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M14 34h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 14v20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 18l6-4 6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 30l6 4 6-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "insolvency") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M12 16h24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M16 16v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 16v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 16v16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M12 32h24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 12h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
      <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M17 31V22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M24 31V16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M31 31v-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 38h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: ServiceIconVariant;
  iconUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export function ServiceCard({
  title,
  description,
  href,
  icon,
  iconUrl,
  buttonText,
  buttonLink,
}: ServiceCardProps) {
  const CTA = buttonText?.trim() ? buttonText : title;
  const buttonHref = buttonLink?.trim() ? buttonLink : href;

  return (
    <article className="group flex h-[390px] flex-col rounded-[28px] border border-ledger/10 bg-paper p-8 text-left shadow-[0_20px_60px_-35px_rgba(16,48,80,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_10px_rgba(22,110,75,0.35)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-growth-100 text-growth-700">
        <ServiceIcon variant={icon} iconUrl={iconUrl} />
      </div>

      <h3 className="mt-7 shrink-0 text-lg font-semibold text-ledger">
        {title}
      </h3>

      <p className="mt-3 min-h-[112px] overflow-hidden text-sm leading-7 text-ledger/70 line-clamp-4">
        {description}
      </p>

      <Link
        href={buttonHref}
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-growth-700 px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-growth-600"
      >
        {CTA}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}