import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { homepageHero as homepageHeroTable, faqs as faqsTable, blogPosts as blogPostsTable, type HomepageHero, type Faq, type BlogPost } from "@/lib/db/schema";
import { getAllServices, type ServiceSummary } from "@/lib/services";
import { getPageWithSections } from "@/lib/pagebuilder/getPage";
import { Homepage } from "@/components/Homepage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Vallabhi International",
  description:
    "Vallabhi International is a trusted financial advisory firm helping businesses raise capital, manage risk, and unlock growth.",
};

export default async function HomePage() {
  let hero: HomepageHero | null = null;

  if (db) {
    try {
      const result = await db
        .select()
        .from(homepageHeroTable)
        .where(eq(homepageHeroTable.id, 1))
        .limit(1);
      hero = (result as HomepageHero[])[0] ?? null;
    } catch (err) {
      // Defensive: log but allow page to render without DB hero data.
      console.error("Error fetching homepage hero:", err instanceof Error ? err : String(err));
      hero = null;
    }
  } else {
    console.warn("Database not available for homepage hero");
  }

  // Fetch FAQs (defensive: don't fail page render if DB missing or query errors)
  let faqs: Faq[] = [];
  let services: ServiceSummary[] = [];
  let blogPosts: BlogPost[] = [];
  let sectionBannerUrl: string | undefined = undefined;

  if (db) {
    try {
      const rows = await db.select().from(faqsTable).where(eq(faqsTable.published, true)).catch((e: unknown) => {
        console.error('FAQ select error (catch):', e);
        return [];
      });
      console.log('Fetched FAQs rows:', Array.isArray(rows) ? rows.length : typeof rows);
      faqs = (rows as Faq[]) ?? [];
    } catch (err) {
      console.error("Error fetching FAQs:", err instanceof Error ? err : String(err));
      faqs = [];
    }

    try {
      services = await getAllServices();
    } catch (err) {
      console.error("Error fetching services:", err instanceof Error ? err : String(err));
      services = [];
    }

    try {
      const rows = await db
        .select({
          title: blogPostsTable.title,
          slug: blogPostsTable.slug,
          excerpt: blogPostsTable.excerpt,
          coverImageUrl: blogPostsTable.coverImageUrl,
          publishedAt: blogPostsTable.publishedAt,
          category: blogPostsTable.category,
        })
        .from(blogPostsTable)
        .orderBy(desc(blogPostsTable.publishedAt))
        .limit(3)
        .catch((e: unknown) => {
          console.error('Blog posts select error (catch):', e);
          return [];
        });
      blogPosts = (rows as BlogPost[]) ?? [];
    } catch (err) {
      console.error("Error fetching blog posts:", err instanceof Error ? err : String(err));
      blogPosts = [];
    }
  }

  // Fallback: if homepage singleton has no banner set, try the page-sections 'hero' image
  if (!hero?.bannerImageUrl) {
    const pageWithSections = await getPageWithSections("home").catch(() => null);
    if (pageWithSections) {
      const heroSection = pageWithSections.sections.find((s) => s.type === "hero");
      if (heroSection && heroSection.data) {
        try {
          const data = typeof heroSection.data === "string" ? JSON.parse(heroSection.data) : (heroSection.data as any);
          sectionBannerUrl = data?.bannerImageUrl ?? undefined;
        } catch {
          // ignore parse errors
        }
      }
    }
  }

  return <Homepage hero={hero ?? null} fallbackBannerUrl={sectionBannerUrl ?? null} faqs={faqs} services={services} blogPosts={blogPosts} />;
}
