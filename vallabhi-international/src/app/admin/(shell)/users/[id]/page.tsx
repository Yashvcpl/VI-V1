"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function EditAdminUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const password = form.get("password") as string;
    const name = form.get("name") as string;

    const response = await fetch(`/api/admin/users/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || undefined, password: password || undefined }),
    });
    const data = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Failed to update user");
      return;
    }

    router.push("/admin/users");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Remove this admin user? They will no longer be able to sign in.")) return;
    const response = await fetch(`/api/admin/users/${params.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Failed to delete user");
      return;
    }
    router.push("/admin/users");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl">Edit Admin User</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-md flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-body text-sm font-medium text-ledger">Name (leave blank to keep unchanged)</label>
          <input id="name" name="name" type="text" className="rounded-card border border-ledger/20 px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-body text-sm font-medium text-ledger">New password (leave blank to keep unchanged)</label>
          <input id="password" name="password" type="password" minLength={8} className="rounded-card border border-ledger/20 px-3 py-2" />
        </div>
        {error && <p role="alert" className="font-body text-sm text-red-700">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={handleDelete} className="font-body text-sm text-red-700 hover:underline">
            Delete user
          </button>
        </div>
      </form>
    </div>
  );
}
