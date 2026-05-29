import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CyberBg } from "./CyberBg";

export function PageHero({ eyebrow, title, subtitle, cta }: {
  eyebrow: string; title: ReactNode; subtitle: string; cta?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <CyberBg variant="hero" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:pt-28 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          {subtitle}
        </motion.p>
        {cta && <div className="mt-8">{cta}</div>}
      </div>
    </section>
  );
}
