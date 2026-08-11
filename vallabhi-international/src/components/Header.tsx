import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { navigationItems } from "@/lib/db/schema";
import { getAllServices } from "@/lib/services";
import { HeaderView } from "@/components/HeaderView";

const DEFAULT_NAV_LINKS = [
  { label: "About Us", href: "/about-us" },
];

const DEFAULT_SERVICES_LINKS = [
  { label: "Debt Syndication", href: "/services/debt-syndication" },
  { label: "Debt Capital Market", href: "/services/debt-capital-market" },
  { label: "Credit Assessment", href: "/services/credit-assessment" },
  { label: "Private Equity", href: "/services/private-equity" },
];

const DEFAULT_INSIGHTS_LINKS = [
  { label: "Blogs", href: "/insights/blogs" },
  { label: "News", href: "/insights/news" },
  { label: "Reports", href: "/insights/reports" },
];

type NavigationItemRow = typeof navigationItems.$inferSelect;

export async function Header() {
  let rows: NavigationItemRow[] = [];
  let insightsRows: NavigationItemRow[] = [];
  let servicesRows: { title: string; slug: string }[] = [];

  if (db) {
    rows = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.location, "header"))
      .orderBy(asc(navigationItems.sortOrder))
      .catch((err: unknown) => {
        console.error("Error fetching navigation items:", err);
        return [];
      });

    insightsRows = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.location, "insights-dropdown"))
      .orderBy(asc(navigationItems.sortOrder))
      .catch((err: unknown) => {
        console.error("Error fetching insights navigation:", err);
        return [];
      });

    servicesRows = await getAllServices();
  } else {
    console.warn("Database not available for navigation");
  }

  const navLinks = rows.length > 0
    ? rows
        .filter((r) => !r.href.startsWith("/services") && r.label.toLowerCase() !== "services")
        .map((r) => ({ label: r.label, href: r.href }))
    : DEFAULT_NAV_LINKS;

  const servicesLinks = servicesRows.length > 0
    ? servicesRows.map((r) => ({ label: r.title, href: `/services/${r.slug}` }))
    : DEFAULT_SERVICES_LINKS;

  const insightsLinks = insightsRows.length > 0 ? insightsRows.map((r) => ({ label: r.label, href: r.href })) : DEFAULT_INSIGHTS_LINKS;

  return <HeaderView navLinks={navLinks} servicesLinks={servicesLinks} insightsLinks={insightsLinks} />;
}
