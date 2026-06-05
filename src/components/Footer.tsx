const COLUMNS = [
  ["Audio Description", "Investor Relations", "Legal Notices"],
  ["Help Center", "Jobs", "Cookie Preferences"],
  ["Gift Cards", "Terms of Use", "Corporate Information"],
  ["Media Center", "Privacy", "Contact Us"],
];

export default function Footer({ demoMode = false }: { demoMode?: boolean }) {
  return (
    <footer className="mt-12 px-4 py-10 text-sm text-neutral-400 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {demoMode && (
          <p className="rounded border border-neutral-700 bg-neutral-900/60 p-3 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-200">Demo mode.</span> Posters are
            generated locally. Add a free{" "}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-200 underline hover:text-white"
            >
              TMDB API key
            </a>{" "}
            to <code className="rounded bg-neutral-800 px-1">.env.local</code> for real artwork
            and trailers.
          </p>
        )}
        <p>Questions? Call 1-800-000-0000</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLUMNS.flat().map((item) => (
            <a key={item} href="#" className="hover:underline">
              {item}
            </a>
          ))}
        </div>
        <p className="max-w-3xl text-xs leading-relaxed">
          Starring — a personal portfolio project inspired by modern streaming-platform
          interfaces. It is not affiliated with, endorsed by, or connected to any streaming
          company. All title names and generated artwork are fictional.
        </p>
      </div>
    </footer>
  );
}
