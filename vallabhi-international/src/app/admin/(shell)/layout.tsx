import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { entities } from "@/lib/admin/entities";
import { AdminShell } from "@/components/admin/AdminShell";

// Belt-and-braces: middleware already blocks unauthenticated requests to
// everything under /admin except /login, but checking again here means this
// layout degrades safely even if middleware config ever changes.
export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  const navGroups = [
    { label: "Overview", items: [{ key: "dashboard", label: "Dashboard", href: "/admin" }] },
    {
      label: "Pages",
      items: [
        { key: "pages", label: "Page Builder", href: "/admin/pages" },
        { key: "homepageHero", label: "Homepage Hero", href: "/admin/homepageHero" },
      ],
    },
    {
      label: "Content",
      items: [
        { key: "services", label: entities.services.pluralLabel, href: "/admin/services" },
        { key: "jobOpenings", label: entities.jobOpenings.pluralLabel, href: "/admin/jobOpenings" },
        { key: "industries", label: entities.industries.pluralLabel, href: "/admin/industries" },
        { key: "blogPosts", label: entities.blogPosts.pluralLabel, href: "/admin/blogPosts" },
        { key: "caseStudies", label: entities.caseStudies.pluralLabel, href: "/admin/caseStudies" },
        { key: "faqs", label: entities.faqs.pluralLabel, href: "/admin/faqs" },
      ],
    },
    {
      label: "Brand",
      items: [
        { key: "testimonials", label: entities.testimonials.pluralLabel, href: "/admin/testimonials" },
        { key: "leadershipMembers", label: entities.leadershipMembers.pluralLabel, href: "/admin/leadershipMembers" },
        { key: "galleryImages", label: entities.galleryImages.pluralLabel, href: "/admin/galleryImages" },
        { key: "navigationItems", label: entities.navigationItems.pluralLabel, href: "/admin/navigationItems" },
      ],
    },
    {
      label: "Media & Settings",
      items: [
        { key: "media", label: "Media Library", href: "/admin/media" },
        { key: "siteSettings", label: entities.siteSettings.pluralLabel, href: "/admin/siteSettings" },
      ],
    },
    {
      label: "Operations",
      items: [
        { key: "leads", label: "Forms", href: "/admin/leads" },
        { key: "users", label: "Users & Roles", href: "/admin/users" },
      ],
    },
  ];

  return (
    <AdminShell userEmail={session.user?.email} navGroups={navGroups}>
      {children}
    </AdminShell>
  );
}
