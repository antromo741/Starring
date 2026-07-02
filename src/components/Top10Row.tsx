"use client";

import type { Title } from "@/lib/types";
import Card from "./Card";

/** A "Top 10" carousel with the signature oversized outlined rank numerals. */
export default function Top10Row({ title, items }: { title: string; items: Title[] }) {
  const top = items.slice(0, 10);
  if (top.length < 10) return null;

  return (
    <section className="space-y-2">
      <h2 className="px-4 text-lg font-semibold text-neutral-200 sm:px-8 md:text-xl">{title}</h2>
      <div className="no-scrollbar flex items-center gap-0 overflow-x-auto px-4 py-2 sm:px-8">
        {top.map((t, i) => (
          <div key={t.id} className="flex shrink-0 items-center">
            {/* Keep most of the digit visible on phones; tuck it under the card on larger screens */}
            <span
              aria-hidden
              className={`pointer-events-none select-none font-black leading-none ${
                i === 9 ? "-mr-1 sm:mr-[-0.6rem]" : "-mr-2 sm:mr-[-1.4rem]"
              }`}
              style={{
                fontSize: "clamp(5rem, 13vw, 9rem)",
                color: "#141414",
                WebkitTextStroke: "3px #5b616b",
              }}
            >
              {i + 1}
            </span>
            <Card title={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
