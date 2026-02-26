interface CoordinateLabelProps {
  x: string;
  y: string;
  z?: string;
  className?: string;
}

export function CoordinateLabel({
  x,
  y,
  z = "0.00",
  className = "",
}: CoordinateLabelProps) {
  return (
    <span
      className={`pointer-events-none absolute font-mono text-[8px] leading-tight tracking-wider text-white/[0.12] ${className}`}
    >
      x:{x} y:{y} z:{z}
    </span>
  );
}
