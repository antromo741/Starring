/** Canonical site origin: explicit env var, Netlify's build-time URL, else localhost. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
}
