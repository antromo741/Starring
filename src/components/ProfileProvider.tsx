"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface Profile {
  id: string;
  name: string;
  gradient: [string, string];
  kids?: boolean;
}

const CURRENT_KEY = "starring:current-profile";
const SESSION_FLAG = "starring:profile-chosen";

const PROFILES: Profile[] = [
  { id: "anthony", name: "Anthony", gradient: ["#e50914", "#f59e0b"] },
  { id: "guest", name: "Guest", gradient: ["#2563eb", "#06b6d4"] },
  { id: "sam", name: "Sam", gradient: ["#16a34a", "#84cc16"] },
  { id: "kids", name: "Kids", gradient: ["#7c3aed", "#ec4899"], kids: true },
];

interface ProfileContextValue {
  profiles: Profile[];
  current: Profile;
  selectProfile: (id: string) => void;
  openGate: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>");
  return ctx;
}

export default function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentId, setCurrentId] = useState(PROFILES[0].id);
  const [gateOpen, setGateOpen] = useState(false);

  // Restore last profile, and show the gate once per browser tab session.
  // These run once after mount (reading client-only storage) precisely to avoid
  // an SSR hydration mismatch, so the synchronous setState is intentional here.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENT_KEY);
      const showGate = !sessionStorage.getItem(SESSION_FLAG);
      /* eslint-disable react-hooks/set-state-in-effect -- hydrate client-only state after mount to avoid SSR mismatch */
      if (saved && PROFILES.some((p) => p.id === saved)) setCurrentId(saved);
      if (showGate) setGateOpen(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      /* storage unavailable */
    }
  }, []);

  const selectProfile = useCallback((id: string) => {
    setCurrentId(id);
    setGateOpen(false);
    try {
      localStorage.setItem(CURRENT_KEY, id);
      sessionStorage.setItem(SESSION_FLAG, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const openGate = useCallback(() => setGateOpen(true), []);

  const current = useMemo(
    () => PROFILES.find((p) => p.id === currentId) ?? PROFILES[0],
    [currentId],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ profiles: PROFILES, current, selectProfile, openGate }),
    [current, selectProfile, openGate],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
      {gateOpen && <ProfileGate profiles={PROFILES} onPick={selectProfile} />}
    </ProfileContext.Provider>
  );
}

/** Avatar tile used in the gate and (smaller) in the navbar. */
export function ProfileAvatar({ profile, className }: { profile: Profile; className?: string }) {
  return (
    <span
      className={`flex items-center justify-center font-bold text-white ${className ?? ""}`}
      style={{ background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})` }}
    >
      {profile.name[0]}
    </span>
  );
}

function ProfileGate({ profiles, onPick }: { profiles: Profile[]; onPick: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#141414] px-4 animate-fade-in">
      <h1 className="mb-10 text-3xl font-medium text-white sm:text-5xl">Who&apos;s watching?</h1>
      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-8">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p.id)}
            className="group flex w-24 flex-col items-center gap-2 sm:w-32"
          >
            <ProfileAvatar
              profile={p}
              className="aspect-square w-24 rounded-md text-4xl ring-white transition group-hover:ring-2 group-focus-visible:ring-2 sm:w-32 sm:text-6xl"
            />
            <span className="text-sm text-neutral-400 transition group-hover:text-white sm:text-lg">
              {p.name}
              {p.kids && " ⓚ"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
