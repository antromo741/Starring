"use client";

import { useCatalog } from "./CatalogProvider";
import { useProfile } from "./ProfileProvider";

export default function MobileBottomNav() {
  const { query, setQuery, setSearchOpen } = useCatalog();
  const { openGate } = useProfile();

  const goHome = () => {
    setQuery("");
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSearch = () => {
    setSearchOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goWatchlist = () => {
    setQuery("");
    setSearchOpen(false);
    document.getElementById("my-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#101010]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-2xl backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        <NavButton label="Home" active={!query} onClick={goHome}>
          <HomeIcon className="h-5 w-5" />
        </NavButton>
        <NavButton label="Search" active={query.length > 0} onClick={openSearch}>
          <SearchIcon className="h-5 w-5" />
        </NavButton>
        <NavButton label="List" onClick={goWatchlist}>
          <ListIcon className="h-5 w-5" />
        </NavButton>
        <NavButton label="Profile" onClick={openGate}>
          <ProfileIcon className="h-5 w-5" />
        </NavButton>
      </div>
    </nav>
  );
}

function NavButton({
  children,
  label,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition ${
        active ? "text-accent" : "text-neutral-400 hover:text-white"
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-8.5z" />
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

function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path strokeLinecap="round" d="M8 6h12M8 12h12M8 18h12" />
      <path strokeLinecap="round" d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path strokeLinecap="round" d="M4.5 21a7.5 7.5 0 0115 0" />
    </svg>
  );
}
