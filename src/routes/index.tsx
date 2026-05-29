import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight, ShieldCheck, Radar, AlertOctagon, Globe2, FileCheck2,
  Cpu, Network, Plug, Zap, Bell, Gauge, Fingerprint, Cloud,
  Banknote, Landmark, HeartPulse, Server, ShoppingBag, Signal, Truck, GraduationCap, Gamepad2, Film,
  Search, Microscope, ShieldAlert, RotateCcw, ShieldPlus, ChevronRight, Quote, Sparkles,
} from "lucide-react";
import { CyberBg } from "../components/CyberBg";
import { HeroDashboard } from "../components/HeroDashboard";
import { SectionHeader, Reveal } from "../components/Section";
import { Counter } from "../components/Counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IP Protection | Enterprise Security Intelligence" },
      { name: "description", content: "Protect critical digital infrastructure with real-time AI threat detection, automated response, and 24/7 SOC operations across 120+ countries." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Solutions />
      <GlobalImpact />
      <WhyUs />
      <Platform />
      <Industries />
      <Workflow />
      <Trust />
      <FinalCTA />
    </>
  );
}

/* 1. HERO */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <CyberBg variant="hero" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            AI Cyber Intelligence Platform · v4.2
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.02] tracking-tight"
          >
            Protect digital infrastructure with{" "}
            <span className="bg-gradient-to-r from-primary via-accent-glow to-primary bg-clip-text text-transparent text-glow">
              AI-powered cyber intelligence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Real-time threat detection, automated response, and enterprise-grade security operations engineered for modern organizations defending mission-critical systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition glow-orange">
              Schedule Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/solutions" className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary px-5 py-3 text-sm font-semibold transition">
              Explore Solutions
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 grid grid-cols-3 gap-4 max-w-lg"
          >
            {[
              { k: "24/7", v: "Monitoring" },
              { k: "120+", v: "Countries Covered" },
              { k: "10M+", v: "Events / day" },
            ].map((m) => (
              <div key={m.v} className="rounded-lg border border-border bg-card/60 backdrop-blur px-3 py-3">
                <div className="font-display text-xl font-bold text-foreground">{m.k}</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">{m.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="lg:col-span-6">
          <HeroDashboard />
        </div>
      </div>

      {/* bottom scanner line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
}

/* 2. CORE SOLUTIONS */
function Solutions() {
  const items = [
    { icon: Radar, title: "Threat Monitoring", desc: "Continuously monitor infrastructure, endpoints, and network behavior using AI-driven anomaly detection and real-time intelligence." },
    { icon: AlertOctagon, title: "Incident Response", desc: "Rapidly investigate, contain, and recover from cyber incidents with expert-led digital forensics and response operations." },
    { icon: ShieldCheck, title: "Brand & Infrastructure Protection", desc: "Detect phishing domains, impersonation attacks, malicious applications, and infrastructure abuse before they escalate." },
    { icon: FileCheck2, title: "Compliance & Risk Management", desc: "Strengthen governance, reduce operational risk, and align security processes with industry compliance standards." },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="absolute inset-0 cyber-grid grid-mask opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Core Security Solutions"
          title={<>Comprehensive protection, <span className="text-primary">intelligently orchestrated</span>.</>}
          subtitle="A unified set of capabilities powered by advanced intelligence systems and elite cybersecurity expertise."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <div className="group relative h-full rounded-2xl border border-border bg-card/60 p-6 transition hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(255,107,0,0.5)]">
                <div className="absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 group-hover:border-primary/60 group-hover:text-primary transition">
                  <it.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground group-hover:text-primary transition">
                  Learn more <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3. GLOBAL IMPACT */
function GlobalImpact() {
  const stats = [
    { v: 99.7, suf: "%", label: "Threat Mitigation Rate", dec: 1 },
    { v: 120, suf: "+", label: "Countries Protected" },
    { v: 24, suf: "/7", label: "Security Operations" },
    { v: 10, suf: "M+", label: "Threat Events / day" },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-28 bg-[oklch(0.13_0.005_280)] text-[oklch(0.95_0_0)]">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Global Telemetry
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Security at <span className="text-primary">global scale</span>.
          </h2>
          <p className="mt-3 text-white/60 max-w-xl">Operational telemetry from our distributed SOC network — continuous detection, response, and intelligence at planetary scale.</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/30 blur-2xl" />
                <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                  <Counter to={s.v} suffix={s.suf} decimals={s.dec ?? 0} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider font-mono text-white/55">{s.label}</div>
                <div className="mt-4 h-px bg-gradient-to-r from-primary/60 via-white/10 to-transparent" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. WHY US */
function WhyUs() {
  const feats = [
    { icon: Cpu, t: "AI-Powered Threat Detection" },
    { icon: Microscope, t: "Zero-Day Investigation" },
    { icon: Zap, t: "Automated Security Workflows" },
    { icon: Radar, t: "Real-Time Threat Intelligence" },
    { icon: ShieldCheck, t: "Dedicated SOC Analysts" },
    { icon: Globe2, t: "Multi-Region Infrastructure" },
    { icon: Fingerprint, t: "Advanced Threat Forensics" },
    { icon: Cloud, t: "Cloud-Native Architecture" },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <SocVisual />
        </div>
        <div className="lg:col-span-7">
          <SectionHeader
            eyebrow="Why Choose IP Protection"
            title={<>Built for enterprises that <span className="text-primary">cannot fail</span>.</>}
            subtitle="A combined human + machine defense fabric — engineered to detect faster, respond smarter, and recover with zero compromise."
          />
          <div className="mt-10 grid grid-cols-2 gap-3">
            {feats.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.04}>
                <div className="group flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 hover:border-primary/60 transition">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 border border-border group-hover:text-primary group-hover:border-primary/60 transition">
                    <f.icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>
                  <div className="text-sm font-medium leading-snug pt-1.5">{f.t}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocVisual() {
  return (
    <div className="relative aspect-[4/5] w-full rounded-2xl border border-border overflow-hidden bg-[oklch(0.16_0.006_280)]">
      <div className="absolute inset-0 cyber-grid-sm opacity-40" />
      {/* fake SOC wall */}
      <div className="relative h-full w-full p-5 grid grid-rows-6 gap-3">
        <div className="row-span-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-md border border-white/10 bg-white/[0.03] relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid-sm opacity-50" />
              <div className="absolute inset-x-2 top-2 h-1 rounded bg-primary/60" style={{ width: `${30 + (i * 11) % 50}%` }} />
              <div className="absolute inset-x-2 bottom-2 text-[8px] font-mono text-white/40 uppercase">node-{(i + 1).toString().padStart(2, "0")}</div>
            </div>
          ))}
        </div>
        <div className="row-span-2 rounded-md border border-white/10 bg-white/[0.03] relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid-sm opacity-50" />
          <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full">
            <path d="M0 70 L40 50 L80 60 L120 30 L160 45 L200 20 L240 35 L280 25 L320 40 L360 15 L400 30" stroke="oklch(0.72 0.21 42)" strokeWidth="1.5" fill="none" />
            <path d="M0 80 L40 65 L80 75 L120 55 L160 70 L200 50 L240 60 L280 55 L320 65 L360 45 L400 55" stroke="oklch(0.85 0 0 / 0.4)" strokeWidth="1" fill="none" />
          </svg>
          <div className="absolute left-3 top-2 text-[9px] font-mono uppercase tracking-wider text-white/55">SOC · throughput</div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] flex items-center gap-3 px-3">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono text-white/70 uppercase">12 analysts on shift · 3 incidents in-flight</span>
        </div>
      </div>
      {/* scan line */}
      <div className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-primary/20 to-transparent animate-scan" />
    </div>
  );
}

/* 5. PLATFORM */
function Platform() {
  const feats = [
    { icon: Cpu, t: "AI Behavior Analysis", d: "Adaptive ML baselines flag deviations across users, hosts, and workloads." },
    { icon: Network, t: "Threat Correlation Engine", d: "Cross-signal graph reasoning links low-fidelity alerts into incidents." },
    { icon: Plug, t: "SIEM & API Integration", d: "Native connectors for Splunk, Sentinel, Chronicle, EDR and ticketing." },
    { icon: ShieldAlert, t: "Automated Takedown", d: "Orchestrated hosting, registrar and app-store takedown workflows." },
    { icon: Bell, t: "Real-Time Alerting", d: "Prioritized push, webhook, and on-call routing with SLA tracking." },
    { icon: Gauge, t: "Predictive Threat Scoring", d: "Risk scoring informed by global telemetry and adversary modeling." },
    { icon: Fingerprint, t: "Malware Fingerprinting", d: "YARA, ssdeep, and behavioral hashing across hundreds of families." },
    { icon: Cloud, t: "Cloud-Native Infrastructure", d: "Multi-region, isolated, audit-ready and horizontally elastic." },
  ];
  return (
    <section className="relative py-24 sm:py-28 bg-surface">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionHeader
            eyebrow="The Platform"
            title={<>Introducing the <span className="text-primary">IP Protection</span> platform.</>}
            subtitle="An intelligent cybersecurity ecosystem designed for continuous monitoring, detection, and automated response — engineered for the modern enterprise stack."
          />
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Modules · live status
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border/60 md:grid-cols-2 lg:grid-cols-4">
          {feats.map((f, i) => (
            <div key={f.t} className="group relative bg-card p-6 hover:bg-secondary/60 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background group-hover:text-primary group-hover:border-primary/60 transition">
                  <f.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">MOD-{(i + 1).toString().padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 font-display text-base font-semibold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              <div className="absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:via-primary/70 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. INDUSTRIES */
function Industries() {
  const list = [
    { icon: Banknote, t: "Banking & Finance" },
    { icon: Landmark, t: "Government" },
    { icon: HeartPulse, t: "Healthcare" },
    { icon: Server, t: "SaaS Platforms" },
    { icon: ShoppingBag, t: "E-Commerce" },
    { icon: Signal, t: "Telecommunications" },
    { icon: Truck, t: "Logistics" },
    { icon: GraduationCap, t: "Education" },
    { icon: Gamepad2, t: "Gaming" },
    { icon: Film, t: "Media & Entertainment" },
  ];
  return (
    <section className="relative py-24 sm:py-28 bg-[oklch(0.13_0.005_280)] text-[oklch(0.95_0_0)] overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Sector Coverage
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Industries we <span className="text-primary">protect</span>.
          </h2>
          <p className="mt-3 text-white/60">Tailored controls, threat models and compliance posture per industry — deployed across regulated and high-velocity sectors.</p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {list.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.03}>
              <div className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-col items-center text-center hover:border-primary/60 hover:bg-primary/[0.06] transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 text-white/80 group-hover:text-primary group-hover:border-primary/60 transition">
                  <it.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div className="mt-3 text-sm font-medium">{it.t}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. WORKFLOW */
function Workflow() {
  const steps = [
    { icon: Search, t: "Detection", d: "Continuous telemetry analysis flags suspect signals across surfaces." },
    { icon: Microscope, t: "Investigation", d: "Analysts and AI correlate evidence and reconstruct adversary intent." },
    { icon: ShieldAlert, t: "Response", d: "Contain, isolate, and neutralize active threats with playbook automation." },
    { icon: RotateCcw, t: "Recovery", d: "Restore operations, validate integrity, and reinforce affected systems." },
    { icon: ShieldPlus, t: "Prevention", d: "Update controls, hunting rules, and intelligence to harden the perimeter." },
  ];
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Operational Workflow"
          title={<>How our security <span className="text-primary">process</span> works.</>}
          subtitle="A closed-loop defense lifecycle — every signal is detected, investigated, neutralized and converted into hardened prevention."
        />

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent hidden md:block" />
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.08}>
                <div className="relative">
                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background glow-orange">
                    <s.icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                    <span className="absolute -top-2 -right-2 font-mono text-[10px] font-semibold text-primary bg-background border border-primary/40 rounded-md px-1.5 py-0.5">0{i + 1}</span>
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="font-display text-base font-semibold">{s.t}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 8. TRUST */
function Trust() {
  const logos = ["NORTHWIND", "ACME CORP", "HELIOS", "ORBITAL", "QUANTIQ", "STRATUS", "NOVAGRID", "VERTEX"];
  const tts = [
    { q: "Their real-time monitoring and response capabilities significantly improved our security posture across multiple regions.", a: "CISO, Global Financial Group" },
    { q: "IP Protection cut our mean-time-to-respond from hours to minutes. The SOC integration was seamless.", a: "Head of SecOps, SaaS Platform" },
    { q: "An indispensable extension of our team — the intelligence depth is unmatched at this scale.", a: "Director of Cyber Defense, Telecoms" },
  ];
  return (
    <section className="relative py-24 sm:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Trusted Partners"
          title={<>Built on trust. <span className="text-primary">Backed by results.</span></>}
          subtitle="Selected organizations relying on IP Protection for continuous cyber defense and intelligence operations."
          align="center"
        />

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px overflow-hidden rounded-2xl border border-border bg-border/60">
          {logos.map((l) => (
            <div key={l} className="bg-card flex items-center justify-center py-6 font-display text-sm font-semibold tracking-[0.18em] text-muted-foreground hover:text-foreground transition">
              {l}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tts.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 relative">
                <Quote className="h-5 w-5 text-primary/60" />
                <p className="mt-3 text-sm leading-relaxed">{t.q}</p>
                <div className="mt-5 pt-4 border-t border-border text-xs font-mono uppercase tracking-wider text-muted-foreground">{t.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9. FINAL CTA */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[oklch(0.62_0.22_38)] to-[oklch(0.45_0.18_30)]" />
      <div className="absolute inset-0 cyber-grid opacity-15" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-white/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 text-white">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
            Build a stronger cyber defense strategy.
          </h2>
          <p className="mt-4 text-white/85 max-w-xl">
            Partner with a cybersecurity team that delivers continuous protection, intelligent monitoring, and rapid incident response — at enterprise scale.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-black/90 hover:bg-black px-5 py-3 text-sm font-semibold text-white transition">
              Talk to Security Experts <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 backdrop-blur hover:bg-white/20 px-5 py-3 text-sm font-semibold text-white transition">
              Request Security Assessment
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <LaptopMock />
        </div>
      </div>
    </section>
  );
}

function LaptopMock() {
  return (
    <div className="relative mx-auto max-w-md">
      <div className="rounded-t-xl border border-white/30 bg-[oklch(0.13_0.005_280)] p-3">
        <div className="flex items-center gap-1.5 pb-2">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
        <div className="aspect-[16/10] rounded-md border border-white/10 bg-black/40 relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid-sm opacity-50" />
          <div className="absolute inset-3 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded bg-white/[0.04] border border-white/10 p-2">
                <div className="h-1 w-2/3 rounded bg-primary/70 mb-1.5" />
                <div className="h-1 w-1/2 rounded bg-white/30" />
              </div>
            ))}
          </div>
          <div className="absolute inset-x-3 bottom-3 h-1 rounded bg-gradient-to-r from-primary via-accent-glow to-primary animate-pulse" />
        </div>
      </div>
      <div className="h-3 rounded-b-2xl bg-[oklch(0.18_0.006_280)] border-x border-b border-white/20" />
      <div className="mx-auto h-1 w-24 rounded-b-xl bg-white/10" />
    </div>
  );
}
