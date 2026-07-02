import { getAllTitles, getHomeData } from "@/lib/content";
import ProfileProvider from "@/components/ProfileProvider";
import CatalogProvider from "@/components/CatalogProvider";
import ToastProvider from "@/components/ToastProvider";
import ModalProvider from "@/components/ModalProvider";
import Navbar from "@/components/Navbar";
import HomeContent from "@/components/HomeContent";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default async function Home() {
  const { hero, rows, source } = await getHomeData();
  // Flattened + de-duplicated so search and "Watchlist" can look any title up.
  const allTitles = await getAllTitles();

  return (
    <ProfileProvider>
      <CatalogProvider allTitles={allTitles}>
        <ToastProvider>
          <ModalProvider>
            <Navbar />
            <HomeContent hero={hero} rows={rows} />
            <Footer demoMode={source === "mock"} />
            <MobileBottomNav />
          </ModalProvider>
        </ToastProvider>
      </CatalogProvider>
    </ProfileProvider>
  );
}
