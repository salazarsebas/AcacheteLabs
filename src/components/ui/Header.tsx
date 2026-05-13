export function Header() {
  return (
    <header className="fixed top-0 left-0 z-40 w-full">
      <div className="flex items-center justify-between px-6 py-5 md:px-16 lg:px-24">
        <div className="flex items-center gap-4">
          <h1 className="font-sans text-[11px] font-normal uppercase tracking-[0.28em] text-text-primary">
            Acachete Labs
          </h1>
          <span
            className="hidden h-3 w-px sm:block"
            style={{ background: "rgba(255,255,255,0.12)" }}
            aria-hidden="true"
          />
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted sm:block">
            Software Laboratory
          </span>
        </div>

        <span
          className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-muted"
          aria-label="Version"
        >
          v0.1
        </span>
      </div>

      <div
        className="mx-6 h-px md:mx-16 lg:mx-24"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 100%)",
        }}
        aria-hidden="true"
      />
    </header>
  );
}
