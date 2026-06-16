"use client";

import { useEffect } from "react";
import type { Row as RowType, Title } from "@/lib/types";
import Hero from "./Hero";
import Row from "./Row";
import Top10Row from "./Top10Row";
import MyListRow from "./MyListRow";
import ContinueRow from "./ContinueRow";
import SearchResults from "./SearchResults";
import PersonalizedRows from "./PersonalizedRows";
import StarringYouSpotlight from "./StarringYouSpotlight";
import { useCatalog } from "./CatalogProvider";

export default function HomeContent({ hero, rows }: { hero: Title; rows: RowType[] }) {
  const { query } = useCatalog();
  const searching = query.trim().length > 0;

  // Source the Top 10 from a trending row if present, else the largest row.
  const top10 =
    rows.find((r) => r.id.includes("trending")) ??
    [...rows].sort((a, b) => b.items.length - a.items.length)[0];

  // Jump to the top when a search begins so results are immediately visible.
  useEffect(() => {
    if (searching) window.scrollTo({ top: 0 });
  }, [searching]);

  if (searching) {
    return (
      <main className="flex-1 pb-24 pt-24 sm:pb-8">
        <SearchResults />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero title={hero} />
      {/* Rows pulled up to overlap the hero's bottom fade */}
      <div className="relative z-10 -mt-16 space-y-8 pb-24 sm:-mt-24 sm:pb-8">
        <StarringYouSpotlight />
        <ContinueRow />
        <MyListRow />
        <PersonalizedRows />
        {top10 && <Top10Row title="Trending Today" items={top10.items} />}
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </div>
    </main>
  );
}
