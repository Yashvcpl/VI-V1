/**
 * Seeds the `pages` and `page_sections` tables with the site's initial
 * layout, matching what was previously hardcoded. Run once after migrating:
 *   npm run seed-pages
 * Safe to re-run - it skips any page slug that already exists.
 */
import "dotenv/config";
import { asc, eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { pages, pageSections, companyValues, leadershipMembers } from "../src/lib/db/schema";

interface SeedSection {
  type: string;
  data: Record<string, unknown>;
}

interface SeedPage {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription: string;
  sections: SeedSection[];
}

const seedPages: SeedPage[] = [
  {
    slug: "home",
    title: "Home",
    seoDescription:
      "Vallabhi International is a trusted financial advisory firm helping businesses raise capital, manage risk, and unlock growth through expert financial advisory.",
    sections: [
      {
        type: "hero",
        data: {
          heading: "Building Connections",
          headingAccent: "Creating Opportunities",
          subheading: "Your Global Partner for a Successful Tomorrow.",
          bannerImageUrl: "",
          bannerImageAlt: "The Vallabhi International advisory team",
          primaryCtaLabel: "Explore More",
          primaryCtaHref: "/services",
        },
      },
      {
        type: "textBlock",
        data: {
          heading: "About Vallabhi International",
          subheading:
            "Helping businesses raise capital, manage risk, and unlock growth through expert financial advisory.",
          greenHeading: true,
          twoColumn: true,
          imageUrl: "",
          body:
            "Vallabhi International is a trusted financial advisory firm dedicated to helping businesses unlock growth through strategic capital solutions and expert financial guidance. We partner with entrepreneurs, corporates, and institutions to deliver customized advisory services that support sustainable growth, long-term value creation, and confident decision-making.",
        },
      },
      {
        type: "serviceListing",
        data: {
          heading: "Our Financial Solution",
          showViewAllLink: false,
        },
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
          subheading:
            "Share your details and our advisor will reach out to discuss an indicative loan plan for your business.",
          sideImageUrl: "",
          formSource: "contact-us",
          messageLabel: "Message",
          submitLabel: "Submit",
        },
      },
    ],
  },
  {
    slug: "about-us",
    title: "About Us",
    seoDescription:
      "Vallabhi Capital is an RBI-registered NBFC founded in 2021, built to close the credit gap for MSMEs, traders and exporters across India.",
    sections: [
      {
        type: "hero",
        data: {
          eyebrow: "About Vallabhi International",
          heading: "Why Choose Vallabhi International",
          headingAccent: "Expert advisory for sustainable growth",
          subheading:
            "We combine deep financial expertise with a client-centric approach to deliver strategic advisory solutions tailored to each client’s unique goals and long-term success.",
          bannerImageUrl: "",
          bannerImageAlt:
            "Vallabhi International leaders in a corporate office",
          bannerOverlayColor: "rgba(3,29,23,0.78)",
        },
      },
      {
        type: "textBlock",
        data: {
          eyebrow: "Why choose Vallabhi International",
          heading:
            "A premium financial advisory partner for ambitious companies.",
          subheading:
            "Our approach is disciplined, transparent, and designed to help you navigate credit, capital, and growth with confidence.",
          body:
            "At Vallabhi International, we combine deep financial expertise with a client-centric approach to deliver strategic advisory solutions. From debt syndication and capital markets to private equity, valuation, and insolvency advisory, our team works closely with every client to understand their unique objectives and develop tailored financial strategies.",
          twoColumn: true,
          imageUrl: "",
        },
      },
      {
        type: "teamGrid",
        data: {
          eyebrow: "Meet our founders",
          heading: "The leadership shaping our strategy.",
        },
      },
      {
        type: "timeline",
        data: {
          eyebrow: "Our Journey",
          heading: "From incorporation to impact.",
        },
      },
      {
        type: "valuesGrid",
        data: {
          eyebrow: "Our Philosophy",
          heading: "A modern advisory ethos.",
        },
      },
      {
        type: "imageGallery",
        data: {
          eyebrow: "Life at Vallabhi",
          heading: "A look inside the team.",
        },
      },
    ],
  },
  {
    slug: "services",
    title: "Services",
    seoDescription: "Explore Vallabhi International's lending products",
    sections: [
      {
        type: "serviceListing",
        data: {
          eyebrow: "Services",
          heading: "Finance built around your business.",
          showViewAllLink: false,
        },
      },
    ],
  },
  {
    slug: "insights-blogs",
    title: "Insights - Blogs",
    seoDescription:
      "Perspectives on MSME lending, financial inclusion and small business growth from the Vallabhi International team.",
    sections: [
      {
        type: "contentListing",
        data: {
          eyebrow: "Insights",
          heading: "Blogs",
          source: "blogPosts",
        },
      },
    ],
  },
  {
    slug: "insights-news",
    title: "Insights - News",
    seoDescription:
      "Company announcements and press coverage for Vallabhi International and Vallabhi Capital.",
    sections: [
      {
        type: "contentListing",
        data: {
          eyebrow: "Insights",
          heading: "News",
          source: "newsItems",
        },
      },
    ],
  },
  {
    slug: "insights-reports",
    title: "Insights - Reports",
    seoDescription:
      "Download research reports and disclosures published by Vallabhi International.",
    sections: [
      {
        type: "contentListing",
        data: {
          eyebrow: "Insights",
          heading: "Reports",
          source: "reports",
        },
      },
    ],
  },
  {
    slug: "careers",
    title: "Careers",
    seoDescription:
      "Join Vallabhi International - explore open roles and build a career closing India's MSME credit gap.",
    sections: [
      {
        type: "textBlock",
        data: {
          eyebrow: "Careers",
          heading: "Build the infrastructure MSME India runs on.",
          body:
            "We're a small, deliberate team working on credit access, underwriting and operations for one of India's most underserved business segments.",
        },
      },
      {
        type: "jobOpeningsList",
        data: {
          heading: "Build Your Career With Us",
        },
      },
      {
        type: "contactForm",
        data: {
          heading: "Get in touch about a role",
          subheading:
            "Tell us a bit about yourself and which role (or type of role) interests you.",
          formSource: "careers",
          messageLabel: "Tell us about yourself",
          submitLabel: "Send Application",
        },
      },
    ],
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    seoDescription:
      "Get in touch with Vallabhi International for MSME loans, loan against property, equipment finance and general enquiries.",
    sections: [
      {
        type: "contactInfoBlock",
        data: {
          eyebrow: "Contact Us",
          heading: "Let's talk about your business.",
          subheading:
            "Whether you have a question about a loan product or want to discuss a partnership, our team typically responds within one business day.",
        },
      },
      {
        type: "contactForm",
        data: {
          heading: "Send us a message",
          formSource: "contact-us",
          messageLabel: "How can we help?",
          submitLabel: "Send Message",
        },
      },
    ],
  },
];

