"use client";

import { useEffect, useRef, useState } from "react";
import { useCatalog } from "./CatalogProvider";
import { useProfile, ProfileAvatar } from "./ProfileProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { query, setQuery, searchOpen, setSearchOpen } = useCatalog();
  const { current, openGate } = useProfile();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expanded = searchOpen || query.length > 0;

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const clearSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  // Nav links double as quick filters / jumps.
  const onLink = (link: string) => {
    clearSearch();
    if (link === "Watchlist") {
      document.getElementById("my-list")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const LINKS = ["Home", "TV Shows", "Movies", "New & Popular", "Watchlist"];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || expanded || menuOpen ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-8">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => onLink("Home")}
            className="select-none text-2xl font-extrabold tracking-tight text-accent sm:text-3xl"
          >
            STARRING
          </button>
          <ul className="hidden items-center gap-5 text-sm text-neutral-200 lg:flex">
            {LINKS.map((link, i) => (
              <li key={link}>
                <button
                  onClick={() => onLink(link)}
                  className={`cursor-pointer transition hover:text-white ${
                    i === 0 ? "font-semibold text-white" : ""
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 text-white">
          {/* Search */}
          <div
            className={`flex items-center transition-all ${
              expanded
                ? "gap-2 rounded border border-neutral-600 bg-black/70 px-2 py-1"
                : ""
            }`}
          >
            <button
              onClick={expanded ? () => inputRef.current?.focus() : openSearch}
              aria-label="Search"
              className="text-white"
            >
              <SearchIcon className="h-5 w-5 cursor-pointer" />
            </button>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => query.length === 0 && setSearchOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && clearSearch()}
              placeholder="Titles, genres"
              aria-label="Search titles"
              className={`bg-transparent text-sm text-white placeholder:text-neutral-400 focus:outline-none ${
                expanded ? "w-36 sm:w-52" : "w-0"
              } transition-all`}
            />
            {expanded && query.length > 0 && (
              <button onClick={clearSearch} aria-label="Clear search" className="text-neutral-400 hover:text-white">
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <span className="hidden cursor-pointer text-sm sm:inline">Kids</span>
          <BellIcon className="hidden h-5 w-5 cursor-pointer sm:block" />
          <button
            onClick={openGate}
            aria-label="Switch profile"
            title={`${current.name} — switch profiles`}
            className="overflow-hidden rounded"
          >
            <ProfileAvatar profile={current} className="h-8 w-8 rounded text-sm" />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul className="border-t border-neutral-800 bg-[#141414] px-4 py-2 lg:hidden">
          {LINKS.map((link) => (
            <li key={link}>
              <button
                onClick={() => {
                  onLink(link);
                  setMenuOpen(false);
                }}
                className="block w-full py-2 text-left text-neutral-200 transition hover:text-white"
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
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
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
