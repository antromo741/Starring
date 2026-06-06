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
            <span
              aria-hidden
              className="select-none font-black leading-none"
              style={{
                fontSize: "clamp(4rem, 13vw, 9rem)",
                color: "#141414",
                WebkitTextStroke: "3px #5b616b",
                marginRight: i === 9 ? "-0.6rem" : "-1.4rem",
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
