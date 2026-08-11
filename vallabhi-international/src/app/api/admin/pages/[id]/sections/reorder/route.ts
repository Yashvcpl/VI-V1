import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pageSections } from "@/lib/db/schema";

export const runtime = "nodejs";

// Body: { order: number[] } - an array of section IDs in their new top-to-bottom order.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const order = body?.order as number[] | undefined;
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "order (array of section IDs) is required" }, { status: 422 });
  }

  await Promise.all(
    order.map((sectionId, index) =>
      db.update(pageSections).set({ sortOrder: index }).where(eq(pageSections.id, sectionId))
    )
  );

  return NextResponse.json({ ok: true });
}
