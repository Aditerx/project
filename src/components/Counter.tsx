import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

export function Counter({ to, suffix = "", prefix = "", decimals = 0, duration = 1.6 }: {
  to: number; suffix?: string; prefix?: string; decimals?: number; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setV(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const fmt = decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString();
  return <span ref={ref}>{prefix}{fmt}{suffix}</span>;
}
