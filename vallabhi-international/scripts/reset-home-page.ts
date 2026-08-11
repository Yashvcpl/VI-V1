/**
 * Replaces the Home page's sections with the approved design's layout:
 * Hero -> About (text + image) -> Our Financial Solution (services) ->
 * Our Advisory Process (steps) -> Schedule a Consultation (form split).
 *
 * Safe to re-run. Only touches the "home" page's sections - does not
 * touch any other page, nor any Services/Testimonials/etc. content.
 *
 * Usage: npm run reset-home-page
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { pages, pageSections } from "../src/lib/db/schema";

const newSections = [
  {
    type: "hero",
    data: {
      heading: "Building Connections",
      headingAccent: "Creating Opportunities",
      subheading: "Your Global Partner for a Successful Tomorrow.",
      bannerImageUrl: "/hero-team-photo.webp",
      bannerImageAlt: "The Vallabhi International advisory team",
      primaryCtaLabel: "Explore More",
      primaryCtaHref: "/services",
    },
  },
  {
    type: "textBlock",
    data: {
      heading: "About Vallabhi International",
      subheading: "Helping businesses raise capital, manage risk, and unlock growth through expert financial advisory.",
      greenHeading: true,
      twoColumn: true,
      body:
        "Vallabhi International is a trusted financial advisory firm dedicated to helping businesses unlock growth through strategic capital solutions and expert financial guidance. We partner with entrepreneurs, corporates, and institutions to deliver customized advisory services that support sustainable growth, long-term value creation, and confident decision-making.",
    },
  },
  {
    type: "serviceListing",
    data: { heading: "Our Financial Solution", showViewAllLink: false },
  },
  {
    type: "processSteps",
    data: {
      heading: "Our Advisory Process",
      items: [
        "Discovery & Consultation | Lorem ipsum is simply dummy text of the printing.",
        "Financial Assessment | Lorem ipsum is simply dummy text of the printing.",
        "Tailored Strategy | Lorem ipsum is simply dummy text of the printing.",
        "Execution & Ongoing Support | Lorem ipsum is simply dummy text of the printing.",
      ].join("\n"),
    },
  },
  {
    type: "consultationForm",
    data: {
      heading: "Schedule Your Free Financial Consultation",
      formSource: "contact-us",
      messageLabel: "Message",
      submitLabel: "Submit",
    },
  },
];

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  const [homePage] = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1);
  if (!homePage) {
    console.error('No "home" page found - run `npm run seed-pages` first.');
    process.exit(1);
  }

  await db.delete(pageSections).where(eq(pageSections.pageId, homePage.id));

  for (let i = 0; i < newSections.length; i++) {
    const section = newSections[i];
    await db.insert(pageSections).values({
      pageId: homePage.id,
      type: section.type,
      data: JSON.stringify(section.data),
      visible: true,
      sortOrder: i,
    });
  }

  console.log(`Reset "home" page with ${newSections.length} sections matching the approved design.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to reset home page:", error);
  process.exit(1);
});
