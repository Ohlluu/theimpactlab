"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation, and lock the body while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || open
          ? "bg-olive-950/92 backdrop-blur-xl border-b border-paper/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16 md:h-20" : "h-20 md:h-28"
          }`}
        >
          <Link
            href="/"
            className="relative block shrink-0"
            aria-label="The Impact Lab — home"
          >
            <Image
              src="/img/logo-wordmark-white.png"
              alt="The Impact Lab"
              width={476}
              height={158}
              priority
              className={`w-auto transition-all duration-500 ${
                scrolled ? "h-7 md:h-8" : "h-8 md:h-11"
              }`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative label py-2 transition-colors duration-300 ${
                    active ? "text-brass-300" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-brass-400 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}

            <Link
              href="/booking"
              className="group relative inline-flex items-center gap-2 bg-brass-400 px-6 py-3 label text-olive-950 transition-all duration-300 hover:bg-brass-300"
            >
              Book a Call
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M1 8h13M9 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="square"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </svg>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-10 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block h-px w-6 bg-paper transition-all duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-paper transition-all duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden border-t border-paper/10 bg-olive-950 transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-paper/10 py-5 font-display text-3xl font-bold tracking-tight text-paper"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="mt-7 inline-flex items-center justify-center gap-2 bg-brass-400 px-6 py-4 label text-olive-950"
          >
            Book a Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
