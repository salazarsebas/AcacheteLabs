interface CADMarkerProps {
  className?: string;
}

export function CADMarker({ className = "" }: CADMarkerProps) {
  return (
    <svg
      className={`pointer-events-none absolute text-white/[0.08] ${className}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}
