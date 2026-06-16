"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Title } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { useCatalog } from "./CatalogProvider";
import TitleModal from "./TitleModal";

interface ModalContextValue {
  active: Title | null;
  /** Open the detail modal. Pass autoPlay to start the player immediately. */
  open: (title: Title, autoPlay?: boolean) => void;
  close: () => void;
  autoPlay: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within <ModalProvider>");
  return ctx;
}

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const { allTitles, recordView } = useCatalog();
  const [active, setActive] = useState<Title | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const activeRef = useRef<Title | null>(null);
  const returnPathRef = useRef("/");

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const titlePath = useCallback((title: Title) => `/title/${slugify(title.name)}`, []);

  const syncFromPath = useCallback(() => {
    const match = window.location.pathname.match(/^\/title\/([^/]+)$/);
    const title = match
      ? allTitles.find((t) => slugify(t.name) === decodeURIComponent(match[1]))
      : undefined;

    if (title) {
      setActive(title);
      setAutoPlay(false);
    } else {
      setActive(null);
      setAutoPlay(false);
    }
  }, [allTitles]);

  useEffect(() => {
    window.addEventListener("popstate", syncFromPath);
    return () => window.removeEventListener("popstate", syncFromPath);
  }, [syncFromPath]);

  const open = useCallback((title: Title, play = false) => {
    setActive(title);
    setAutoPlay(play);
    recordView(title);

    const path = titlePath(title);
    if (window.location.pathname !== path) {
      if (!activeRef.current) {
        returnPathRef.current =
          `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
      }
      window.history.pushState({ starringModal: true, id: title.id }, "", path);
    }
  }, [recordView, titlePath]);

  const close = useCallback(() => {
    const current = activeRef.current;
    setActive(null);
    setAutoPlay(false);

    if (current && window.location.pathname === titlePath(current)) {
      window.history.replaceState(null, "", returnPathRef.current || "/");
    }
  }, [titlePath]);

  return (
    <ModalContext.Provider value={{ active, open, close, autoPlay }}>
      {children}
      <TitleModal />
    </ModalContext.Provider>
  );
}
