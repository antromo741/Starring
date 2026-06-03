"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Title } from "@/lib/types";

const STORAGE_KEY = "netflix-clone:my-list";

interface CatalogContextValue {
  allTitles: Title[];
  // Search
  query: string;
  setQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  results: Title[];
  // My List (persisted to localStorage)
  myList: Title[];
  inList: (id: number) => boolean;
  toggleList: (t: Title) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within <CatalogProvider>");
  return ctx;
}

export default function CatalogProvider({
  allTitles,
  children,
}: {
  allTitles: Title[];
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [listIds, setListIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load the saved list once on mount (client only, avoids hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setListIds(JSON.parse(raw) as number[]);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change, but only after the initial load.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listIds));
    } catch {
      /* storage may be unavailable (private mode, etc.) */
    }
  }, [listIds, hydrated]);

  const byId = useMemo(() => {
    const m = new Map<number, Title>();
    for (const t of allTitles) m.set(t.id, t);
    return m;
  }, [allTitles]);

  const inList = useCallback((id: number) => listIds.includes(id), [listIds]);

  const toggleList = useCallback((t: Title) => {
    setListIds((prev) =>
      prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [t.id, ...prev],
    );
  }, []);

  // Newest-added first; drop any ids that are no longer in the catalog.
  const myList = useMemo(
    () => listIds.map((id) => byId.get(id)).filter((t): t is Title => Boolean(t)),
    [listIds, byId],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<number>();
    const out: Title[] = [];
    for (const t of allTitles) {
      if (seen.has(t.id)) continue;
      const haystack = `${t.name} ${t.genres.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        out.push(t);
        seen.add(t.id);
      }
    }
    return out;
  }, [query, allTitles]);

  const value = useMemo<CatalogContextValue>(
    () => ({ allTitles, query, setQuery, searchOpen, setSearchOpen, results, myList, inList, toggleList }),
    [allTitles, query, searchOpen, results, myList, inList, toggleList],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
