import { getHomeData } from "@/lib/content";
import ModalProvider from "@/components/ModalProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import Footer from "@/components/Footer";

export default async function Home() {
  const { hero, rows, source } = await getHomeData();

  return (
    <ModalProvider>
      <Navbar />
      <main className="flex-1">
        <Hero title={hero} />
        {/* Rows pulled up to overlap the hero's bottom fade, like Netflix */}
        <div className="relative z-10 -mt-16 space-y-8 pb-8 sm:-mt-24">
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </div>
      </main>
      <Footer demoMode={source === "mock"} />
    </ModalProvider>
  );
}
