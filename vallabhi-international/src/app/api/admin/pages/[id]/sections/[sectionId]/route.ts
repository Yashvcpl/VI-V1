import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, props: { params: Promise<{ sectionId: string }> }) {
  const params = await props.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (body.data !== undefined) update.data = typeof body.data === "string" ? body.data : JSON.stringify(body.data);
  if (body.visible !== undefined) update.visible = body.visible;

  const [row] = await db
    .update(pageSections)
    .set(update)
    .where(eq(pageSections.id, Number(params.sectionId)))
    .returning();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ sectionId: string }> }) {
  const params = await props.params;
  await db.delete(pageSections).where(eq(pageSections.id, Number(params.sectionId)));
  return NextResponse.json({ ok: true });
}
