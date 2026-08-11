import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

/* ---------------------------------------------------------------------- */
/* Auth - admin users who can log into /admin                             */
/* ---------------------------------------------------------------------- */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 200 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------------------------------------------------------------------- */
/* Leads - contact/loan-eligibility/careers form submissions              */
/* ---------------------------------------------------------------------- */

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  companyName: varchar("company_name", { length: 200 }),
  subject: varchar("subject", { length: 200 }),
  source: varchar("source", { length: 50 }).notNull(),
  message: text("message"),
  loanType: varchar("loan_type", { length: 100 }),
  requestedAmount: varchar("requested_amount", { length: 50 }),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  isSpam: boolean("is_spam").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------------------------------------------------------------------- */
/* Content - everything editable from /admin                              */
/* ---------------------------------------------------------------------- */

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  summary: varchar("summary", { length: 300 }).notNull(),
  iconUrl: text("icon_url"),
  bannerImageUrl: text("banner_image_url"),
  bannerImageAlt: varchar("banner_image_alt", { length: 200 }),
  bannerOverlayOpacity: integer("banner_overlay_opacity").notNull().default(55),
  introHeading: varchar("intro_heading", { length: 200 }),
  introBody: text("intro_body"),
  offeringsSectionTitle: varchar("offerings_section_title", { length: 200 }),
  offeringsSectionSubtitle: varchar("offerings_section_subtitle", { length: 300 }),
  offerings: text("offerings"),
  whyChooseHeading: varchar("why_choose_heading", { length: 200 }),
  whyChooseItems: text("why_choose_items"),
  ctaHeading: varchar("cta_heading", { length: 200 }),
  ctaDescription: text("cta_description"),
  ctaButtonText: varchar("cta_button_text", { length: 100 }),
  serviceContentBlocks: text("service_content_blocks").default("[]"),
  body: text("body"), // markdown
  eligibilityHighlights: text("eligibility_highlights"), // newline-separated
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 170 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: varchar("excerpt", { length: 300 }).notNull(),
  coverImageUrl: text("cover_image_url"),
  authorName: varchar("author_name", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  body: text("body"), // markdown
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 170 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsItems = pgTable("news_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  summary: varchar("summary", { length: 300 }).notNull(),
  externalSourceUrl: text("external_source_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  body: text("body"), // markdown
  seoDescription: varchar("seo_description", { length: 170 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  summary: varchar("summary", { length: 300 }).notNull(),
  coverImageUrl: text("cover_image_url"),
  pdfUrl: text("pdf_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  seoDescription: varchar("seo_description", { length: 170 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leadershipMembers = pgTable("leadership_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  photoUrl: text("photo_url"),
  photoAlt: varchar("photo_alt", { length: 200 }),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 200 }).notNull(),
  clientBusiness: varchar("client_business", { length: 200 }),
  clientPhotoUrl: text("client_photo_url"),
  quote: varchar("quote", { length: 500 }).notNull(),
  loanType: varchar("loan_type", { length: 100 }),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  category: varchar("category", { length: 100 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const jobOpenings = pgTable("job_openings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  department: varchar("department", { length: 150 }),
  location: varchar("location", { length: 150 }).notNull(),
  employmentType: varchar("employment_type", { length: 50 }),
  summary: varchar("summary", { length: 500 }),
  experience: varchar("experience", { length: 100 }),
  salary: varchar("salary", { length: 100 }),
  description: text("description"), // markdown
  responsibilities: text("responsibilities"), // markdown or newline-separated
  skills: text("skills"), // comma/newline separated
  qualifications: text("qualifications"),
  benefits: text("benefits"),
  applicationDeadline: timestamp("application_deadline", { withTimezone: true }),
  applyEmail: varchar("apply_email", { length: 320 }),
  isOpen: boolean("is_open").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 170 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  currentLocation: varchar("current_location", { length: 200 }),
  linkedinUrl: varchar("linkedin_url", { length: 300 }),
  portfolioUrl: varchar("portfolio_url", { length: 300 }),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const journeyMilestones = pgTable("journey_milestones", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 20 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const companyValues = pgTable("company_values", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  iconUrl: text("icon_url"),
  iconAlt: varchar("icon_alt", { length: 200 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: varchar("caption", { length: 200 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  summary: varchar("summary", { length: 300 }).notNull(),
  iconUrl: text("icon_url"),
  body: text("body"), // markdown
  sortOrder: integer("sort_order").notNull().default(0),
  seoDescription: varchar("seo_description", { length: 170 }).notNull(),
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  clientName: varchar("client_name", { length: 200 }),
  industry: varchar("industry", { length: 150 }),
  excerpt: varchar("excerpt", { length: 300 }).notNull(),
  coverImageUrl: text("cover_image_url"),
  body: text("body"), // markdown
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  seoDescription: varchar("seo_description", { length: 170 }),
});

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  fileName: varchar("file_name", { length: 300 }).notNull(),
  contentType: varchar("content_type", { length: 100 }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ---------------------------------------------------------------------- */
/* Page builder - every public page is a row here + an ordered list of      */
/* sections. Detail templates (a single service/blog post/job) are NOT     */
/* page-builder pages - they're rendered straight from their own table row. */
/* ---------------------------------------------------------------------- */

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // "home", "about-us", "services", ...
  title: varchar("title", { length: 200 }).notNull(),
  seoTitle: varchar("seo_title", { length: 70 }),
  seoDescription: varchar("seo_description", { length: 170 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pageSections = pgTable("page_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // see src/lib/pagebuilder/sectionTypes.ts
  data: text("data").notNull().default("{}"), // JSON-encoded, shape depends on `type`
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const navigationItems = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  href: varchar("href", { length: 200 }).notNull(),
  location: varchar("location", { length: 20 }).notNull().default("header"), // "header" | "footer" | "insights-dropdown"
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ---------------------------------------------------------------------- */
/* Singletons: enforced by convention (always read/write the row with      */
/* id = 1), not a DB constraint - see src/lib/admin/entities.ts.           */
/* ---------------------------------------------------------------------- */

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  companyOverview: text("company_overview"), // markdown
  contactAddress: text("contact_address"),
  contactPhone: varchar("contact_phone", { length: 30 }),
  contactEmail: varchar("contact_email", { length: 320 }),
  businessHours: varchar("business_hours", { length: 200 }),
  googleMapUrl: text("google_map_url"),
  socialLinks: text("social_links"),
});

export const homepageHero = pgTable("homepage_hero", {
  id: integer("id").primaryKey().default(1),
  eyebrow: varchar("eyebrow", { length: 100 }),
  heading: varchar("heading", { length: 150 }).notNull(),
  subheading: varchar("subheading", { length: 400 }).notNull(),
  bannerImageUrl: text("banner_image_url"),
  bannerImageAlt: varchar("banner_image_alt", { length: 200 }),
  bannerDesktopImageUrl: text("banner_desktop_image_url"),
  bannerDesktopImageAlt: varchar("banner_desktop_image_alt", { length: 200 }),
  bannerMobileImageUrl: text("banner_mobile_image_url"),
  bannerMobileImageAlt: varchar("banner_mobile_image_alt", { length: 200 }),
  bannerImages: text("banner_images"), // JSON array of {url, alt} objects
  aboutSectionImageUrl: text("about_section_image_url"),
  aboutSectionImageAlt: varchar("about_section_image_alt", { length: 200 }),
  consultationSectionImageUrl: text("consultation_section_image_url"),
  consultationSectionImageAlt: varchar("consultation_section_image_alt", { length: 200 }),
  primaryCtaLabel: varchar("primary_cta_label", { length: 60 }),
  primaryCtaHref: varchar("primary_cta_href", { length: 200 }),
  secondaryCtaLabel: varchar("secondary_cta_label", { length: 60 }),
  secondaryCtaHref: varchar("secondary_cta_href", { length: 200 }),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: text("answer").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type NewLead = typeof leads.$inferInsert;

export type Service = typeof services.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewsItem = typeof newsItems.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type LeadershipMember = typeof leadershipMembers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type JobOpening = typeof jobOpenings.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type JourneyMilestone = typeof journeyMilestones.$inferSelect;
export type CompanyValue = typeof companyValues.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Industry = typeof industries.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type HomepageHero = typeof homepageHero.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type NavigationItem = typeof navigationItems.$inferSelect;
