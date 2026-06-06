import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="text-sm font-semibold tracking-widest text-accent">STARRING</p>
      <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl">Lost your way?</h1>
      <p className="mt-4 max-w-md text-neutral-400">
        Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 rounded bg-white px-6 py-2.5 font-semibold text-black transition hover:bg-white/80"
      >
        Starring Home
      </Link>
      <p className="mt-6 text-sm text-neutral-500">
        Error Code <span className="border-l border-neutral-600 pl-2">STR-404</span>
      </p>
    </div>
  );
}
