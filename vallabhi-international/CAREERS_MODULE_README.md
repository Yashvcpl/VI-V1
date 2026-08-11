Careers module changes

Summary:
- Added expanded `job_openings` fields to support detailed job pages.
- Added `job_applications` table to store incoming applications.
- New frontend components under `src/components/jobs` for listing, detail and application form.
- New server route `POST /api/careers/apply` to accept applications.
- Admin UI: `jobOpenings` and `jobApplications` entities are registered; use `/admin/jobOpenings` and `/admin/jobApplications`.

Important steps to finish setup:
1. Run a database migration to add the new columns and `job_applications` table. The schema changes are in `src/lib/db/schema.ts`.
2. Restart the Next.js server after running migrations so the new pages and API routes are available.

Notes:
- File uploads (resumes) use the existing `/api/admin/upload` endpoint and store records in `media_assets`.
- The admin UI uses the generic entity pages; if you want custom application workflows, we can add dedicated views.
