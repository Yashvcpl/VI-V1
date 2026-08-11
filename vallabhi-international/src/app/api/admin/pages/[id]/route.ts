import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";

export const runtime = "nodejs";

// The 8 pages that already have a matching route file - deleting these would
// leave that route with nothing to render, so it's blocked here.
const CORE_SLUGS = new Set([
  "home",
  "about-us",
  "services",
  "insights-blogs",
  "insights-news",
  "insights-reports",
  "careers",
  "contact-us",
]);

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [row] = await db.select().from(pages).where(eq(pages.id, Number(params.id))).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const [row] = await db
    .update(pages)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(pages.id, Number(params.id)))
    .returning();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [row] = await db.select().from(pages).where(eq(pages.id, Number(params.id))).limit(1);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (CORE_SLUGS.has(row.slug)) {
    return NextResponse.json(
      { error: "This page has a dedicated route file and can't be deleted - edit its sections instead." },
      { status: 400 }
    );
  }

  await db.delete(pages).where(eq(pages.id, Number(params.id)));
  return NextResponse.json({ ok: true });
}
