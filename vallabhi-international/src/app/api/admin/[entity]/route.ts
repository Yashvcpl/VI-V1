import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db/client";
import { getEntity } from "@/lib/admin/entities";

export const runtime = "nodejs";

/**
 * Generic list/create endpoint, driven by src/lib/admin/entities.ts.
 * Auth is enforced by middleware.ts (matcher covers /api/admin/:path*), so
 * every handler below assumes the caller is already an authenticated admin.
 *
 * NOTE: the entity's `table` is a generically-typed PgTable, so Drizzle can't
 * statically verify column names here the way it can for a hand-written
 * query against a known table - hence the `as any` casts. Runtime behaviour
 * is still correct (Drizzle resolves columns from the table object itself);
 * this is the deliberate cost of one generic system instead of 13 bespoke ones.
 */

export async function GET(_request: NextRequest, props: { params: Promise<{ entity: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (db.select().from(entity.table as any) as any);
  return NextResponse.json({ rows });
}

export async function POST(request: NextRequest, props: { params: Promise<{ entity: string }> }) {
  const params = await props.params;
  const entity = getEntity(params.entity);
  if (!entity) return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  if (entity.singleton) {
    return NextResponse.json({ error: "This is a singleton - use PATCH on id 1 instead." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  for (const field of entity.fields) {
    if (field.required && !body[field.key]) {
      return NextResponse.json({ error: `${field.label} is required` }, { status: 422 });
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [row] = await (db.insert(entity.table as any).values(body).returning() as any);
    return NextResponse.json({ row }, { status: 201 });
  } catch (error) {
    console.error(`Failed to create ${entity.key}:`, error);
    const message = error instanceof Error ? error.message : "Failed to create record";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
