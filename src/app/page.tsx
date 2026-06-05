import { getHomeData } from "@/lib/content";
import type { Title } from "@/lib/types";
import ProfileProvider from "@/components/ProfileProvider";
import CatalogProvider from "@/components/CatalogProvider";
import ModalProvider from "@/components/ModalProvider";
import Navbar from "@/components/Navbar";
import HomeContent from "@/components/HomeContent";
import Footer from "@/components/Footer";

export default async function Home() {
  const { hero, rows, source } = await getHomeData();

  // Flatten + de-duplicate every title so search and "Watchlist" can look any up.
  const seen = new Set<number>();
  const allTitles: Title[] = [];
  for (const t of [hero, ...rows.flatMap((r) => r.items)]) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      allTitles.push(t);
    }
  }

  return (
    <ProfileProvider>
      <CatalogProvider allTitles={allTitles}>
        <ModalProvider>
          <Navbar />
          <HomeContent hero={hero} rows={rows} />
          <Footer demoMode={source === "mock"} />
        </ModalProvider>
      </CatalogProvider>
    </ProfileProvider>
  );
}
