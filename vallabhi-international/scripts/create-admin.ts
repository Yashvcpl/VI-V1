/**
 * Creates (or updates the password of) an admin user.
 * There is no public sign-up page on purpose - this script is the only way
 * to provision access to /admin.
 *
 * Usage:
 *   npm run create-admin -- --email you@company.com --password "..." --name "Your Name"
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { adminUsers } from "../src/lib/db/schema";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

async function main() {
  const email = getArg("--email")?.toLowerCase().trim();
  const password = getArg("--password");
  const name = getArg("--name") ?? "Admin";

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- --email you@company.com --password "..." --name "Your Name"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  if (!db) {
    console.error("Database client is not initialized.");
    process.exit(1);
  }

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

  if (existing) {
    await db.update(adminUsers).set({ passwordHash, name }).where(eq(adminUsers.email, email));
    console.log(`Updated password for existing admin: ${email}`);
  } else {
    await db.insert(adminUsers).values({ email, passwordHash, name });
    console.log(`Created admin user: ${email}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
