"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="font-body text-sm text-ledger/70 hover:text-ledger"
    >
      Sign out
    </button>
  );
}
