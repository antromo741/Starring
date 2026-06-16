"use client";

export default function StarringYouSpotlight() {
  return (
    <section className="px-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-neutral-800/80 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-accent text-2xl font-black text-black"
          >
            ★
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-accent">
              Starring You
            </p>
            <p className="truncate text-sm text-neutral-300 sm:text-base">
              Anthony Roma · 10 originals · Action, comedy, fantasy, noir
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
          <span>Personal Slate</span>
        </div>
      </div>
    </section>
  );
}
