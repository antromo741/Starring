"use client";

import { useEffect, useState } from "react";

const LINKS = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 py-3 sm:px-8">
        <div className="flex items-center gap-8">
          <span className="select-none text-2xl font-extrabold tracking-tight text-netflix sm:text-3xl">
            NETFLIX
          </span>
          <ul className="hidden items-center gap-5 text-sm text-neutral-200 lg:flex">
            {LINKS.map((link, i) => (
              <li
                key={link}
                className={`cursor-pointer transition hover:text-white ${
                  i === 0 ? "font-semibold text-white" : ""
                }`}
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 text-white">
          <SearchIcon className="hidden h-5 w-5 cursor-pointer sm:block" />
          <span className="hidden cursor-pointer text-sm sm:inline">Kids</span>
          <BellIcon className="hidden h-5 w-5 cursor-pointer sm:block" />
          <div className="h-8 w-8 cursor-pointer overflow-hidden rounded bg-gradient-to-br from-red-500 to-orange-400" />
        </div>
      </nav>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  );
}
