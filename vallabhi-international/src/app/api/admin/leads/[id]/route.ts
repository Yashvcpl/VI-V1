import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await db.delete(leads).where(eq(leads.id, Number(params.id)));
  return NextResponse.json({ ok: true });
}
