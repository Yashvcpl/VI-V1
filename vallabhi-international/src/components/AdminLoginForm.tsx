"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { normalizeCallbackUrl } from "@/lib/auth/callbackUrl";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const callbackUrl = normalizeCallbackUrl(searchParams.get("callbackUrl") || "/admin", origin);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ledger px-6">
      <div className="w-full max-w-sm rounded-card bg-paper p-8">
        <h1 className="font-display text-2xl text-ledger">Vallabhi International</h1>
        <p className="mt-1 font-body text-sm text-ledger/60">Admin sign in</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-body text-sm font-medium text-ledger">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" className="rounded-card border border-ledger/20 px-3 py-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-body text-sm font-medium text-ledger">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="rounded-card border border-ledger/20 px-3 py-2" />
          </div>

          {error && <p role="alert" className="font-body text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
