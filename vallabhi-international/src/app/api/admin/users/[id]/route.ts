import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await request.json().catch(() => null);
  const update: Record<string, unknown> = {};

  if (body?.name) update.name = body.name.trim();
  if (body?.password) {
    if (body.password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 422 });
    }
    update.passwordHash = await bcrypt.hash(body.password, 12);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const [row] = await db
    .update(adminUsers)
    .set(update)
    .where(eq(adminUsers.id, Number(params.id)))
    .returning({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name });

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ row });
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const allUsers = await db.select({ id: adminUsers.id }).from(adminUsers);
  if (allUsers.length <= 1) {
    return NextResponse.json({ error: "Can't delete the only remaining admin user." }, { status: 400 });
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, Number(params.id)));
  return NextResponse.json({ ok: true });
}
