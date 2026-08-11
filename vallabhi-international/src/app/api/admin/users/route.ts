import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const rows = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, createdAt: adminUsers.createdAt })
    .from(adminUsers);
  return NextResponse.json({ rows });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.toLowerCase().trim();
  const name = body?.name?.trim();
  const password = body?.password;

  if (!email || !name || !password) {
    return NextResponse.json({ error: "Email, name, and password are required" }, { status: 422 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 422 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const [row] = await db.insert(adminUsers).values({ email, name, passwordHash }).returning({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      createdAt: adminUsers.createdAt,
    });
    return NextResponse.json({ row }, { status: 201 });
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return NextResponse.json({ error: "That email is already registered." }, { status: 409 });
  }
}
