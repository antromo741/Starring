"use client";

import { useCatalog } from "./CatalogProvider";
import Row from "./Row";

export default function PersonalizedRows() {
  const { allTitles, recentTitles } = useCatalog();
  const anchor = recentTitles[0];
  if (!anchor) return null;

  const genres = new Set(anchor.genres);
  const related = allTitles
    .filter((title) => title.id !== anchor.id && title.genres.some((genre) => genres.has(genre)))
    .slice(0, 10);

  if (related.length === 0) return null;

  return <Row row={{ id: `because-${anchor.id}`, title: `Because You Watched ${anchor.name}`, items: related }} />;
}
