"use client";

import { useCatalog } from "./CatalogProvider";
import Card from "./Card";

export default function SearchResults() {
  const { query, results } = useCatalog();
  const q = query.trim();

  return (
    <section className="px-4 sm:px-8">
      <h2 className="mb-6 text-base text-neutral-400 sm:text-lg">
        {results.length > 0 ? (
          <>
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-white">“{q}”</span>
          </>
        ) : (
          <>
            No titles found for <span className="font-semibold text-white">“{q}”</span>
          </>
        )}
      </h2>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {results.map((title) => (
          <Card key={title.id} title={title} />
        ))}
      </div>
    </section>
  );
}
