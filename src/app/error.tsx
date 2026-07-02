"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[starring] route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="select-none text-5xl font-black text-accent" aria-hidden>
        ★
      </p>
      <h1 className="text-2xl font-extrabold sm:text-3xl">Something went wrong</h1>
      <p className="max-w-md text-sm text-neutral-400">
        The catalog hit a snag loading this page.
        {error.digest && <span className="block pt-1 text-neutral-600">Ref: {error.digest}</span>}
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-2 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/80"
      >
        Try again
      </button>
    </main>
  );
}
