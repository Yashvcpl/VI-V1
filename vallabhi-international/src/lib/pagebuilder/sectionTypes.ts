import type { FieldConfig } from "@/lib/admin/entities";

/**
 * Every section type a page can be built from. `fields` drives the admin
 * edit form for that section (same FieldConfig shape used elsewhere in the
 * admin, so AdminEntityForm-style rendering logic is reusable). `dataDriven`
 * marks sections that pull their list content live from another table
 * (Services, Testimonials, etc.) rather than storing it in the section's own
 * JSON - editing that content happens on its own admin page, not here.
 *
 * Repeating items inside a section's own JSON (FAQ questions, stat rows,
 * icon-grid items) are edited as one-per-line text using a "label|value"
 * or "title|description" convention, parsed at render time
 * (see src/lib/pagebuilder/parseLines.ts). This is a deliberate simplification
 * instead of a nested drag-and-drop repeater editor within a section editor.
 */
export interface SectionTypeConfig {
  type: string;
  label: string;
  description: string;
  dataDriven?: boolean;
  fields: FieldConfig[];
  defaultData: Record<string, unknown>;
}

export const sectionTypes: Record<string, SectionTypeConfig> = {
  hero: {
    type: "hero",
    label: "Hero Banner",
    description: "Full-width intro banner with a headline, copy, buttons, and a background image.",
    fields: [
      { key: "heading", label: "Headline (line 1)", type: "text" },
      { key: "headingAccent", label: "Headline (line 2, optional)", type: "text" },
      { key: "subheading", label: "Supporting paragraph", type: "textarea" },
      { key: "bannerImageUrl", label: "Hero banner image", type: "image" },
      { key: "bannerImageAlt", label: "Banner alt text", type: "text" },
      { key: "bannerOverlayColor", label: "Banner overlay color", type: "text", help: "Optional CSS color for the overlay, e.g. rgba(3,29,23,0.72)." },
      { key: "primaryCtaLabel", label: "Primary button label", type: "text" },
      { key: "primaryCtaHref", label: "Primary button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
    ],
    defaultData: { heading: "New headline", subheading: "New supporting paragraph." },
  },
  textBlock: {
    type: "textBlock",
    label: "Text Block",
    description: "A centered heading + subheading, with a paragraph and an optional side image below (e.g. 'About Vallabhi International').",
    fields: [
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "subheading", label: "Subheading (centered, optional)", type: "textarea" },
      { key: "body", label: "Body paragraph", type: "markdown", required: true },
      { key: "twoColumn", label: "Show a side image column (with a placeholder box until one is uploaded)", type: "boolean" },
      { key: "imageUrl", label: "Side image (only shown when the toggle above is on)", type: "image" },
      { key: "greenHeading", label: "Show heading in green (instead of navy)", type: "boolean" },
    ],
    defaultData: { heading: "New section", body: "Write your content here." },
  },
  iconGrid: {
    type: "iconGrid",
    label: "Feature / Icon Grid",
    description: "A heading plus a grid of title + description cards (e.g. 'What We Do', 'Why Choose Us').",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      {
        key: "items",
        label: "Items (one per line, format: Title | Description)",
        type: "textarea",
        required: true,
        help: "Example: Fast decisions | Term sheets in 2-5 business days",
      },
    ],
    defaultData: { heading: "New feature grid", items: "First point | Description here" },
  },
  statsGrid: {
    type: "statsGrid",
    label: "Statistics",
    description: "A row of large numbers/labels (e.g. Founded 2021, RBI-Registered, Tier 2/3 reach).",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading (optional)", type: "text" },
      {
        key: "items",
        label: "Stats (one per line, format: Label | Value)",
        type: "textarea",
        required: true,
        help: "Example: Founded | 2021",
      },
    ],
    defaultData: { items: "Founded | 2021" },
  },
  serviceListing: {
    type: "serviceListing",
    label: "Service Listing",
    description: "Live grid of Services (managed under Services in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "showViewAllLink", label: "Show 'View all services' link", type: "boolean" },
    ],
    defaultData: { heading: "Our Services", showViewAllLink: true },
  },
  loanEligibilityForm: {
    type: "loanEligibilityForm",
    label: "Loan Eligibility Form",
    description: "The interactive loan-eligibility lead form (name, phone, loan type, amount).",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "subheading", label: "Supporting paragraph", type: "textarea" },
    ],
    defaultData: { heading: "Know where you stand in two minutes." },
  },
  contactForm: {
    type: "contactForm",
    label: "Contact / Enquiry Form",
    description: "A simple name/email/phone/message lead form (Contact Us, Careers).",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "subheading", label: "Supporting paragraph", type: "textarea" },
      { key: "introText", label: "Introductory text above the form", type: "textarea" },
      { key: "showCompanyName", label: "Show company field", type: "boolean" },
      { key: "showSubject", label: "Show subject field", type: "boolean" },
      { key: "subjectLabel", label: "Subject field label", type: "text" },
      { key: "formSource", label: "Form source (contact-us / careers)", type: "text", required: true },
      { key: "messageLabel", label: "Message field label", type: "text" },
      { key: "submitLabel", label: "Submit button label", type: "text" },
    ],
    defaultData: { heading: "Send us a message", introText: "Tell us a little about your requirement and we’ll be in touch shortly.", showCompanyName: true, showSubject: true, formSource: "contact-us", messageLabel: "How can we help?", submitLabel: "Send Message" },
  },
  contactInfoBlock: {
    type: "contactInfoBlock",
    label: "Contact Info Block",
    description: "Displays the address/phone/email/business hours from Site Settings.",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "subheading", label: "Supporting paragraph", type: "textarea" },
    ],
    defaultData: { heading: "Get In Touch", subheading: "Whether you have a question about a loan product or want to discuss a partnership, our team typically responds within one business day." },
  },
  clientLogos: {
    type: "clientLogos",
    label: "Client / Partner Logos",
    description: "Live logo strip from Partners & Investors (managed in the sidebar).",
    dataDriven: true,
    fields: [{ key: "heading", label: "Heading", type: "text" }],
    defaultData: { heading: "Our Partners & Investors" },
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    description: "Live grid of featured Client Testimonials (managed in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
    ],
    defaultData: { heading: "In their own words." },
  },
  teamGrid: {
    type: "teamGrid",
    label: "Team / Leadership Grid",
    description: "Live grid of Leadership Members (managed in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
    ],
    defaultData: { heading: "The people steering the ledger." },
  },
  timeline: {
    type: "timeline",
    label: "Timeline",
    description: "Live list of Journey Milestones (managed in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
    ],
    defaultData: { heading: "From incorporation to impact." },
  },
  valuesGrid: {
    type: "valuesGrid",
    label: "Values Grid",
    description: "Live grid of Company Values (managed in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
    ],
    defaultData: { heading: "What we won't compromise on." },
  },
  imageGallery: {
    type: "imageGallery",
    label: "Image Gallery",
    description: "Live grid of Gallery Images (managed in the sidebar).",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
    ],
    defaultData: { heading: "A look inside the team." },
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description: "A heading plus a list of question/answer pairs.",
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      {
        key: "items",
        label: "Questions (one per line, format: Question | Answer)",
        type: "textarea",
        required: true,
      },
    ],
    defaultData: { heading: "Frequently asked questions", items: "Question here? | Answer here." },
  },
  ctaBanner: {
    type: "ctaBanner",
    label: "Call-to-Action Banner",
    description: "A full-width banner with a headline and one or two buttons.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "subheading", label: "Supporting paragraph", type: "textarea" },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "ctaHref", label: "Button link", type: "text" },
    ],
    defaultData: { heading: "Ready to talk?", ctaLabel: "Contact Us", ctaHref: "/contact-us" },
  },
  video: {
    type: "video",
    label: "Video",
    description: "An embedded video (YouTube/Vimeo URL) with an optional caption.",
    fields: [
      { key: "heading", label: "Heading (optional)", type: "text" },
      { key: "videoEmbedUrl", label: "Video embed URL", type: "text", required: true, help: "e.g. https://www.youtube.com/embed/VIDEO_ID" },
      { key: "caption", label: "Caption (optional)", type: "text" },
    ],
    defaultData: {},
  },
  jobOpeningsList: {
    type: "jobOpeningsList",
    label: "Job Openings List",
    description: "Live list of open Job Openings (managed in the sidebar).",
    dataDriven: true,
    fields: [{ key: "heading", label: "Heading", type: "text", required: true }],
    defaultData: { heading: "Build Your Career With Us" },
  },
  contentListing: {
    type: "contentListing",
    label: "Content Listing (Blogs / News / Reports)",
    description: "Live listing of Blog Posts, News, or Reports - pick which via the Source field.",
    dataDriven: true,
    fields: [
      { key: "eyebrow", label: "Eyebrow label", type: "text" },
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "source", label: "Source (blogPosts / newsItems / reports)", type: "text", required: true },
    ],
    defaultData: { heading: "Blogs", source: "blogPosts" },
  },
  processSteps: {
    type: "processSteps",
    label: "Process / Steps",
    description: "A numbered zigzag of 3-5 steps on a dark band (e.g. 'Our Advisory Process').",
    fields: [
      { key: "heading", label: "Heading", type: "text", required: true },
      {
        key: "items",
        label: "Steps (one per line, format: Title | Description)",
        type: "textarea",
        required: true,
        help: "Example: Discovery & Consultation | We learn about your business and goals.",
      },
    ],
    defaultData: { heading: "Our Process", items: "First step | Description here" },
  },
  consultationForm: {
    type: "consultationForm",
    label: "Consultation / Enquiry Split",
    description: "A photo on one side and a colored form panel on the other (e.g. 'Schedule Your Free Financial Consultation').",
    fields: [
      { key: "heading", label: "Heading", type: "text", required: true },
      { key: "subheading", label: "Supporting paragraph (optional)", type: "textarea" },
      { key: "sideImageUrl", label: "Side photo", type: "image" },
      { key: "formSource", label: "Form source (contact-us / careers)", type: "text", required: true },
      { key: "messageLabel", label: "Message field label", type: "text" },
      { key: "submitLabel", label: "Submit button label", type: "text" },
    ],
    defaultData: { heading: "Schedule Your Free Consultation", formSource: "contact-us", messageLabel: "Message", submitLabel: "Submit" },
  },
};

export function getSectionType(type: string): SectionTypeConfig | undefined {
  return sectionTypes[type];
}
