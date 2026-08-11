# Vallabhi International — website

Digital visiting card site for Vallabhi Capital (RBI-registered NBFC). Next.js 14
(App Router, TypeScript) + Tailwind + **Postgres-backed custom admin with a
drag-and-drop page builder** (no third-party CMS) + Vercel.

## Design update (navy/green, pill buttons)

The theme was retuned to match an approved homepage UI: navy (`ledger`) +
forest green (`growth`) accents, pill-shaped buttons (`rounded-pill`),
16px-rounded cards, and Poppins for headings instead of the earlier serif.
These are all shared tokens/classes (`tailwind.config.ts`, `globals.css`,
`.btn-primary`, `.eyebrow`), so every page inherits the look automatically -
nothing page-specific to update.

Two new section types were added to match the homepage design:
- **Process / Steps** (`processSteps`) - a numbered zigzag on a dark band,
  e.g. "Our Advisory Process"
- **Consultation / Enquiry Split** (`consultationForm`) - a photo on one side,
  a colored form panel on the other

The Home page's sections were restructured to: Hero -> About (text + image) ->
Our Financial Solution (services) -> Our Advisory Process (steps) -> Schedule
a Consultation (form split). Since your database already has a "home" page
row from before, run this once to swap in the new layout:

```bash
npm run reset-home-page
npm run seed-services
```

(Fresh installs get both automatically via `npm run seed-pages` +
`npm run seed-services`.)

The hero's team photo (`public/hero-team-photo.jpg` / `.webp`) was cropped
directly from the approved design mockup so the homepage banner matches
exactly. Swap it for a real photo whenever one's available - same field,
same admin path (`/admin/pages` -> Home -> Hero -> Circular photo).

The 8 services shown in the design (Debt Syndication, Debt Capital Market,
Credit Assessment, Private Equity, Financial Services, NRI Services,
Valuation, Insolvency) are seeded with the same card copy from the mockup.
That copy is intentionally identical across all 8 cards, same as the
design - edit each one under `/admin/services` whenever real per-service
descriptions are ready.

## Getting started (on your machine, not in this sandbox)

This was written in an offline sandbox with no package registry access, so
dependencies have never been installed or built here — do that first:

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run db:generate          # generates SQL migration files from the schema
npm run db:migrate           # applies them to your database
npm run seed-pages           # populates the 6 core pages with their starting sections
npm run create-admin -- --email you@company.com --password "..." --name "Your Name"
npm run dev
```

Then sign in at `/admin/login` with the email/password you just created.

## Environment variables (see `.env.example`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL — used in canonical tags, sitemap, JSON-LD |
| `DATABASE_URL` | Neon Postgres connection string — holds everything: pages, content, leads, admin users |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | Required for admin login sessions. Generate a secret with `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob — every image/file upload in the admin goes through this |
| `RESEND_API_KEY`, `LEAD_NOTIFICATION_*` | Email notification on new form submissions |
| `UPSTASH_REDIS_REST_URL/TOKEN` | Rate limiting on the lead forms (falls back to "allow" if unset — set before launch) |

## How the admin works

There is no public sign-up page — admin accounts are created with
`npm run create-admin`, on purpose. Once signed in at `/admin`, everything
is organized under one dashboard:

- **Pages** — every page on the site (Home, About Us, Services, Insights x3,
  Careers, Contact Us) is built from an ordered list of sections. Open a
  page under `/admin/pages` to add, remove, drag-reorder, show/hide, or edit
  any section - headline text, images, buttons, everything - with no code
  changes and no redeploy.
- **Content** — Services, Industries, Blog Posts, News, Reports, Case
  Studies, Job Openings: standard list -> add/edit/delete screens.
- **About Us content** — Leadership, Journey Milestones, Company Values,
  Gallery Images: these feed the About Us page's data-driven sections.
- **Clients & Trust** — Partners/Investors (also used for the homepage
  client-logo strip) and Testimonials.
