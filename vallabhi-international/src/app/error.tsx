"use client";

import Link from "next/link";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-content text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-bold text-ledger">We can't load this page right now.</h1>
        <p className="mx-auto mt-4 max-w-md font-body text-ledger/70">{error?.message ?? "An unexpected error occurred."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
