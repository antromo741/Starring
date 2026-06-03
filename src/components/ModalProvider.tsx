"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Title } from "@/lib/types";
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
  const [active, setActive] = useState<Title | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const open = useCallback((title: Title, play = false) => {
    setActive(title);
    setAutoPlay(play);
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <ModalContext.Provider value={{ active, open, close, autoPlay }}>
      {children}
      <TitleModal />
    </ModalContext.Provider>
  );
}
