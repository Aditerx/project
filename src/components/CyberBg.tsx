export function CyberBg({ variant = "default" }: { variant?: "default" | "hero" | "dark" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 cyber-grid grid-mask opacity-60" />
      {variant === "hero" && (
        <>
          <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/3 -left-40 h-[420px] w-[420px] rounded-full bg-accent-glow/20 blur-[110px] animate-pulse-glow" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </>
      )}
      {variant === "dark" && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[360px] w-[720px] rounded-full bg-primary/15 blur-[120px]" />
      )}
    </div>
  );
}