- **Site** — Homepage Hero/Banner, Site Settings (contact info, company
  overview), Navigation Menus (header/footer/Insights-dropdown links), and
  the Media Library (every file ever uploaded, for reuse).
- **Admin** — Contact Form Submissions (every Contact Us / Loan Eligibility /
  Careers lead) and Admin Users (invite/remove people who can sign in).

### The page builder, concretely

Each page is a row in `pages`; each section on that page is a row in
`page_sections` with a `type` (hero, textBlock, iconGrid, serviceListing,
testimonials, faq, ctaBanner, video, ...) and a JSON `data` blob shaped by
that type. `src/lib/pagebuilder/sectionTypes.ts` is the registry - it defines
what fields the admin form shows for each section type, and
`src/components/pagebuilder/PageRenderer.tsx` maps each section's `type` to
the matching public-facing React component.

Data-driven sections (Service Listing, Testimonials, Team Grid, Timeline,
Values Grid, Image Gallery, Client Logos, Job Openings List, Content Listing)
don't store their list content in the section itself - they pull it live from
the matching admin content type, so e.g. adding a new Service in
`/admin/services` shows up on any page with a Service Listing section,
automatically.

Repeating text inside a section (icon-grid items, stats, FAQ entries) is
edited as one-per-line text using an "A | B" convention (e.g.
`Fast decisions | Term sheets in 2-5 business days`), rather than a nested
drag-and-drop sub-editor. This was a deliberate scope call to keep the builder
shippable - it's fully admin-editable, just via a simpler text convention than
a full repeater UI.

### Adding a genuinely new page

The 8 routes with dedicated files (`/`, `/about-us`, `/services`, the three
Insights listings, `/careers`, `/contact-us`) are wired to fetch a specific
`pages.slug` and render its sections. `/admin/pages` will let you create a new
`pages` row for a brand-new page, but a new route file is still needed to
serve it at a URL - copy the pattern from e.g. `src/app/careers/page.tsx`
(about 15 lines: fetch by slug, call `buildMetadata`, render `<PageRenderer>`).
Fully arbitrary URL creation from the admin alone is the natural next
increment if you want it.

### Adding a genuinely new section type

Section types are defined in code (`src/lib/pagebuilder/sectionTypes.ts` for
the admin form + a matching component in
`src/components/pagebuilder/sections/`) - this keeps rendering fast and
type-safe. Adding one is copy-paste-and-adjust from an existing section, not a
rewrite.

## SEO / images (from earlier work, still true)

Unique per-page metadata + canonical tags, JSON-LD (Organization sitewide,
Article on blog/news, Service on service pages, BreadcrumbList on inner
pages), dynamic sitemap.xml / robots.txt, one `<h1>` per page, every image
through `next/image`, WebP-first asset generation for logo/favicons/OG image
(see `/public`).

## Known scope lines (disclosed, not hidden)

- Industries and Case Studies are fully manageable in the admin
  (`/admin/industries`, `/admin/caseStudies`) but don't have public listing/
  detail pages yet - that's the next increment (same pattern as Services).
- Detail pages for a single Service/Blog Post/News Item/Report/Job Opening
  are fixed templates driven by that item's own data - not page-builder pages
  themselves, since a single-entity detail page isn't really "composed of
  marketing sections" the way a listing page is.
- "Clients" and "Partners/Investors" share one admin table (`partners`, with
  a `category` field to distinguish them) rather than two separate ones.
- The Media Library lists every upload but doesn't yet support browsing
  existing images from within a section's image picker (copy the URL from the
  Media Library for now - a "pick from library" button is a nice follow-up).

## Before launch

- Get a transparent-background version of the logo (current file is a flat
  JPEG with a white background - fine in the header, shows a visible white
  box in the OG image / anywhere dark).
- Set `UPSTASH_REDIS_REST_URL/TOKEN` - without it, lead-form rate limiting is
  a no-op.
- Run a real Lighthouse pass once deployed to Vercel.
