import type { PgTable } from "drizzle-orm/pg-core";
import {
  services,
  blogPosts,
  newsItems,
  reports,
  leadershipMembers,
  testimonials,
  partners,
  jobOpenings,
  jobApplications,
  journeyMilestones,
  companyValues,
  galleryImages,
  siteSettings,
  homepageHero,
  faqs,
  industries,
  caseStudies,
  navigationItems,
} from "@/lib/db/schema";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "images"
  | "boolean"
  | "number"
  | "datetime"
  | "serviceContentBlocks";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
}

export interface EntityConfig {
  /** URL-safe key, used as /admin/<key> */
  key: string;
  label: string;
  pluralLabel: string;
  table: PgTable;
  /** Singleton content (Hero, Site Settings) skips the list view - edits row id 1 directly. */
  singleton?: boolean;
  /** Column shown in the list table as the row's title. */
  titleField: string;
  /** Optional secondary column shown in the list table. */
  subtitleField?: string;
  fields: FieldConfig[];
  /** Public-facing route to preview a single item, e.g. (row) => `/services/${row.slug}` */
  previewPath?: (row: Record<string, unknown>) => string;
  /** Read-only entities cannot be edited in admin and are shown for review only. */
  readOnly?: boolean;
}

export const entities: Record<string, EntityConfig> = {
  services: {
    key: "services",
    label: "Service",
    pluralLabel: "Services",
    table: services,
    titleField: "title",
    subtitleField: "summary",
    previewPath: (row) => `/services/${row.slug}`,
    fields: [
      { key: "title", label: "Service title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true, help: "e.g. msme-loans - shown at /services/msme-loans" },
      { key: "summary", label: "Short summary (shown on listing page)", type: "textarea", required: true },
      { key: "iconUrl", label: "Service icon / image", type: "image" },
      { key: "bannerImageUrl", label: "Hero banner image", type: "image", help: "Upload, replace, remove, and preview the service banner image." },
      { key: "bannerImageAlt", label: "Banner alt text", type: "text" },
      { key: "bannerOverlayOpacity", label: "Banner overlay opacity (0-100)", type: "number" },
      { key: "serviceContentBlocks", label: "Service content blocks", type: "serviceContentBlocks", help: "Add, edit, delete, and reorder heading + content blocks for this service. The order here is the order shown on the page." },
      { key: "introHeading", label: "Intro heading", type: "text", help: "Optional heading shown above the service intro content." },
      { key: "introBody", label: "Intro body", type: "markdown", help: "Intro content shown near the top of the service page." },
      { key: "offeringsSectionTitle", label: "Offerings section title", type: "text", help: "Title for the offerings section." },
      { key: "offeringsSectionSubtitle", label: "Offerings section subtitle", type: "textarea", help: "Optional subtitle text below the offerings section title." },
      { key: "offerings", label: "Offerings", type: "textarea", help: "One offering per line in the format Title: Description." },
      { key: "whyChooseHeading", label: "Why choose heading", type: "text", help: "Heading for the why choose section." },
      { key: "whyChooseItems", label: "Why choose items", type: "textarea", help: "One item per line in the format Title: Description." },
      { key: "body", label: "Additional section body", type: "markdown", help: "Additional content shown below the intro section." },
      { key: "ctaHeading", label: "CTA heading", type: "text" },
      { key: "ctaDescription", label: "CTA description", type: "textarea" },
      { key: "ctaButtonText", label: "CTA button text", type: "text" },
      { key: "eligibilityHighlights", label: "Highlights", type: "textarea", help: "One highlight per line, shown in the service overview box." },
      { key: "published", label: "Published", type: "boolean" },
      { key: "sortOrder", label: "Display order", type: "number" },
      { key: "seoTitle", label: "SEO title (optional, falls back to Title)", type: "text" },
      { key: "seoDescription", label: "SEO meta description", type: "textarea", required: true },
    ],
  },
  blogPosts: {
    key: "blogPosts",
    label: "Blog Post",
    pluralLabel: "Blog Posts",
    table: blogPosts,
    titleField: "title",
    subtitleField: "category",
    previewPath: (row) => `/insights/blogs/${row.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "excerpt", label: "Excerpt (shown on listing page)", type: "textarea", required: true },
      { key: "coverImageUrl", label: "Cover image", type: "image" },
      { key: "authorName", label: "Author name", type: "text", required: true },
      { key: "category", label: "Category", type: "text" },
      { key: "publishedAt", label: "Published date", type: "datetime" },
      { key: "body", label: "Body", type: "markdown" },
      { key: "seoTitle", label: "SEO title (optional)", type: "text" },
      { key: "seoDescription", label: "SEO meta description (optional, falls back to Excerpt)", type: "textarea" },
    ],
  },
  newsItems: {
    key: "newsItems",
    label: "News Item",
    pluralLabel: "News",
    table: newsItems,
    titleField: "title",
    subtitleField: undefined,
    previewPath: (row) => `/insights/news/${row.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "externalSourceUrl", label: "Original source URL (if press coverage)", type: "text" },
      { key: "publishedAt", label: "Published date", type: "datetime" },
      { key: "body", label: "Body", type: "markdown" },
      { key: "seoDescription", label: "SEO meta description (optional)", type: "textarea" },
    ],
  },
  reports: {
    key: "reports",
    label: "Report",
    pluralLabel: "Reports",
    table: reports,
    titleField: "title",
    subtitleField: undefined,
    previewPath: (row) => `/insights/reports/${row.slug}`,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "coverImageUrl", label: "Cover image", type: "image" },
      { key: "pdfUrl", label: "PDF file", type: "image", help: "Upload the report PDF - uses the same uploader as images." },
      { key: "publishedAt", label: "Published date", type: "datetime" },
      { key: "seoDescription", label: "SEO meta description (optional)", type: "textarea" },
    ],
  },
  leadershipMembers: {
    key: "leadershipMembers",
    label: "Leadership Member",
    pluralLabel: "Leadership Team",
    table: leadershipMembers,
    titleField: "name",
    subtitleField: "role",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role / title", type: "text", required: true },
      { key: "photoUrl", label: "Photo", type: "image" },
      { key: "photoAlt", label: "Photo alt text", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "text" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  testimonials: {
    key: "testimonials",
    label: "Testimonial",
    pluralLabel: "Client Testimonials",
    table: testimonials,
    titleField: "clientName",
    subtitleField: "clientBusiness",
    fields: [
      { key: "clientName", label: "Client name", type: "text", required: true },
      { key: "clientBusiness", label: "Business / designation", type: "text" },
      { key: "clientPhotoUrl", label: "Client photo", type: "image" },
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "loanType", label: "Related loan type", type: "text" },
      { key: "featured", label: "Show on homepage", type: "boolean" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  partners: {
    key: "partners",
    label: "Partner / Investor",
    pluralLabel: "Partners & Investors",
    table: partners,
    titleField: "name",
    subtitleField: "category",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "logoUrl", label: "Logo", type: "image", required: true },
      { key: "websiteUrl", label: "Website URL", type: "text" },
      { key: "category", label: "Category (e.g. Lending Partner, Investor)", type: "text" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  jobOpenings: {
    key: "jobOpenings",
    label: "Job Opening",
    pluralLabel: "Job Openings",
    table: jobOpenings,
    titleField: "title",
    subtitleField: "location",
    fields: [
      { key: "title", label: "Job title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "department", label: "Department", type: "text" },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "employmentType", label: "Employment type (Full-time / Part-time / Internship / Contract)", type: "text" },
      { key: "experience", label: "Experience required (e.g. 3-5 years)", type: "text" },
      { key: "salary", label: "Salary (optional)", type: "text" },
      { key: "summary", label: "Short summary", type: "textarea" },
      { key: "description", label: "Job description", type: "markdown" },
      { key: "responsibilities", label: "Roles & Responsibilities (markdown)", type: "markdown" },
      { key: "skills", label: "Required skills (comma or newline separated)", type: "textarea" },
      { key: "qualifications", label: "Qualifications (markdown)", type: "markdown" },
      { key: "benefits", label: "Benefits (markdown)", type: "markdown" },
      { key: "applicationDeadline", label: "Application deadline", type: "datetime" },
      { key: "applyEmail", label: "Apply email", type: "text" },
      { key: "isOpen", label: "Currently open", type: "boolean" },
      { key: "sortOrder", label: "Display order", type: "number" },
      { key: "seoTitle", label: "SEO title", type: "text" },
      { key: "seoDescription", label: "SEO meta description", type: "textarea" },
    ],
  },

  jobApplications: {
    key: "jobApplications",
    label: "Application",
    pluralLabel: "Applications",
    table: jobApplications,
    titleField: "fullName",
    subtitleField: "email",
    readOnly: true,
    fields: [
      { key: "jobId", label: "Job (ID)", type: "number", required: true, help: "The job ID this application belongs to" },
      { key: "fullName", label: "Full name", type: "text", required: true },
      { key: "email", label: "Email address", type: "text", required: true },
      { key: "phone", label: "Phone number", type: "text" },
      { key: "currentLocation", label: "Current location", type: "text" },
      { key: "linkedinUrl", label: "LinkedIn profile", type: "text" },
      { key: "portfolioUrl", label: "Portfolio URL", type: "text" },
      { key: "coverLetter", label: "Cover letter / message", type: "textarea" },
      { key: "resumeUrl", label: "Resume URL", type: "text" },
      { key: "status", label: "Application status", type: "text" },
    ],
  },
  journeyMilestones: {
    key: "journeyMilestones",
    label: "Journey Milestone",
    pluralLabel: "Journey Milestones (About Us)",
    table: journeyMilestones,
    titleField: "year",
    subtitleField: "description",
    fields: [
      { key: "year", label: "Year", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  companyValues: {
    key: "companyValues",
    label: "Company Value",
    pluralLabel: "Company Values (About Us)",
    table: companyValues,
    titleField: "title",
    subtitleField: "description",
    fields: [
      { key: "title", label: "Value title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "iconUrl", label: "Value icon", type: "image" },
      { key: "iconAlt", label: "Value icon alt text", type: "text" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  galleryImages: {
    key: "galleryImages",
    label: "Gallery Image",
    pluralLabel: "Life at Vallabhi (Gallery)",
    table: galleryImages,
    titleField: "caption",
    subtitleField: undefined,
    fields: [
      { key: "imageUrl", label: "Image", type: "image", required: true },
      { key: "caption", label: "Caption (optional, for internal reference)", type: "text" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  siteSettings: {
    key: "siteSettings",
    label: "Site Settings",
    pluralLabel: "Site Settings",
    table: siteSettings,
    singleton: true,
    titleField: "companyOverview",
    fields: [
      { key: "companyOverview", label: "Company overview (About Us intro)", type: "markdown" },
      { key: "contactAddress", label: "Contact address", type: "textarea" },
      { key: "contactPhone", label: "Contact phone", type: "text" },
      { key: "contactEmail", label: "Contact email", type: "text" },
      { key: "businessHours", label: "Business hours", type: "text" },
      { key: "googleMapUrl", label: "Google map URL", type: "text" },
      { key: "socialLinks", label: "Social links (one per line, format: Label | URL)", type: "textarea" },
    ],
  },
  homepageHero: {
    key: "homepageHero",
    label: "Hero Banner",
    pluralLabel: "Hero Banner",
    table: homepageHero,
    singleton: true,
    titleField: "heading",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", help: "Small label above the hero heading." },
      { key: "heading", label: "Hero heading", type: "text", help: "Main headline displayed in the hero section." },
      { key: "subheading", label: "Hero description", type: "textarea", help: "Supporting text beneath the hero heading." },
      { key: "primaryCtaLabel", label: "Primary CTA label", type: "text" },
      { key: "primaryCtaHref", label: "Primary CTA link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary CTA label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary CTA link", type: "text" },
      { key: "bannerDesktopImageUrl", label: "Desktop hero banner", type: "image", help: "Upload, replace, remove, or preview the primary desktop hero banner. Recommended size 1920x735." },
      { key: "bannerDesktopImageAlt", label: "Desktop banner alt text", type: "text" },
      { key: "bannerMobileImageUrl", label: "Mobile hero banner", type: "image", help: "Upload, replace, remove, or preview the mobile hero banner. Recommended size 900x1600 or vertical-oriented." },
      { key: "bannerMobileImageAlt", label: "Mobile banner alt text", type: "text" },
      { key: "bannerImageUrl", label: "Fallback single banner", type: "image", help: "Upload, replace, remove, or preview a backup hero banner image for broader compatibility." },
      { key: "bannerImageAlt", label: "Fallback banner alt text", type: "text" },
      { key: "aboutSectionImageUrl", label: "About section image", type: "image" },
      { key: "aboutSectionImageAlt", label: "About section image alt text", type: "text" },
      { key: "consultationSectionImageUrl", label: "Consultation section image", type: "image" },
      { key: "consultationSectionImageAlt", label: "Consultation section image alt text", type: "text" },
    ],
  },
  industries: {
    key: "industries",
    label: "Industry",
    pluralLabel: "Industries",
    table: industries,
    titleField: "title",
    subtitleField: "summary",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "summary", label: "Short summary", type: "textarea", required: true },
      { key: "iconUrl", label: "Icon / image", type: "image" },
      { key: "body", label: "Full description", type: "markdown" },
      { key: "sortOrder", label: "Display order", type: "number" },
      { key: "seoDescription", label: "SEO meta description", type: "textarea", required: true },
    ],
  },
  caseStudies: {
    key: "caseStudies",
    label: "Case Study",
    pluralLabel: "Case Studies",
    table: caseStudies,
    titleField: "title",
    subtitleField: "clientName",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug (URL path)", type: "text", required: true },
      { key: "clientName", label: "Client name", type: "text" },
      { key: "industry", label: "Industry", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { key: "coverImageUrl", label: "Cover image", type: "image" },
      { key: "body", label: "Full case study", type: "markdown" },
      { key: "publishedAt", label: "Published date", type: "datetime" },
      { key: "seoDescription", label: "SEO meta description (optional)", type: "textarea" },
    ],
  },
  navigationItems: {
    key: "navigationItems",
    label: "Navigation Item",
    pluralLabel: "Navigation Menus",
    table: navigationItems,
    titleField: "label",
    subtitleField: "href",
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "href", label: "Link (e.g. /services or /about-us)", type: "text", required: true },
      { key: "location", label: "Location (header / footer / insights-dropdown)", type: "text", required: true },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  faqs: {
    key: "faqs",
    label: "FAQ",
    pluralLabel: "FAQs",
    table: faqs,
    titleField: "question",
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "markdown", required: true },
      { key: "published", label: "Published", type: "boolean" },
      { key: "sortOrder", label: "Display order", type: "number" },
    ],
  },
};

export function getEntity(key: string): EntityConfig | undefined {
  return entities[key];
}
