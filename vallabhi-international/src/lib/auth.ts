import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

async function getAdminUserByEmail(email: string) {
  if (!db) return null;

  try {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * Admin auth for /admin only. There is deliberately no public sign-up route -
 * admin accounts are created via `npm run create-admin` (scripts/create-admin.ts),
 * so the only way in is a password an operator set on purpose.
 */
export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getAdminUserByEmail(credentials.email.toLowerCase().trim());
        if (!user) return null;

        const passwordMatches = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatches) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
