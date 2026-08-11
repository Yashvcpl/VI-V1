import Link from "next/link";

// A 404 should return the correct status automatically (Next.js handles this
// for not-found.tsx), never index, and give the visitor somewhere useful to go -
// not just "Page not found" and a dead end.
export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-content text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-3xl">This page isn&rsquo;t in our records.</h1>
        <p className="mx-auto mt-4 max-w-md font-body text-ledger/70">
          The page you&rsquo;re looking for may have moved or no longer exists.
          Here are a few places to start instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-primary">Go to Homepage</Link>
          <Link href="/services" className="btn-secondary">View Services</Link>
          <Link href="/contact-us" className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
