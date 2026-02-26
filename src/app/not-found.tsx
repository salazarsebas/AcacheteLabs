import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
      <span className="mb-6 font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted">
        Signal Lost
      </span>
      <h1 className="font-sans text-5xl font-light tracking-[0.15em] text-text-primary md:text-7xl">
        404
      </h1>
      <p className="mt-4 font-mono text-xs text-text-secondary">
        Module not found in laboratory index.
      </p>
      <Link
        href="/"
        className="mt-10 font-mono text-[10px] uppercase tracking-wider text-text-secondary underline underline-offset-4 transition-colors duration-300 hover:text-white"
      >
        Return to Lab
      </Link>
    </div>
  );
}
