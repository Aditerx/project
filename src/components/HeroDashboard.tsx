import { motion } from "motion/react";
import { Activity, Shield, AlertTriangle, Cpu, Globe2, Zap } from "lucide-react";

export function HeroDashboard() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-primary/30 via-transparent to-accent-glow/20 blur-3xl opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ transformPerspective: 1200 }}
        className="relative glass-card rounded-2xl p-4 shadow-[0_30px_80px_-20px_rgba(255,107,0,0.35)]"
      >
        {/* header strip */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">SOC · Live</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">node://sentinel-eu-west-1</span>
        </div>

        {/* metrics row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Posture", value: "99.7%", tone: "ok" },
            { icon: AlertTriangle, label: "Active Threats", value: "14", tone: "warn" },
            { icon: Activity, label: "Events/s", value: "8,412", tone: "ok" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="rounded-lg border border-border bg-background/40 p-3"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                <m.icon className={`h-3 w-3 ${m.tone === "warn" ? "text-primary" : ""}`} /> {m.label}
              </div>
              <div className={`mt-1 font-display text-xl font-bold ${m.tone === "warn" ? "text-primary" : ""}`}>{m.value}</div>
            </motion.div>
          ))}
        </div>

        {/* chart area */}
        <div className="mt-4 grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-lg border border-border bg-background/40 p-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Threat Signal · 24h</span>
              <span className="text-[10px] font-mono text-primary">+12%</span>
            </div>
            <Sparkline />
            <div className="pointer-events-none absolute inset-0 cyber-grid-sm opacity-30" />
          </div>
          <div className="col-span-2 rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              <Globe2 className="h-3 w-3" /> Geo Sources
            </div>
            <ul className="mt-2 space-y-1.5 text-xs">
              {[
                ["RU", 38], ["CN", 27], ["BR", 14], ["IR", 11], ["KP", 6],
              ].map(([c, p]) => (
                <li key={c as string} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] w-6 text-muted-foreground">{c}</span>
                  <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent-glow" style={{ width: `${p}%` }} />
                  </div>
                  <span className="font-mono text-[10px] w-7 text-right">{p}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* alert feed */}
        <div className="mt-3 rounded-lg border border-border bg-background/40">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              <Zap className="h-3 w-3 text-primary" /> Auto Response Queue
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">3 acting · 11 reviewed</span>
          </div>
          <ul className="divide-y divide-border text-xs">
            {[
              { sev: "HIGH", txt: "Lateral movement detected · srv-pay-04", t: "00:12" },
              { sev: "MED", txt: "Phishing domain registered · acme-billing[.]co", t: "00:41" },
              { sev: "LOW", txt: "Anomalous login geo · jdoe@corp", t: "01:07" },
            ].map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 px-3 py-2"
              >
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${r.sev === "HIGH" ? "bg-primary/15 text-primary" : r.sev === "MED" ? "bg-amber-500/10 text-amber-500" : "bg-secondary text-muted-foreground"}`}>{r.sev}</span>
                <span className="flex-1 truncate">{r.txt}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{r.t}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* footer chip */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Cpu className="h-3 w-3" /> AI MODEL v4.2 · CORRELATING</span>
          <span>uptime 99.998%</span>
        </div>
      </motion.div>

      {/* floating side card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="hidden md:flex absolute -right-6 -bottom-6 glass-card rounded-xl p-3 w-56 items-center gap-3 animate-float"
      >
        <div className="h-9 w-9 grid place-items-center rounded-lg bg-primary/15 text-primary">
          <Shield className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-semibold">Zero-day contained</div>
          <div className="text-[10px] text-muted-foreground font-mono">CVE-2026-0418 · auto-patch ↑</div>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkline() {
  const points = [22, 30, 18, 34, 28, 45, 38, 52, 41, 64, 48, 70, 60, 82, 70];
  const max = Math.max(...points);
  const w = 280, h = 70;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`).join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-16">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.21 42)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.7 0.21 42)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g1)" />
      <path d={d} stroke="oklch(0.72 0.21 42)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
