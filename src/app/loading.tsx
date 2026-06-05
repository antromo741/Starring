export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-accent" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
