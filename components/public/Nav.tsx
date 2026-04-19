"use client";
import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/content/site";

const links = [
  { label: "Gaming", href: "#gaming" },
  { label: "Food & Drinks", href: "#food" },
  { label: "Players Club", href: "#players-club" },
  // { label: "Catering", href: "#catering" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-[#c9a96e] tracking-widest text-sm uppercase font-sans">
          {SITE.name}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-400 hover:text-[#c9a96e] transition-colors text-sm tracking-wide font-sans"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#players-club"
            className="bg-[#c9a96e] text-black px-4 py-2 text-sm tracking-widest uppercase font-sans hover:bg-[#e4c68a] transition-colors"
          >
            Join Club
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white font-sans"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-[#2a2a2a] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-400 hover:text-[#c9a96e] text-sm tracking-wide font-sans"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
