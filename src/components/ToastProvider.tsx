"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastIcon = "check" | "minus" | "info";
interface Toast {
  id: number;
  message: string;
  icon: ToastIcon;
}

interface ToastContextValue {
  toast: (message: string, icon?: ToastIcon) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, icon: ToastIcon = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-md border border-neutral-700 bg-[#1f1f1f]/95 px-4 py-3 text-sm font-medium text-white shadow-xl backdrop-blur"
            >
              <Glyph icon={t.icon} />
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function Glyph({ icon }: { icon: ToastIcon }) {
  const path =
    icon === "check"
      ? "M5 13l4 4L19 7"
      : icon === "minus"
        ? "M5 12h14"
        : "M12 8v5M12 16h.01";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5 text-accent" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
