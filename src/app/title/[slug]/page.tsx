import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTitles, getTitleBySlug } from "@/lib/content";
import { backdropSrc, posterSrc, mobileHeroSrc, posterGradient } from "@/lib/images";
import { slugify } from "@/lib/slug";

export async function generateStaticParams() {
  const all = await getAllTitles();
  return all.map((t) => ({ slug: slugify(t.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  if (!title) return { title: "Not found" };
  const img = backdropSrc(title, "w780") ?? posterSrc(title);
  return {
    title: title.name,
    description: title.overview,
    openGraph: {
      title: `${title.name} · Starring`,
      description: title.overview,
      images: img ? [img] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title.name} · Starring`,
      description: title.overview,
      images: img ? [img] : undefined,
    },
  };
}

export default async function TitlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = await getTitleBySlug(slug);
  if (!title) notFound();

  const backdrop = backdropSrc(title, "original");
  const mobileArtwork = mobileHeroSrc(title) ?? backdrop;
  const desktopArtwork = backdrop ?? mobileArtwork;

  return (
    <main id="main-content" className="min-h-[100svh]">
      <header className="fixed inset-x-0 top-0 z-20 bg-gradient-to-b from-black/80 to-transparent px-4 py-3 sm:px-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-accent sm:text-3xl">
          STARRING
        </Link>
      </header>

      <div className="relative h-[70svh] min-h-[520px] w-full overflow-hidden sm:h-[70vh] sm:min-h-[420px]">
        {mobileArtwork ? (
          <Image
            src={mobileArtwork}
            alt={title.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_24%] sm:hidden"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: posterGradient(title.name) }} />
        )}
        {desktopArtwork && (
          <Image
            src={desktopArtwork}
            alt={title.name}
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-top sm:block"
          />
        )}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent sm:hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-transparent" />
      </div>

      <div className="mx-auto -mt-32 max-w-3xl space-y-5 px-4 pb-20 sm:px-8">
        <h1 className="text-3xl font-extrabold drop-shadow-lg sm:text-5xl">{title.name}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-green-500">{title.matchPct}% Match</span>
          <span className="text-neutral-300">{title.year}</span>
          <span className="rounded border border-neutral-500 px-1.5 text-xs text-neutral-300">
            {title.rating}
          </span>
          <span className="text-neutral-300">{title.length}</span>
          <span className="rounded bg-neutral-700 px-1.5 text-[10px] font-bold tracking-wide text-neutral-200">
            HD
          </span>
        </div>
        <p className="max-w-2xl text-neutral-200 sm:text-lg">{title.overview}</p>
        {title.genres.length > 0 && (
          <p className="text-sm text-neutral-400">
            <span className="text-neutral-500">Genres: </span>
            {title.genres.join(", ")}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/80"
          >
            ▶ Play on Starring
          </Link>
          <Link
            href="/"
            className="rounded bg-neutral-500/40 px-6 py-2.5 font-semibold text-white transition hover:bg-neutral-500/30"
          >
            Browse catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
