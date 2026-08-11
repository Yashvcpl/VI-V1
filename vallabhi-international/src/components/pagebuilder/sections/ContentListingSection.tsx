import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { blogPosts, newsItems, reports } from "@/lib/db/schema";

interface ContentListingData {
  eyebrow?: string;
  heading: string;
  source: "blogPosts" | "newsItems" | "reports";
}

export async function ContentListingSection({ data, isFirstOnPage }: { data: ContentListingData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";

  if (data.source === "blogPosts") {
    const posts: Array<{ slug: string; coverImageUrl?: string | null; category?: string | null; title: string; excerpt?: string | null }> = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt))
      .catch(() => [] as Array<{ slug: string; coverImageUrl?: string | null; category?: string | null; title: string; excerpt?: string | null }>);
    return (
      <section className="py-16">
        <div className="container-content">
          {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
          <Heading className="mt-3 text-4xl">{data.heading}</Heading>
          {posts.length === 0 ? (
            <p className="mt-8 font-body text-ledger/60">New posts are on their way &mdash; check back soon.</p>
          ) : (
            <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/insights/blogs/${post.slug}`} className="group block">
                    {post.coverImageUrl && <Image src={post.coverImageUrl} alt="" width={480} height={300} className="aspect-[8/5] w-full rounded-card object-cover" />}
                    {post.category && <p className="mt-4 eyebrow">{post.category}</p>}
                    <h3 className="mt-2 text-lg group-hover:text-growth-700">{post.title}</h3>
                    <p className="mt-2 font-body text-sm text-ledger/70">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  if (data.source === "newsItems") {
    const items: Array<{ slug: string; publishedAt: Date; title: string; summary?: string | null }> = await db
      .select()
      .from(newsItems)
      .orderBy(desc(newsItems.publishedAt))
      .catch(() => [] as Array<{ slug: string; publishedAt: Date; title: string; summary?: string | null }>);
    return (
      <section className="py-16">
        <div className="container-content max-w-3xl">
          {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
          <Heading className="mt-3 text-4xl">{data.heading}</Heading>
          {items.length === 0 ? (
            <p className="mt-8 font-body text-ledger/60">No news items published yet.</p>
          ) : (
            <ul className="mt-12 flex flex-col gap-8">
              {items.map((item) => (
                <li key={item.slug} className="ledger-rule pt-6">
                  <time dateTime={item.publishedAt.toISOString()} className="font-mono text-xs text-ledger/50">
                    {item.publishedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                  <h3 className="mt-2 text-xl"><Link href={`/insights/news/${item.slug}`} className="hover:text-growth-700">{item.title}</Link></h3>
                  <p className="mt-2 font-body text-ledger/70">{item.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  const reportRows: Array<{ slug: string; coverImageUrl?: string | null; title: string; summary?: string | null }> = await db
    .select()
    .from(reports)
    .orderBy(desc(reports.publishedAt))
    .catch(() => [] as Array<{ slug: string; coverImageUrl?: string | null; title: string; summary?: string | null }>);
  return (
    <section className="py-16">
      <div className="container-content">
        {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
        <Heading className="mt-3 text-4xl">{data.heading}</Heading>
        {reportRows.length === 0 ? (
          <p className="mt-8 font-body text-ledger/60">No reports published yet.</p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reportRows.map((report) => (
              <li key={report.slug} className="ledger-rule pt-6">
                {report.coverImageUrl && <Image src={report.coverImageUrl} alt="" width={400} height={260} className="aspect-[10/6.5] w-full rounded-card object-cover" />}
                <h3 className="mt-4 text-lg"><Link href={`/insights/reports/${report.slug}`} className="hover:text-growth-700">{report.title}</Link></h3>
                <p className="mt-2 font-body text-sm text-ledger/70">{report.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
