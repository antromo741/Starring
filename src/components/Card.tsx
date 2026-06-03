"use client";

import { useState } from "react";
import Image from "next/image";
import type { Title } from "@/lib/types";
import { posterSrc, posterGradient } from "@/lib/images";
import { useModal } from "./ModalProvider";

export default function Card({ title }: { title: Title }) {
  const { open } = useModal();
  const [broken, setBroken] = useState(false);
  const poster = posterSrc(title);
  const showImage = poster && !broken;

  return (
    <button
      onClick={() => open(title)}
      className="group relative aspect-[2/3] w-[140px] shrink-0 overflow-hidden rounded-md bg-neutral-800 text-left transition-transform duration-300 hover:z-10 hover:scale-110 hover:shadow-2xl focus:z-10 focus:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-[160px] md:w-[180px]"
      aria-label={`${title.name} — open details`}
    >
      {showImage ? (
        <Image
          src={poster}
          alt={title.name}
          fill
          sizes="180px"
          className="object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        // Generated gradient poster (default in mock mode)
        <div
          className="flex h-full w-full flex-col justify-between p-3"
          style={{ background: posterGradient(title.name) }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            N Series
          </span>
          <span className="text-lg font-extrabold leading-tight drop-shadow-md">
            {title.name}
          </span>
        </div>
      )}

      {/* Hover info overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100">
        <p className="truncate text-sm font-semibold">{title.name}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          <span className="font-semibold text-green-500">{title.matchPct}%</span>
          <span className="rounded border border-neutral-500 px-1 text-neutral-300">
            {title.rating}
          </span>
          <span className="text-neutral-300">{title.length}</span>
        </div>
      </div>
    </button>
  );
}
