"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SimpleLeadForm } from "@/components/SimpleLeadForm";
import { ServiceListingGrid } from "@/components/ServiceListingGrid";
import type { HomepageHero, Faq, BlogPost } from "@/lib/db/schema";
import type { ServiceSummary } from "@/lib/services";
import { getAboutSectionImage } from "@/lib/homepage/aboutSection";
import { getConsultationSectionImage } from "@/lib/homepage/consultationSection";
import { getHeroBannerUrl, normalizePublicAssetUrl } from "@/lib/uploads/heroBanner";

const PROCESS_STEPS = [
  {
    title: "Discovery & Consultation",
    description: "We learn about your business and goals.",
  },
  {
    title: "Financial Assessment",
    description: "We evaluate your financial position and opportunity.",
  },
  {
    title: "Tailored Strategy",
    description: "We design the best funding path for your needs.",
  },
  {
    title: "Execution & Ongoing Support",
    description: "We help you close deals and stay on track.",
  },
];

function SectionHeading({ eyebrow, title, subtitle, align = "center", tone = "default" }: { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "left"; tone?: "default" | "light" }) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  const isLight = tone === "light";

  return (
    <div className={`mx-auto max-w-3xl ${alignClass}`}>
      {eyebrow ? <p className={`eyebrow ${isLight ? "text-paper" : ""}`}>{eyebrow}</p> : null}
      <h2 className={`mt-4 font-display text-3xl font-bold sm:text-4xl ${isLight ? "text-paper" : "text-ledger"}`}>{title}</h2>
      {subtitle ? <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.12em] ${isLight ? "text-paper" : "text-growth-700"}`}>{subtitle}</p> : null}
    </div>
  );
}


function ProcessCard({ step, index }: { step: (typeof PROCESS_STEPS)[number]; index: number }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 text-white shadow-[0_24px_64px_-32px_rgba(0,0,0,0.45)] backdrop-blur-sm transition duration-300 hover:-translate-y-1">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D5EFC9] text-xl font-semibold text-[#0B4F75] shadow-lg">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
      <p className="mt-4 text-sm leading-7 text-white/75">{step.description}</p>
    </div>
  );
}

export function Homepage({ hero, fallbackBannerUrl, faqs, services, blogPosts }: { hero: HomepageHero | null; fallbackBannerUrl?: string | null; faqs?: Faq[]; services?: ServiceSummary[]; blogPosts?: BlogPost[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const aboutImage = getAboutSectionImage(hero ?? ({} as HomepageHero));
  const consultationImage = getConsultationSectionImage(hero ?? ({} as HomepageHero));
  const heroImageUrl = getHeroBannerUrl(hero as Record<string, string | null | undefined> | null, fallbackBannerUrl, isMobile);
  const heroImageAlt = hero?.bannerDesktopImageAlt ?? hero?.bannerMobileImageAlt ?? hero?.bannerImageAlt ?? "Hero banner";
  const heroTitle = hero?.heading?.trim() || "Financial clarity for ambitious businesses";
  const heroSubtitle = hero?.subheading?.trim() || "We help founders, corporates, and institutions secure capital and move boldly from strategy to execution.";
  const heroPrimaryLabel = hero?.primaryCtaLabel?.trim() || "Schedule a Consultation";
  const heroPrimaryHref = hero?.primaryCtaHref?.trim() || "#consultation";
  const heroSecondaryLabel = hero?.secondaryCtaLabel?.trim() || "Explore Services";
  const heroSecondaryHref = hero?.secondaryCtaHref?.trim() || "/services";

  return (
    <main className="overflow-x-hidden">
      <section className="relative isolate w-full overflow-hidden bg-[#07253C]">
        <div
          className="hero-banner relative flex items-end overflow-hidden"
          style={heroImageUrl ? { backgroundImage: `url(${heroImageUrl})` } : undefined}
          role="img"
          aria-label={heroImageAlt}
        >
          <div className="relative mx-auto flex w-full max-w-[1320px] items-end px-6 py-20 sm:px-8 lg:px-12">
            <div className="relative z-10 flex flex-wrap gap-4">
              <Link href={heroPrimaryHref} className="rounded-full bg-growth-700 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-growth-600">
                {heroPrimaryLabel}
              </Link>
              <Link href={heroSecondaryHref} className="rounded-full bg-growth-700 px-6 py-3 text-sm font-semibold text-paper transition hover:bg-growth-600">
                {heroSecondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-28">
        <div className="container-content">
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-16">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:text-left">
              <h2 className="mb-5 text-left text-[22px] font-semibold uppercase tracking-[0.18em] text-ledger">
                WHO WE ARE
              </h2>
              <p className="text-lg leading-8 text-ledger/75 text-left">
                Vallabhi International is a trusted financial advisory firm dedicated to helping businesses unlock growth through strategic capital solutions and expert financial guidance. We partner with entrepreneurs, corporates, and institutions to deliver customized advisory services that support sustainable growth, long-term value creation, and confident decision-making.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 lg:justify-start">
                <Link href="/about-us" className="rounded-full border border-ledger/15 px-5 py-2.5 text-sm font-semibold text-ledger transition hover:border-growth-700 hover:text-growth-700">
                  Learn more about us
                </Link>
                <Link href="/services" className="rounded-full bg-ledger px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-ledger/90">
                  Explore our services
                </Link>
              </div>
            </div>

            {aboutImage.url ? (
              <div className="rounded-[32px] border border-ledger/10 bg-paper-dim p-4 shadow-[0_24px_70px_-36px_rgba(16,48,80,0.25)] sm:p-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Image
                    src={aboutImage.url}
                    alt={aboutImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <ServiceListingGrid
        heading="Financial Advisory Services for Business Growth"
        services={services ?? []}
        sectionId="services"
      />

      <section className="py-24" id="faq">
        <div className="container-content">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-ledger sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs && faqs.length > 0 ? (
              faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group overflow-hidden rounded-[24px] border border-ledger/10 bg-paper/80"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left text-lg font-semibold text-ledger transition-colors hover:bg-ledger/5">
                    <span>{faq.question}</span>
                    <span className="text-xl font-bold text-ledger/60 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-ledger/10 px-6 py-5 text-base leading-7 text-ledger/75">
                    {faq.answer}
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-[28px] border border-ledger/10 bg-paper p-8 text-center text-ledger/60">
                Add FAQs in the admin to show them here.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24" id="consultation">
        <h2 className="mx-auto mb-10 max-w-2xl text-center font-display text-3xl font-extrabold text-ledger">Connect With Our Advisory Team</h2>
        <div className="container-content overflow-hidden rounded-[36px] border border-ledger/10 bg-paper shadow-[0_28px_120px_-48px_rgba(16,48,80,0.2)]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[24px] bg-paper-dim lg:min-h-[620px]">
              {consultationImage.url ? (
                <Image
                  src={consultationImage.url}
                  alt={consultationImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="bg-growth-700 p-8 text-paper md:p-12">
              <h2 className="font-display text-3xl font-bold text-paper">Schedule Your Free Financial Consultation</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-paper/80">
                Tell us what you’re planning and we’ll help you shape the right path forward.
              </p>
              <div className="mt-8">
                <SimpleLeadForm source="contact-us" messageLabel="Message" submitLabel="Submit" showCompanyName={false} variant="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="blog">
        <div className="container-content">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-ledger">Blogs</h2>
          </div>
          {blogPosts && blogPosts.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article key={post.slug} className="group overflow-hidden rounded-[28px] border border-ledger/10 bg-paper shadow-[0_20px_60px_-35px_rgba(16,48,80,0.12)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_-35px_rgba(16,48,80,0.2)]">
                  {post.coverImageUrl ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-8">
                    {post.category ? <p className="eyebrow">{post.category}</p> : null}
                    <h3 className="mt-4 text-xl font-semibold text-ledger group-hover:text-growth-700">{post.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ledger/70">{post.excerpt}</p>
                    <p className="mt-6 text-xs uppercase tracking-[0.18em] text-growth-700">Read more</p>
                    <Link href={`/insights/blogs/${post.slug}`} className="absolute inset-0" aria-label={`Read blog post ${post.title}`} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center font-body text-ledger/60">No blog posts are available at the moment.</p>
          )}
        </div>
      </section>
    </main>
  );
}

