"use client";

/**
 * Last-resort boundary: replaces the root layout when it throws, so it must
 * render its own <html>/<body> and can't rely on globals.css being loaded.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#141414",
          color: "#fff",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <p aria-hidden style={{ fontSize: "3rem", color: "#f5c542", margin: 0 }}>
          ★
        </p>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Something went wrong</h1>
        <p style={{ color: "#a3a3a3", fontSize: "0.875rem", maxWidth: "28rem" }}>
          Starring couldn&apos;t load. Please try again.
          {error.digest ? ` (Ref: ${error.digest})` : ""}
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            background: "#fff",
            color: "#000",
            border: 0,
            borderRadius: "0.25rem",
            padding: "0.625rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
