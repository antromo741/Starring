"use client";

import { useCatalog } from "./CatalogProvider";
import Row from "./Row";

/** Renders the persisted "Watchlist" carousel, or nothing when empty. */
export default function MyListRow() {
  const { myList } = useCatalog();
  if (myList.length === 0) return null;

  return (
    <div id="my-list" className="scroll-mt-24">
      <Row row={{ id: "my-list", title: "Watchlist", items: myList }} />
    </div>
  );
}
