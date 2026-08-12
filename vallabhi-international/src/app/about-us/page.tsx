import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { serializeForClient } from "@/lib/serializeForClient";
import { PageRenderer } from "@/components/pagebuilder/PageRenderer";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { homepageHero as homepageHeroTable } from "@/lib/db/schema";
import { getHeroBannerUrl } from "@/lib/uploads/heroBanner";
import { getAboutSectionImage } from "@/lib/homepage/aboutSection";
import { getConsultationSectionImage } from "@/lib/homepage/consultationSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPageWithSections("about-us");
  return buildMetadata({
    title: result?.page.seoTitle || "About Us",
    description:
      result?.page.seoDescription ||
      "Vallabhi Capital is an RBI-registered NBFC founded in 2021, built to close the credit gap for MSMEs, traders and exporters across India.",
    path: "/about-us",
  });
}

async function getHomepageHeroBanner() {
  if (!db) return null;

  try {
    const [hero] = await db
      .select()
      .from(homepageHeroTable)
      .where(eq(homepageHeroTable.id, 1))
      .limit(1);

    if (!hero) return null;

    return getHeroBannerUrl(hero as unknown as Record<string, string | null | undefined>, null, false);
  } catch {
    return null;
  }
}

export default async function AboutUsPage() {
  const result = await getPageWithSections("about-us");
  if (!result) notFound();

  // Fetch homepage hero row so we can derive fallback images for sections
  const [heroRow] = await db
    .select()
    .from(homepageHeroTable)
    .where(eq(homepageHeroTable.id, 1))
    .limit(1)
    .catch(() => []);

  const homepageBannerUrl = getHeroBannerUrl(heroRow as unknown as Record<string, string | null | undefined>, null, false);
  const aboutImage = getAboutSectionImage(heroRow as unknown as Record<string, string | null | undefined>);
  const consultationImage = getConsultationSectionImage(heroRow as unknown as Record<string, string | null | undefined>);

  const sections = serializeForClient(result.sections).map((section) => {
    if (section.type === "hero") {
      const data = JSON.parse(section.data);
      return {
        ...section,
        data: JSON.stringify({
          ...data,
          eyebrow: "",
          bannerImageUrl: data.bannerImageUrl || homepageBannerUrl,
          bannerOverlayColor: "",
        }),
      };
    }

    if (section.type === "textBlock") {
      const data = JSON.parse(section.data);
      return {
        ...section,
        data: JSON.stringify({
          ...data,
          eyebrow: "",
          headingSize: "text-3xl sm:text-4xl",
          imageUrl: data.imageUrl || aboutImage.url,
        }),
      };
    }

    if (section.type === "valuesGrid") {
      const data = JSON.parse(section.data);
      return {
        ...section,
        data: JSON.stringify({
          ...data,
          eyebrow: "",
          heading: "Our Values",
        }),
      };
    }

    if (section.type === "consultationForm") {
      const data = JSON.parse(section.data);
      return {
        ...section,
        data: JSON.stringify({
          ...data,
          sideImageUrl: data.sideImageUrl || consultationImage.url,
        }),
      };
    }

    return section;
  });

  return (
    <main className="bg-[#f7f7f2]">
      <PageRenderer sections={sections} />
    </main>
  );
}
