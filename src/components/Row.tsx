"use client";

import { useRef } from "react";
import type { Row as RowType } from "@/lib/types";
import Card from "./Card";

export default function Row({ row }: { row: RowType }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="group/row space-y-2">
      <h2 className="px-4 text-lg font-semibold text-neutral-200 sm:px-8 md:text-xl">
        {row.title}
      </h2>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition hover:bg-black/60 group-hover/row:opacity-100 md:flex"
        >
          <Chevron className="h-8 w-8 rotate-180" />
        </button>

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-px-4 px-4 py-2 sm:gap-3 sm:px-8"
        >
          {row.items.map((title) => (
            <Card key={title.id} title={title} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition hover:bg-black/60 group-hover/row:opacity-100 md:flex"
        >
          <Chevron className="h-8 w-8" />
        </button>
      </div>
    </section>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}
