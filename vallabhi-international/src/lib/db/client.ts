import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null | undefined;

function getDb(): ReturnType<typeof drizzle> | null {
  if (dbInstance) return dbInstance;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("DATABASE_URL is not configured. DB-backed admin and content routes will run in safe fallback mode.");
    dbInstance = null;
    return null;
  }

  try {
    const sql = neon(databaseUrl);
    dbInstance = drizzle(sql, { schema });
    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize database client:", error instanceof Error ? error.message : String(error));
    dbInstance = null;
    return null;
  }
}

export const db: any = getDb();
