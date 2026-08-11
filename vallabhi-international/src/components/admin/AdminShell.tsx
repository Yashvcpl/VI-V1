"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

type NavItem = { key: string; label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
  navGroups: NavGroup[];
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children, userEmail, navGroups }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,48,80,0.05),_transparent_30%)] bg-paper-dim text-ledger">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-ledger/10 bg-ledger px-5 py-6 text-paper transition-transform duration-200 md:sticky md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-paper/10 text-sm font-semibold">
                VI
              </span>
              <div>
                <p className="font-display text-lg leading-none">Vallabhi Admin</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-paper/60">Content Studio</p>
              </div>
            </Link>
            <button type="button" className="rounded-full border border-paper/15 p-2 text-paper/80 md:hidden" onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
          </div>

          <nav className="mt-8 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/45">{group.label}</p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActivePath(pathname ?? "/admin", item.href);
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition ${active ? "bg-paper/15 text-paper" : "text-paper/80 hover:bg-paper/10 hover:text-paper"}`}
                        >
                          <span>{item.label}</span>
                          {active ? <span className="h-2 w-2 rounded-full bg-growth" /> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-paper/10 bg-paper/10 p-4 text-sm text-paper/80">
            <p className="font-medium text-paper">Need a new module?</p>
            <p className="mt-1 text-xs leading-6 text-paper/70">Add it to the navigation config and it will slot into this layout automatically.</p>
          </div>
        </aside>

        {sidebarOpen ? <div className="fixed inset-0 z-30 bg-ledger/40 md:hidden" onClick={() => setSidebarOpen(false)} /> : null}

        <div className="flex-1">
          <header className="border-b border-ledger/10 bg-paper/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-2xl border border-ledger/10 p-2 text-ledger/70 md:hidden" onClick={() => setSidebarOpen(true)}>
                  ☰
                </button>
                <div>
                  <p className="text-sm font-semibold text-ledger">{userEmail ?? "Signed in"}</p>
                  <p className="text-xs text-ledger/60">Manage your website content confidently</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/" target="_blank" className="hidden rounded-full border border-growth/20 px-3 py-2 text-sm font-medium text-growth-700 transition hover:bg-growth/10 sm:inline-flex">
                  View site ↗
                </Link>
                <SignOutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-5xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
