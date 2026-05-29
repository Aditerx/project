import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground`}>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-base text-muted-foreground leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
