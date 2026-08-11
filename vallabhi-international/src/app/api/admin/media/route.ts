import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { mediaAssets } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const assets = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.uploadedAt)).catch(() => []);
  return NextResponse.json({ assets });
}
