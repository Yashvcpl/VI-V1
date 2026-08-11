import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getEntity } from "@/lib/admin/entities";
import { normalizePayloadForEntitySave } from "@/lib/admin/singletonPayload";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, props: { params: Promise<{ entity: string; id: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const id = Number(params.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = entity.table as any;
  const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ entity: string; id: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const id = Number(params.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = entity.table as any;

  const normalizedBody = normalizePayloadForEntitySave(entity, body);
  console.log(`[PATCH] entity=${entity.key}, normalizedBody=${JSON.stringify(normalizedBody)}`);

  // Fallback: ensure homepage hero always has required text fields
  if (entity.key === "homepageHero") {
    if (!normalizedBody.heading || typeof normalizedBody.heading !== "string" || !normalizedBody.heading.trim()) {
      normalizedBody.heading = "Helping businesses raise capital";
    }
    if (!normalizedBody.subheading || typeof normalizedBody.subheading !== "string" || !normalizedBody.subheading.trim()) {
      normalizedBody.subheading = "Trusted advisory for growth, risk, and funding strategy.";
    }
    console.log(`[PATCH] after fallback: ${JSON.stringify(normalizedBody)}`);
  }

  try {
    if (entity.singleton) {
      // Upsert: singleton content may not have a row yet on first save.
      const existing = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (existing.length === 0) {
        const rows = await db.insert(table).values({ ...normalizedBody, id }).returning();
        const [row] = rows as Array<Record<string, unknown>>;
        return NextResponse.json({ row });
      }
    }

    const rows = await db.update(table).set(normalizedBody).where(eq(table.id, id)).returning();
    const [row] = rows as Array<Record<string, unknown>>;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ row });
  } catch (error) {
    console.error(`Failed to update ${entity.key}:`, error);
    const message = error instanceof Error ? error.message : "Failed to update record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ entity: string; id: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  if (entity.singleton) {
    return NextResponse.json({ error: "Singleton content can't be deleted, only edited." }, { status: 400 });
  }

  const id = Number(params.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = entity.table as any;

  await db.delete(table).where(eq(table.id, id));
  return NextResponse.json({ ok: true });
}
