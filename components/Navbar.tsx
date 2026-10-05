"use client";

import { useState } from "react";
import Link from "next/link";
import SiteSearch from "@/components/SiteSearch";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#leadership", label: "Partnerships" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blogs", label: "Blogs" },
  { href: "/#experience", label: "Skills" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/#profile" className="flex min-w-0 items-center gap-3">
          <img
            src="/images/image-ak.jpg"
            alt="Akash Kumar"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-500/40"
          />
          <span className="truncate text-lg font-semibold tracking-wide text-slate-900">AKASH KUMAR</span>
        </Link>
        <ul className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-sky-600">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <SiteSearch />
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-slate-900 transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4 text-slate-800">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
