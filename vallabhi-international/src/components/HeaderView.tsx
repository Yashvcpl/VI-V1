"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

export function HeaderView({ navLinks, servicesLinks, insightsLinks }: { navLinks: NavLink[]; servicesLinks: NavLink[]; insightsLinks: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Small delay on mouse-leave so moving the cursor diagonally into the dropdown
  // doesn't close it - standard hover-menu behaviour, not a functional necessity,
  // so it's skipped entirely for keyboard users (they rely on focus, not hover).
  function openServices() {
    clearTimeout(closeTimeout.current);
    setServicesOpen(true);
  }
  function scheduleCloseServices() {
    closeTimeout.current = setTimeout(() => setServicesOpen(false), 150);
  }

  function openInsights() {
    clearTimeout(closeTimeout.current);
    setInsightsOpen(true);
  }
  function scheduleCloseInsights() {
    closeTimeout.current = setTimeout(() => setInsightsOpen(false), 150);
  }

  return (
    <header className={`sticky top-0 z-50 border-b border-ledger/10 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_8px_30px_rgba(7,37,60,0.08)]" : "shadow-none"}`}>
      <div className="container-content relative flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Vallabhi International home">
          <Image src="/logo.jpg" alt="Vallabhi International" width={133} height={86} priority className="h-10 w-auto sm:h-11 md:h-12" />
        </Link>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-body text-sm font-medium text-ledger transition hover:text-growth-700">
              {link.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
            <Link
              href="/services"
              className="flex items-center gap-1 font-body text-sm font-medium text-ledger transition hover:text-growth-700"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onFocus={openServices}
              onClick={() => setServicesOpen(false)}
            >
              Services
              <span aria-hidden="true">▾</span>
            </Link>
            {servicesOpen && (
              <ul
                role="menu"
                aria-label="Services"
                className="absolute left-0 top-full min-w-[220px] rounded-card border border-ledger/10 bg-paper py-2 shadow-lg"
                onFocus={openServices}
              >
                {servicesLinks.map((link) => (
                  <li key={link.href} role="none">
                    <Link
                      role="menuitem"
                      href={link.href}
                      className="block px-4 py-2 font-body text-sm text-ledger hover:bg-ledger/5 hover:text-growth-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative" onMouseEnter={openInsights} onMouseLeave={scheduleCloseInsights}>
            <button
              type="button"
              className="flex items-center gap-1 font-body text-sm font-medium text-ledger transition hover:text-growth-700"
              aria-expanded={insightsOpen}
              aria-haspopup="true"
              onClick={() => setInsightsOpen((v) => !v)}
              onFocus={openInsights}
            >
              Insights
              <span aria-hidden="true">▾</span>
            </button>
            {insightsOpen && (
              <ul
                role="menu"
                aria-label="Insights"
                className="absolute left-0 top-full min-w-[160px] rounded-card border border-ledger/10 bg-paper py-2 shadow-lg"
                onFocus={openInsights}
              >
                {insightsLinks.map((link) => (
                  <li key={link.href} role="none">
                    <Link
                      role="menuitem"
                      href={link.href}
                      className="block px-4 py-2 font-body text-sm text-ledger hover:bg-ledger/5 hover:text-growth-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/careers" className="font-body text-sm font-medium text-ledger transition hover:text-growth-700">
            Careers
          </Link>
        </nav>

        <div className="ml-auto hidden md:block">
          <Link href="/contact-us" className="btn-primary">
            Contact Us
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper/90 text-ledger shadow-sm md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-ledger/10 bg-paper md:hidden">
          <ul className="container-content flex flex-col gap-3 py-5">
            {[...navLinks, ...servicesLinks, ...insightsLinks, { label: "Careers", href: "/careers" }, { label: "Contact Us", href: "/contact-us" }].map(
              (link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-2 font-body text-base text-ledger" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