async function main() {
  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  for (const seedPage of seedPages) {
    const [existing] = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, seedPage.slug))
      .limit(1);

    let page;

    if (existing) {
      page = existing;
      console.log(`Updating "${seedPage.slug}".`);

      await db
        .delete(pageSections)
        .where(eq(pageSections.pageId, page.id));

      await db
        .update(pages)
        .set({
          title: seedPage.title,
          seoTitle: seedPage.seoTitle,
          seoDescription: seedPage.seoDescription,
        })
        .where(eq(pages.id, page.id));
    } else {
      const [newPage] = await db
        .insert(pages)
        .values({
          slug: seedPage.slug,
          title: seedPage.title,
          seoTitle: seedPage.seoTitle,
          seoDescription: seedPage.seoDescription,
        })
        .returning();

      page = newPage;
      console.log(`Seeding "${seedPage.slug}".`);
    }

    for (let i = 0; i < seedPage.sections.length; i++) {
      const section = seedPage.sections[i];

      await db.insert(pageSections).values({
        pageId: page.id,
        type: section.type,
        data: JSON.stringify(section.data),
        visible: true,
        sortOrder: i,
      });
    }

    console.log(
      `Saved "${seedPage.slug}" with ${seedPage.sections.length} sections.`
    );
  }

  const valuesSeed = [
    {
      title: "Mission",
      description:
        "To help businesses achieve sustainable growth by delivering trusted financial advice, tailored solutions, and strategic support rooted in integrity and expertise.",
      iconUrl: "",
      iconAlt: "Mission icon",
      sortOrder: 0,
    },
    {
      title: "Vision",
      description:
        "To become a leading financial advisory firm recognized for creating long-term value, driving sustainable growth, and delivering impact across domestic and international markets.",
      iconUrl: "",
      iconAlt: "Vision icon",
      sortOrder: 1,
    },
    {
      title: "Values",
      description:
        "Our values are built on integrity, transparency, excellence, innovation, and a client-first approach, guiding every decision we make. They inspire trust, foster lasting partnerships, and drive sustainable success for our clients.",
      iconUrl: "",
      iconAlt: "Values icon",
      sortOrder: 2,
    },
  ];

  const existingValues = await db
    .select()
    .from(companyValues)
    .catch(() => []);

  for (const seedValue of valuesSeed) {
    const existing = existingValues.find(
      (value: { title?: string | null; id?: number }) =>
        String(value.title).toLowerCase() === seedValue.title.toLowerCase()
    );

    if (existing) {
      await db
        .update(companyValues)
        .set({
          description: seedValue.description,
          iconUrl: seedValue.iconUrl,
          iconAlt: seedValue.iconAlt,
          sortOrder: seedValue.sortOrder,
        })
        .where(eq(companyValues.id, existing.id));
    } else {
      await db.insert(companyValues).values(seedValue);
    }
  }

  console.log(`Seeded ${valuesSeed.length} company values rows.`);

  /*
  const leadershipSeed = [
    {
      name: "Amit Patel",
      role: "Founder & CEO",
      photoUrl: "",
      photoAlt: "Amit Patel",
      bio: "Amit leads Vallabhi International with over a decade of financial advisory experience, building capital strategies for rapidly scaling businesses.",
      sortOrder: 0,
    },
    {
      name: "Neha Sharma",
      role: "Co-Founder & COO",
      photoUrl: "",
      photoAlt: "Neha Sharma",
      bio: "Neha oversees operations and client delivery, ensuring every engagement is executed with precision and trust.",
      sortOrder: 1,
    },
    {
      name: "Rahul Mehta",
      role: "Co-Founder & CFO",
      photoUrl: "",
      photoAlt: "Rahul Mehta",
      bio: "Rahul drives financial strategy and risk management, bringing deep capital markets insight to every client solution.",
      sortOrder: 2,
    },
  ];

  const existingLeadership = await db
    .select()
    .from(leadershipMembers)
    .catch(() => []);

  if (existingLeadership.length === 0) {
    for (const leader of leadershipSeed) {
      await db.insert(leadershipMembers).values(leader);
    }

    console.log(`Seeded ${leadershipSeed.length} founder rows.`);
  } else {
    console.log(
      `Found ${existingLeadership.length} existing founder rows; skipping leadership seed.`
    );
  }
  */

  process.exit(0);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});