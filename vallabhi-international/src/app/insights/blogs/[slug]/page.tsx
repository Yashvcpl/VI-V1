import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/json-ld";
import { renderMarkdown } from "@/lib/markdown";
import { db } from "@/lib/db/client";
import { blogPosts as blogPostsTable } from "@/lib/db/schema";

export const revalidate = 1800;

export async function generateStaticParams() {
  const rows: Array<{ slug: string }> = await db
    .select({ slug: blogPostsTable.slug })
    .from(blogPostsTable)
    .catch(() => [] as Array<{ slug: string }>);
  return rows.map((r) => ({ slug: r.slug }));
}

async function getPost(slug: string) {
  const [row] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, slug)).limit(1).catch(() => []);
  return row ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return buildMetadata({ title: "Blog Post", description: "Vallabhi International insights.", path: `/insights/blogs/${params.slug}`, index: false });
  }
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/insights/blogs/${post.slug}`,
    ogImage: post.coverImageUrl ?? undefined,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Insights", path: "/insights/blogs" },
          { name: "Blogs", path: "/insights/blogs" },
          { name: post.title, path: `/insights/blogs/${post.slug}` },
        ]}
      />

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.seoDescription || post.excerpt,
          path: `/insights/blogs/${post.slug}`,
          publishedAt: post.publishedAt.toISOString(),
          authorName: post.authorName,
          imageUrl: post.coverImageUrl ?? undefined,
        })}
      />

      <article className="py-16">
        <div className="container-content max-w-3xl">
          {post.category && <p className="eyebrow">{post.category}</p>}
          <h1 className="mt-3 text-4xl">{post.title}</h1>
          <p className="mt-3 font-mono text-sm text-ledger/50">
            {post.authorName} ·{" "}
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </p>

          {post.coverImageUrl && (
            <Image
              src={post.coverImageUrl}
              alt=""
              width={1200}
              height={630}
              className="mt-8 aspect-[8/5] w-full rounded-card object-cover"
              priority
            />
          )}

          {post.body && (
            <div
              className="prose-ledger mt-10 font-body text-ledger/85"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
            />
          )}
        </div>
      </article>
    </>
  );
}
