"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewAdminUserPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        name: form.get("name"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Failed to create user");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl">Invite Admin</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-md flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-body text-sm font-medium text-ledger">Name</label>
          <input id="name" name="name" type="text" required className="rounded-card border border-ledger/20 px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-body text-sm font-medium text-ledger">Email</label>
          <input id="email" name="email" type="email" required className="rounded-card border border-ledger/20 px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-body text-sm font-medium text-ledger">Temporary password</label>
          <input id="password" name="password" type="password" required minLength={8} className="rounded-card border border-ledger/20 px-3 py-2" />
        </div>
        {error && <p role="alert" className="font-body text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Creating…" : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
