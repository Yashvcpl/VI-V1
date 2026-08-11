import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { pages } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db.select().from(pages);
  return NextResponse.json({ rows });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.title || !body?.seoDescription) {
    return NextResponse.json({ error: "slug, title, and seoDescription are required" }, { status: 422 });
  }

  try {
    const [row] = await db.insert(pages).values(body).returning();
    return NextResponse.json({ row }, { status: 201 });
  } catch (error) {
    console.error("Failed to create page:", error);
    const message = error instanceof Error ? error.message : "Failed to create page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
