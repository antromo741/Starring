"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Title } from "@/lib/types";
import { useProfile } from "./ProfileProvider";

const myListKey = (pid: string) => `starring:my-list:${pid}`;
const continueKey = (pid: string) => `starring:continue:${pid}`;
const recentKey = (pid: string) => `starring:recent:${pid}`;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

type ContinueMap = Record<number, { p: number; t: number }>;

interface CatalogContextValue {
  allTitles: Title[];
  // Search
  query: string;
  setQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  results: Title[];
  // Watchlist (per profile, persisted)
  myList: Title[];
  inList: (id: number) => boolean;
  toggleList: (t: Title) => void;
  // Continue Watching (per profile, persisted)
  continueList: { title: Title; progress: number }[];
  getProgress: (id: number) => number;
  recordProgress: (t: Title, progress: number) => void;
  recentTitles: Title[];
  recordView: (t: Title) => void;
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
  const profileId = useProfile().current.id;

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [listIds, setListIds] = useState<number[]>([]);
  const [recentIds, setRecentIds] = useState<number[]>([]);
  const [cont, setCont] = useState<ContinueMap>({});

  // Refs mirror state so mutators can persist immediately without effect races
  // (important when switching profiles, which swaps the storage keys).
  const listRef = useRef<number[]>([]);
  const recentRef = useRef<number[]>([]);
  const contRef = useRef<ContinueMap>({});

  // (Re)load both lists whenever the active profile changes.
  useEffect(() => {
    const ids = readJSON<number[]>(myListKey(profileId), []);
    const recent = readJSON<number[]>(recentKey(profileId), []);
    const c = readJSON<ContinueMap>(continueKey(profileId), {});
    listRef.current = ids;
    recentRef.current = recent;
    contRef.current = c;
    /* eslint-disable react-hooks/set-state-in-effect -- load persisted per-profile lists after mount/profile change */
    setListIds(ids);
    setRecentIds(recent);
    setCont(c);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [profileId]);

  const byId = useMemo(() => {
    const m = new Map<number, Title>();
    for (const t of allTitles) m.set(t.id, t);
    return m;
  }, [allTitles]);

  const inList = useCallback((id: number) => listIds.includes(id), [listIds]);

  const toggleList = useCallback(
    (t: Title) => {
      const prev = listRef.current;
      const next = prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [t.id, ...prev];
      listRef.current = next;
      setListIds(next);
      writeJSON(myListKey(profileId), next);
    },
    [profileId],
  );

  const getProgress = useCallback((id: number) => cont[id]?.p ?? 0, [cont]);

  const recordProgress = useCallback(
    (t: Title, progress: number) => {
      if (!Number.isFinite(progress) || progress <= 0) return;
      const next: ContinueMap = { ...contRef.current, [t.id]: { p: Math.min(1, progress), t: Date.now() } };
      contRef.current = next;
      setCont(next);
      writeJSON(continueKey(profileId), next);
    },
    [profileId],
  );

  const recordView = useCallback(
    (t: Title) => {
      const next = [t.id, ...recentRef.current.filter((id) => id !== t.id)].slice(0, 12);
      recentRef.current = next;
      setRecentIds(next);
      writeJSON(recentKey(profileId), next);
    },
    [profileId],
  );

  const myList = useMemo(
    () => listIds.map((id) => byId.get(id)).filter((t): t is Title => Boolean(t)),
    [listIds, byId],
  );

  const recentTitles = useMemo(
    () => recentIds.map((id) => byId.get(id)).filter((t): t is Title => Boolean(t)),
    [recentIds, byId],
  );

  const continueList = useMemo(
    () =>
      Object.entries(cont)
        .map(([id, v]) => ({ title: byId.get(Number(id)), progress: v.p, t: v.t }))
        .filter(
          (x): x is { title: Title; progress: number; t: number } =>
            Boolean(x.title) && x.progress > 0.02 && x.progress < 0.95,
        )
        .sort((a, b) => b.t - a.t)
        .map(({ title, progress }) => ({ title, progress })),
    [cont, byId],
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
    () => ({
      allTitles,
      query,
      setQuery,
      searchOpen,
      setSearchOpen,
      results,
      myList,
      inList,
      toggleList,
      continueList,
      getProgress,
      recordProgress,
      recentTitles,
      recordView,
    }),
    [
      allTitles,
      query,
      searchOpen,
      results,
      myList,
      inList,
      toggleList,
      continueList,
      getProgress,
      recordProgress,
      recentTitles,
      recordView,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
