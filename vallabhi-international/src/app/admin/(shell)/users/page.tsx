import Link from "next/link";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminUsersListPage() {
  const rows: Array<{ id: number; email: string; name: string; createdAt: string | null }> = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, createdAt: adminUsers.createdAt })
    .from(adminUsers);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Admin Users</h1>
        <Link href="/admin/users/new" className="btn-primary">+ Invite Admin</Link>
      </div>
      <p className="mt-2 font-body text-ledger/70">
        Anyone listed here can sign in at /admin/login and edit every part of the site.
      </p>

      <ul className="mt-8 divide-y divide-ledger/10 rounded-card border border-ledger/10 bg-paper">
        {rows.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-body font-medium text-ledger">{user.name}</p>
              <p className="font-body text-sm text-ledger/60">{user.email}</p>
            </div>
            <Link href={`/admin/users/${user.id}`} className="font-body text-sm font-semibold text-growth-700 hover:underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
