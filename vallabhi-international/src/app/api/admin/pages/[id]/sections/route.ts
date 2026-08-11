import { NextResponse, type NextRequest } from "next/server";
import { eq, max } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";
import { getSectionType } from "@/lib/pagebuilder/sectionTypes";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const rows = await db.select().from(pageSections).where(eq(pageSections.pageId, Number(params.id)));
  return NextResponse.json({ rows });
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await request.json().catch(() => null);
  const type = body?.type as string | undefined;
  if (!type) return NextResponse.json({ error: "type is required" }, { status: 422 });

  const sectionType = getSectionType(type);
  if (!sectionType) return NextResponse.json({ error: "Unknown section type" }, { status: 422 });

  const pageId = Number(params.id);

  const [{ value: currentMax }] = await db
    .select({ value: max(pageSections.sortOrder) })
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId));

  const [row] = await db
    .insert(pageSections)
    .values({
      pageId,
      type,
      data: JSON.stringify(sectionType.defaultData),
      visible: true,
      sortOrder: (currentMax ?? -1) + 1,
    })
    .returning();

  return NextResponse.json({ row }, { status: 201 });
}
