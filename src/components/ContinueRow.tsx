"use client";

import { useCatalog } from "./CatalogProvider";
import { useProfile } from "./ProfileProvider";
import Row from "./Row";

/** "Continue Watching" carousel with resume progress bars; hidden when empty. */
export default function ContinueRow() {
  const { continueList } = useCatalog();
  const { current } = useProfile();
  if (continueList.length === 0) return null;

  const items = continueList.map((c) => c.title);
  const progressById: Record<number, number> = {};
  for (const c of continueList) progressById[c.title.id] = c.progress;

  return (
    <Row
      row={{ id: "continue", title: `Continue Watching for ${current.name}`, items }}
      progressById={progressById}
    />
  );
}
