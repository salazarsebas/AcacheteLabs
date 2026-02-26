interface MicroLabelProps {
  text: string;
  className?: string;
}

export function MicroLabel({ text, className = "" }: MicroLabelProps) {
  return (
    <span
      className={`pointer-events-none absolute font-mono text-[7px] uppercase tracking-[0.3em] text-white/[0.10] ${className}`}
    >
      {text}
    </span>
  );
}
